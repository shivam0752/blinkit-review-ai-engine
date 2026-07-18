import React, { useState } from 'react';
import { Database, Layers, Sparkles, Settings, BarChart3, ArrowRight, Code } from 'lucide-react';

export default function ArchitectureDiagram() {
  const [showDetails, setShowDetails] = useState(true);

  return (
    <div className="sandbox-architecture glass" style={{ padding: '1.5rem 1.75rem', marginBottom: '2rem' }}>
      
      {/* Tech Stack Banner */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '1rem', 
        paddingBottom: '1rem', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        marginBottom: '1.25rem',
        fontSize: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <Code size={16} className="text-accent" />
          <span style={{ color: 'var(--text-muted)' }}><strong>Pipeline Tech Stack:</strong></span>
          <span className="badge badge-accent" style={{ fontSize: '0.65rem', padding: '0.25rem 0.5rem' }}>Apify SDK</span>
          <span className="badge badge-accent" style={{ fontSize: '0.65rem', padding: '0.25rem 0.5rem' }}>Python (Pandas)</span>
          <span className="badge badge-accent" style={{ fontSize: '0.65rem', padding: '0.25rem 0.5rem' }}>Gemini 2.0 Flash API</span>
          <span className="badge badge-accent" style={{ fontSize: '0.65rem', padding: '0.25rem 0.5rem' }}>Vercel Serverless</span>
          <span className="badge badge-accent" style={{ fontSize: '0.65rem', padding: '0.25rem 0.5rem' }}>React (Vite)</span>
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
            textDecoration: 'underline',
            outline: 'none'
          }}
        >
          {showDetails ? 'Hide Detailed File Mapping' : 'Show Detailed File Mapping'}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', width: '100%', marginBottom: '0.5rem' }}>
        
        {/* Title side */}
        <div style={{ flex: '1 1 220px' }}>
          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.5px' }}>Pipeline Data Flow</h4>
          <p style={{ margin: '0.35rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: '1.4' }}>
            From raw user voice to synthesized customer research insight cards.
          </p>
        </div>

        {/* Steps side */}
        <div style={{ flex: '3 1 650px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '6px' }}>
          
          {/* Step 1: Ingestion */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            background: 'rgba(56, 189, 248, 0.06)', 
            padding: '0.5rem 0.8rem', 
            borderRadius: '8px', 
            border: '1px solid rgba(56, 189, 248, 0.25)', 
            flexShrink: 0 
          }}>
            <Database size={16} style={{ color: '#38bdf8' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>1. Ingestion</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '2px' }}>Apify Scrapers</div>
            </div>
          </div>

          <ArrowRight size={14} style={{ opacity: 0.4, flexShrink: 0, color: 'var(--text-secondary)' }} />

          {/* Step 2: Cleansing */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            background: 'rgba(192, 132, 252, 0.06)', 
            padding: '0.5rem 0.8rem', 
            borderRadius: '8px', 
            border: '1px solid rgba(192, 132, 252, 0.25)', 
            flexShrink: 0 
          }}>
            <Layers size={16} style={{ color: '#c084fc' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c084fc' }}>2. Cleansing</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '2px' }}>Pandas Filter</div>
            </div>
          </div>

          <ArrowRight size={14} style={{ opacity: 0.4, flexShrink: 0, color: 'var(--text-secondary)' }} />

          {/* Step 3: LLM */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            background: 'rgba(251, 191, 36, 0.08)', 
            padding: '0.5rem 0.8rem', 
            borderRadius: '8px', 
            border: '1px solid rgba(251, 191, 36, 0.4)', 
            flexShrink: 0 
          }}>
            <Sparkles size={16} style={{ color: '#fbbf24' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24' }}>3. Gemini LLM</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '2px' }}>100-batch Classify</div>
            </div>
          </div>

          <ArrowRight size={14} style={{ opacity: 0.4, flexShrink: 0, color: 'var(--text-secondary)' }} />

          {/* Step 4: Quality */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            background: 'rgba(251, 146, 60, 0.06)', 
            padding: '0.5rem 0.8rem', 
            borderRadius: '8px', 
            border: '1px solid rgba(251, 146, 60, 0.25)', 
            flexShrink: 0 
          }}>
            <Settings size={16} style={{ color: '#fb923c' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fb923c' }}>4. Quality Check</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '2px' }}>Human-in-the-loop</div>
            </div>
          </div>

          <ArrowRight size={14} style={{ opacity: 0.4, flexShrink: 0, color: 'var(--text-secondary)' }} />

          {/* Step 5: Dashboard */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            background: 'rgba(74, 222, 128, 0.06)', 
            padding: '0.5rem 0.8rem', 
            borderRadius: '8px', 
            border: '1px solid rgba(74, 222, 128, 0.25)', 
            flexShrink: 0 
          }}>
            <BarChart3 size={16} style={{ color: '#4ade80' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4ade80' }}>5. UI Dashboard</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '2px' }}>React Charts</div>
            </div>
          </div>

        </div>
      </div>

      {/* Expanded File details grid */}
      {showDetails && (
        <div style={{ 
          marginTop: '1.5rem', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          fontSize: '0.8rem',
          lineHeight: '1.5'
        }}>
          <div style={{ padding: '0.25rem' }}>
            <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>1. Data Gathering</strong>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>
              Scrapes organic social posts (via Apify) & app store reviews.
            </p>
            <div style={{ 
              fontSize: '0.72rem', 
              color: 'var(--text-muted)', 
              padding: '0.35rem 0.5rem', 
              backgroundColor: 'rgba(255,255,255,0.02)', 
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.04)',
              wordBreak: 'break-all'
            }}>
              📁 <code>pipeline/twitter_reddit_extractor.py</code>
            </div>
          </div>

          <div style={{ padding: '0.25rem' }}>
            <strong style={{ color: '#c084fc', display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>2. Pandas Cleansing</strong>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>
              Deduplicates text, filters nulls, and deletes reviews sub-3 words.
            </p>
            <div style={{ 
              fontSize: '0.72rem', 
              color: 'var(--text-muted)', 
              padding: '0.35rem 0.5rem', 
              backgroundColor: 'rgba(255,255,255,0.02)', 
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.04)',
              wordBreak: 'break-all'
            }}>
              📁 <code>pipeline/script.ipynb</code>
            </div>
          </div>

          <div style={{ padding: '0.25rem' }}>
            <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>3. Gemini Classification</strong>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>
              Batch classifies (100 RPM) sentiments, tags, and mapping.
            </p>
            <div style={{ 
              fontSize: '0.72rem', 
              color: 'var(--text-muted)', 
              padding: '0.35rem 0.5rem', 
              backgroundColor: 'rgba(255,255,255,0.02)', 
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.04)',
              wordBreak: 'break-all'
            }}>
              📁 <code>api/gemini.js</code>, <code>classified_reviews.csv</code>
            </div>
          </div>

          <div style={{ padding: '0.25rem' }}>
            <strong style={{ color: '#fb923c', display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>4. PM Quality Audit</strong>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>
              Human audits Hinglish/Hindi tags and overrides classifications.
            </p>
            <div style={{ 
              fontSize: '0.72rem', 
              color: 'var(--text-muted)', 
              padding: '0.35rem 0.5rem', 
              backgroundColor: 'rgba(255,255,255,0.02)', 
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.04)',
              wordBreak: 'break-all'
            }}>
              📁 <code>src/App.jsx</code>, <code>validation_audit_sample.csv</code>
            </div>
          </div>

          <div style={{ padding: '0.25rem' }}>
            <strong style={{ color: '#4ade80', display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>5. UI Visualization</strong>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>
              Aggregates metrics, displays segments, and renders charts.
            </p>
            <div style={{ 
              fontSize: '0.72rem', 
              color: 'var(--text-muted)', 
              padding: '0.35rem 0.5rem', 
              backgroundColor: 'rgba(255,255,255,0.02)', 
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.04)',
              wordBreak: 'break-all'
            }}>
              📁 <code>src/App.jsx</code>, <code>src/components/*</code>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
