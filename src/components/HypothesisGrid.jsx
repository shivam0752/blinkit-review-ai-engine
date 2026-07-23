import React from 'react';
import { ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

export default function HypothesisGrid({
  insightsData,
  selectedQid,
  setSelectedQid,
  selectedInsight,
  parsePythonicJSON
}) {
  return (
    <>
      {/* Questions Grid */}
      <div className="section-container">
        <h2 className="section-title">Growth Discovery Hypotheses</h2>
        <p className="section-description">Select a discovery question to view synthesized insights, themes, and verbatim customer evidence.</p>

        <div className="questions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {insightsData.map(item => (
            <div
              key={item.question_id}
              className={`question-card glass ${Number(item.question_id) === Number(selectedQid) ? 'active' : ''}`}
              onClick={() => setSelectedQid(item.question_id)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div className="q-badge" style={{ margin: 0 }}>Question Q{item.question_id}</div>
                  <div style={{
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    backgroundColor: Number(item.confidence) >= 0.9 ? 'rgba(16, 185, 129, 0.15)' : Number(item.confidence) >= 0.7 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: Number(item.confidence) >= 0.9 ? '#10B981' : Number(item.confidence) >= 0.7 ? '#F59E0B' : '#EF4444',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    Conf: {Math.round(Number(item.confidence) * 100)}%
                  </div>
                </div>
                <div className="q-text">{item.question_text}</div>
              </div>
              <div className="q-footer">
                <span className="q-arrow-btn">Explore <ArrowRight size={14} /></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Panel Drawer */}
      {selectedInsight && (
        <div className="insights-detail-panel glass mt-3">
          <div className="panel-header">
            <span className="question-number">Q{selectedInsight.question_id}</span>
            <h3 className="panel-title-text">{selectedInsight.question_text}</h3>
            <button className="close-btn" onClick={() => setSelectedQid(null)}>✕</button>
          </div>

          <div className="panel-body">
            <div className="panel-left">
              <div className="summary-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ margin: 0 }}><Sparkles size={16} className="text-accent" /> Synthesized LLM Summary</h4>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    backgroundColor: Number(selectedInsight.confidence) >= 0.9 ? 'rgba(16, 185, 129, 0.15)' : Number(selectedInsight.confidence) >= 0.7 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: Number(selectedInsight.confidence) >= 0.9 ? '#10B981' : Number(selectedInsight.confidence) >= 0.7 ? '#F59E0B' : '#EF4444',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid currentColor'
                  }}>
                    AI Confidence Score: {Math.round(Number(selectedInsight.confidence) * 100)}%
                  </div>
                </div>
                <p>{selectedInsight.summary}</p>
              </div>

              <div className="themes-container">
                <h4>Key Themes Identified</h4>
                <div className="themes-list">
                  {(() => {
                    const themes = parsePythonicJSON(selectedInsight.key_themes);
                    const maxFreq = Math.max(...themes.map(t => Number(t.frequency) || 1)) || 1;
                    return themes.map((theme, i) => (
                      <div key={i} className="theme-item">
                        <div className="theme-meta">
                          <span className="theme-title">{theme.title}</span>
                          <span className="theme-freq">Mentions: {theme.frequency}</span>
                        </div>
                        <p className="theme-desc">{theme.description}</p>
                        <div className="theme-progress">
                          <div className="theme-progress-fill" style={{ width: `${(Number(theme.frequency) / maxFreq) * 100}%`, backgroundColor: '#3B82F6' }}></div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <div className="limitations-box">
                <h5><HelpCircle size={14} /> Limitations & Caveats</h5>
                <p>{selectedInsight.limitations || "No major data limitations reported."}</p>
              </div>
            </div>

            <div className="panel-right">
              <div className="quotes-container">
                <h4>Representative Quotes</h4>
                <div className="quotes-list">
                  {parsePythonicJSON(selectedInsight.representative_quotes).map((quote, idx) => (
                    <div key={idx} className="quote-card" style={{ marginBottom: '1rem' }}>
                      <p className="quote-text">"{quote.text}"</p>
                      <div className="quote-meta">
                        <span className="quote-source">
                          <span className={`badge badge-source-${quote.source?.toLowerCase()}`}>
                            {quote.source?.replace('_', ' ')}
                          </span>
                        </span>
                        <span className="quote-id">Review ID: {quote.review_id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
