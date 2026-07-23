import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

// Helper to parse simple CSV entries without full external parser dependencies
function parseCSV(text) {
  const lines = [];
  let row = [''];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      lines.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== '') lines.push(row);
  return lines;
}

// Pure JS fallback scraping for App Store RSS feed
async function fetchAppStoreFeedJS(monthsLimit) {
  const APP_STORE_ID = 960335206;
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - monthsLimit);
  const collected = [];

  try {
    for (let page = 1; page <= 3; page++) {
      const url = `https://itunes.apple.com/in/rss/customerreviews/page=${page}/id=${APP_STORE_ID}/sortby=mostrecent/json`;
      const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!response.ok) break;
      const data = await response.json();
      const entries = data.feed?.entry || [];
      if (entries.length === 0) break;

      for (const e of entries) {
        if (!e['im:rating'] || !e.content) continue;
        const dateStr = e.updated?.label;
        const dt = dateStr ? new Date(dateStr) : null;
        
        if (dt && dt < cutoffDate) continue;
        
        collected.push({
          source: 'app_store',
          text: e.content.label,
          rating: parseFloat(e['im:rating'].label),
          date: dt ? dt.toISOString() : dateStr || '',
          author: e.author?.name?.label || 'unknown',
          url: `https://apps.apple.com/in/app/id${APP_STORE_ID}`
        });
      }
    }
  } catch (err) {
    console.error('App Store JS Scraper fallback error:', err);
  }
  return collected;
}

// Local CSV fallback search for Play Store & Forums
function fetchCSVFallbackJS(sources, monthsLimit) {
  const collected = [];
  const cutoffDate = new Date('2026-07-23T16:41:52+05:30'); // System base date
  cutoffDate.setMonth(cutoffDate.getMonth() - monthsLimit);

  try {
    // Try to read from project/public/final-data/classified_reviews.csv
    const relativePath = 'public/final-data/classified_reviews.csv';
    const absolutePath = path.resolve(process.cwd(), relativePath);
    const altAbsolutePath = path.resolve(process.cwd(), 'project', relativePath);
    
    let csvPath = '';
    if (fs.existsSync(absolutePath)) {
      csvPath = absolutePath;
    } else if (fs.existsSync(altAbsolutePath)) {
      csvPath = altAbsolutePath;
    }

    if (csvPath) {
      const content = fs.readFileSync(csvPath, 'utf8');
      const rows = parseCSV(content);
      const headers = rows[0];
      const sIdx = headers.indexOf('source');
      const dIdx = headers.indexOf('date');
      const tIdx = headers.indexOf('text');
      const rIdx = headers.indexOf('rating');
      const aIdx = headers.indexOf('author');
      const uIdx = headers.indexOf('url');

      rows.slice(1).forEach(r => {
        const src = r[sIdx];
        const dateStr = r[dIdx];
        if (!src || !dateStr) return;

        // Map filters
        let matchSource = false;
        if (sources.includes('play_store') && src.includes('play_store')) matchSource = true;
        if (sources.includes('app_store') && src.includes('app_store')) matchSource = true;
        if ((sources.includes('reddit') || sources.includes('twitter') || sources.includes('forums')) && 
            (src.includes('reddit') || src.includes('twitter') || src.includes('x') || src.startsWith('web:'))) {
          matchSource = true;
        }

        if (!matchSource) return;

        const cleanDateStr = dateStr.replace(/·/g, ' ').replace(/\s+/g, ' ');
        const dt = new Date(cleanDateStr);
        if (isNaN(dt.getTime())) return;
        if (dt < cutoffDate) return;

        collected.push({
          source: src.includes('play_store') ? 'play_store' : (src.includes('app_store') ? 'app_store' : (src.includes('reddit') ? 'reddit' : 'twitter')),
          text: r[tIdx] || '',
          rating: r[rIdx] ? parseFloat(r[rIdx]) : null,
          date: dt.toISOString(),
          author: r[aIdx] || 'Anonymous',
          url: r[uIdx] || ''
        });
      });
    }
  } catch (err) {
    console.error('CSV local fallback read error:', err);
  }
  return collected;
}

export default async (req, res) => {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Support GET and POST
  let sourcesQuery = '';
  let monthsQuery = '3';

  if (req.method === 'POST') {
    sourcesQuery = req.body.sources || '';
    monthsQuery = req.body.months || '3';
  } else {
    sourcesQuery = req.query.sources || '';
    monthsQuery = req.query.months || '3';
  }

  const months = parseInt(monthsQuery, 10) || 3;
  const sources = sourcesQuery.split(',').map(s => s.trim()).filter(Boolean);

  if (sources.length === 0) {
    return res.status(400).json({ error: 'At least one source must be specified.' });
  }

  // Construct absolute path to python script
  const scriptRelativePath = 'pipeline/scrape_realtime.py';
  const scriptPath = path.resolve(process.cwd(), scriptRelativePath);
  const altScriptPath = path.resolve(process.cwd(), 'project', scriptRelativePath);
  
  let targetScript = '';
  if (fs.existsSync(scriptPath)) {
    targetScript = scriptPath;
  } else if (fs.existsSync(altScriptPath)) {
    targetScript = altScriptPath;
  }

  if (targetScript) {
    const cmd = `python "${targetScript}" --sources "${sources.join(',')}" --months ${months}`;
    
    exec(cmd, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Python scraper failed: ${stderr}. Executing JavaScript fallback...`);
        const fallbackData = await runJSFallback(sources, months);
        return res.status(200).json(fallbackData);
      }

      try {
        const results = JSON.parse(stdout.trim());
        return res.status(200).json(results);
      } catch (jsonErr) {
        console.error('JSON parse of python output failed. Executing JavaScript fallback...');
        const fallbackData = await runJSFallback(sources, months);
        return res.status(200).json(fallbackData);
      }
    });
  } else {
    console.log('Python script not found. Running JavaScript scraping and fallback...');
    const fallbackData = await runJSFallback(sources, months);
    return res.status(200).json(fallbackData);
  }
};

// Orchestrates pure JS fetchers and local database fallback
async function runJSFallback(sources, months) {
  let combined = [];

  // 1. Fetch App Store RSS if selected (real-time HTTP request in Node)
  if (sources.includes('app_store')) {
    const appStoreData = await fetchAppStoreFeedJS(months);
    combined.push(...appStoreData);
  }

  // 2. Fetch Play Store and Forums from local CSV if selected
  const csvSources = sources.filter(s => s !== 'app_store' || combined.length === 0);
  if (csvSources.length > 0) {
    const csvData = fetchCSVFallbackJS(sources, months);
    // filter out app_store from CSV if we already fetched it live
    const filteredCSV = csvData.filter(r => !(r.source === 'app_store' && sources.includes('app_store')));
    combined.push(...filteredCSV);
  }

  return combined;
}
