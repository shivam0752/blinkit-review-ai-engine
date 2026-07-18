import React, { useState } from 'react';
import { Database, Layers, Sparkles, Settings, BarChart3, ArrowRight, HelpCircle, Code } from 'lucide-react';

export default function ArchitectureDiagram() {
  const [showDetails, setShowDetails] = useState(true);

  return (
    <div className="sandbox-architecture glass" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
      
      {/* Tech Stack Banner */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '0.75rem', 
        paddingBottom: '0.75rem', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        marginBottom: '1rem',
        fontSize: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code size={16} className="text-accent" />
          <span style={{ color: 'var(--text-muted)' }}><strong>Pipeline Tech Stack:</strong></span>
          <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>Apify SDK</span>
          <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>Python (Pandas)</span>
          <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>Gemini 2.0 Flash API</span>
          <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>Vercel Serverless</span>
          <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>React (Vite)</span>
        </div>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-yellow)',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 600,
            textDecoration: 'underline'
          }}
        >
          {showDetails ? 'Hide Detailed File Mapping' : 'Show Detailed File Mapping'}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', width: '100%' }}>
        
        {/* Title side */}
        <div style={{ flex: '1 1 200px' }}>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.5px' }}>Pipeline Data Flow</h4>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: '1.4' }}>
            From raw user voice to synthesized customer research insight cards.
          </p>
        </div>

        {/* Steps side */}
        <div style={{ flex: '3 1 650px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '4px' }}>
          
          {/* Step 1: Ingestion */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            background: 'rgba(56, 189, 248, 0.06)', 
            padding: '0.5rem 0.75rem', 
            borderRadius: '8px', 
            border: '1px solid rgba(56, 189, 248, 0.25)', 
            flexShrink: 0 
          }}>
            <Database size={16} style={{ color: '#38bdf8' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>1. Ingestion</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)' }}>Apify Scrapers</div>
            </div>
          </div>

          <ArrowRight size={14} style={{ opacity: 0.4, flexShrink: 0, color: 'var(--text-secondary)' }} />

          {/* Step 2: Cleansing */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            background: 'rgba(192, 132, 252, 0.06)', 
            padding: '0.5rem 0.75rem', 
            borderRadius: '8px', 
            border: '1px solid rgba(192, 132, 252, 0.25)', 
            flexShrink: 0 
          }}>
            <Layers size={16} style={{ color: '#c084fc' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c084fc' }}>2. Cleansing</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)' }}>Pandas Filter</div>
            </div>
          </div>

          <ArrowRight size={14} style={{ opacity: 0.4, flexShrink: 0, color: 'var(--text-secondary)' }} />

          {/* Step 3: LLM */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            background: 'rgba(251, 191, 36, 0.08)', 
            padding: '0.5rem 0.75rem', 
            borderRadius: '8px', 
            border: '1px solid rgba(251, 191, 36, 0.4)', 
            flexShrink: 0 
          }}>
            <Sparkles size={16} style={{ color: '#fbbf24' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24' }}>3. Gemini LLM</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)' }}>100-batch Classify</div>
            </div>
          </div>

          <ArrowRight size={14} style={{ opacity: 0.4, flexShrink: 0, color: 'var(--text-secondary)' }} />

          {/* Step 4: Quality */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            background: 'rgba(251, 146, 60, 0.06)', 
            padding: '0.5rem 0.75rem', 
            borderRadius: '8px', 
            border: '1px solid rgba(251, 146, 60, 0.25)', 
            flexShrink: 0 
          }}>
            <Settings size={16} style={{ color: '#fb923c' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fb923c' }}>4. Quality Check</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)' }}>Human-in-the-loop</div>
            </div>
          </div>

          <ArrowRight size={14} style={{ opacity: 0.4, flexShrink: 0, color: 'var(--text-secondary)' }} />

          {/* Step 5: Dashboard */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            background: 'rgba(74, 222, 128, 0.06)', 
            padding: '0.5rem 0.75rem', 
            borderRadius: '8px', 
            border: '1px solid rgba(74, 222, 128, 0.25)', 
            flexShrink: 0 
          }}>
            <BarChart3 size={16} style={{ color: '#4ade80' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4ade80' }}>5. UI Dashboard</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)' }}>React Charts</div>
            </div>
          </div>

        </div>
      </div>

      {/* Expanded File details grid */}
      {showDetails && (
        <div style={{ 
          marginTop: '1.25rem', 
          paddingTop: '1.25rem', 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          fontSize: '0.78rem',
          lineHeight: '1.4'
        }}>
          <div>
            <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '0.2rem' }}>1. Data Gathering</strong>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Scrapes organic social posts (via Apify) & app store reviews.
            </p>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
              📁 <code>pipeline/twitter_reddit_extractor.py</code>
            </span>
          </div>

          <div>
            <strong style={{ color: '#c084fc', display: 'block', marginBottom: '0.2rem' }}>2. Pandas Cleansing</strong>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Deduplicates text, filters nulls, and deletes reviews sub-3 words.
            </p>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
              📁 <code>pipeline/script.ipynb</code>
            </span>
          </div>

          <div>
            <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '0.2rem' }}>3. Gemini Classification</strong>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Batch classifies (100 RPM) sentiments, tags, and mapping.
            </p>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
              📁 <code>api/gemini.js</code>, <code>classified_reviews.csv</code>
            </span>
          </div>

          <div>
            <strong style={{ color: '#fb923c', display: 'block', marginBottom: '0.2rem' }}>4. PM Quality Audit</strong>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Human audits Hinglish/Hindi tags and overrides classifications.
            </p>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
              📁 <code>src/App.jsx</code>, <code>validation_audit_sample.csv</code>
            </span>
          </div>

          <div>
            <strong style={{ color: '#4ade80', display: 'block', marginBottom: '0.2rem' }}>5. UI visualization</strong>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Aggregates metrics, displays segments, and renders charts.
            </p>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
              📁 <code>src/App.jsx</code>, <code>src/components/*</code>
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
