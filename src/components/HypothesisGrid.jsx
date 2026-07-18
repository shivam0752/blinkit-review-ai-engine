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
                <div className="q-badge">Question Q{item.question_id}</div>
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
                <h4><Sparkles size={16} className="text-accent" /> Synthesized LLM Summary</h4>
                <p>{selectedInsight.summary}</p>
              </div>

              <div className="themes-container">
                <h4>Key Themes Identified</h4>
                <div className="themes-list">
                  {parsePythonicJSON(selectedInsight.key_themes).map((theme, i) => (
                    <div key={i} className="theme-item">
                      <div className="theme-meta">
                        <span className="theme-title">{theme.title}</span>
                        <span className="theme-freq">Mentions: {theme.frequency}</span>
                      </div>
                      <p className="theme-desc">{theme.description}</p>
                      <div className="theme-progress">
                        <div className="theme-progress-fill" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  ))}
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
