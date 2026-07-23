import React, { useState } from 'react';
import { RefreshCw, Settings, Check } from 'lucide-react';

export default function RealtimeScraperControl({ pipelineRunning, onInitiate }) {
  const [pipelineSourceMode, setPipelineSourceMode] = useState('demo'); // 'demo' or 'realtime'
  const [selectedSources, setSelectedSources] = useState({
    playStore: true,
    appStore: true,
    forums: true
  });
  const [timeRangeMonths, setTimeRangeMonths] = useState(3);

  const handleCheckboxChange = (key) => {
    setSelectedSources(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInitiate = () => {
    onInitiate({
      mode: pipelineSourceMode,
      selectedSources,
      timeRangeMonths
    });
  };

  const isScraperDisabled = pipelineSourceMode === 'realtime' && 
    !(selectedSources.playStore || selectedSources.appStore || selectedSources.forums);

  return (
    <div className="setup-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'center' }}>
      <div className="pipeline-card-status" style={{ marginBottom: '0.25rem' }}>
        <h5 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <RefreshCw size={16} className="text-accent" style={{ animation: 'spin 8s linear infinite' }} /> 
          Vercel Serverless Pipeline
        </h5>
      </div>

      {/* Mode Selector Tab Group */}
      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Execution Dataset Mode:
        </label>
        <div style={{ display: 'flex', border: '1px solid var(--border-glass)', borderRadius: '8px', overflow: 'hidden', padding: '2px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.55rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              backgroundColor: pipelineSourceMode === 'demo' ? 'var(--accent-yellow)' : 'transparent',
              color: pipelineSourceMode === 'demo' ? '#000' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              fontFamily: 'var(--font-sans)'
            }}
            onClick={() => setPipelineSourceMode('demo')}
          >
            Demo Case (50 reviews)
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.55rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              backgroundColor: pipelineSourceMode === 'realtime' ? 'var(--accent-yellow)' : 'transparent',
              color: pipelineSourceMode === 'realtime' ? '#000' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              fontFamily: 'var(--font-sans)'
            }}
            onClick={() => setPipelineSourceMode('realtime')}
          >
            Real-Time Scraper
          </button>
        </div>
      </div>

      {/* Config Panel for Real-Time Scraper */}
      {pipelineSourceMode === 'realtime' && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem', 
          padding: '1rem', 
          border: '1px solid var(--border-glass)', 
          borderRadius: '8px', 
          backgroundColor: 'rgba(255,255,255,0.01)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>
              Select Data Channels:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <input
                  type="checkbox"
                  checked={selectedSources.playStore}
                  onChange={() => handleCheckboxChange('playStore')}
                  style={{ 
                    accentColor: 'var(--accent-yellow)', 
                    width: '15px', 
                    height: '15px',
                    cursor: 'pointer'
                  }}
                />
                <span>Google Play Store</span>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <input
                  type="checkbox"
                  checked={selectedSources.appStore}
                  onChange={() => handleCheckboxChange('appStore')}
                  style={{ 
                    accentColor: 'var(--accent-yellow)', 
                    width: '15px', 
                    height: '15px',
                    cursor: 'pointer'
                  }}
                />
                <span>Apple App Store</span>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <input
                  type="checkbox"
                  checked={selectedSources.forums}
                  onChange={() => handleCheckboxChange('forums')}
                  style={{ 
                    accentColor: 'var(--accent-yellow)', 
                    width: '15px', 
                    height: '15px',
                    cursor: 'pointer'
                  }}
                />
                <span>Forums (Reddit & Twitter)</span>
              </label>
            </div>
            {isScraperDisabled && (
              <span style={{ fontSize: '0.72rem', color: 'var(--color-danger)', marginTop: '0.4rem', display: 'block', fontWeight: 500 }}>
                ⚠️ Please select at least one source channel!
              </span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
              Lookback Period:
            </label>
            <select
              value={timeRangeMonths}
              onChange={(e) => setTimeRangeMonths(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.55rem',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              <option value={1}>Last 1 Month</option>
              <option value={2}>Last 2 Months</option>
              <option value={3}>Last 3 Months</option>
              <option value={6}>Last 6 Months</option>
            </select>
          </div>
        </div>
      )}

      {/* Initiation button */}
      <button
        className="btn btn-primary btn-full"
        disabled={pipelineRunning || isScraperDisabled}
        onClick={handleInitiate}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.75rem',
          fontWeight: 700,
          fontFamily: 'var(--font-sans)',
          cursor: (pipelineRunning || isScraperDisabled) ? 'not-allowed' : 'pointer'
        }}
      >
        {pipelineRunning ? (
          <RefreshCw className="fa-spin" size={16} />
        ) : (
          <svg style={{ width: '12px', height: '12px', fill: 'currentColor' }} viewBox="0 0 448 512">
            <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/>
          </svg>
        )}
        <span>
          {pipelineRunning 
            ? 'Running pipeline...' 
            : (pipelineSourceMode === 'demo' ? 'Initiate Automated Pipeline' : 'Initiate Real-Time Pipeline')
          }
        </span>
      </button>
    </div>
  );
}
