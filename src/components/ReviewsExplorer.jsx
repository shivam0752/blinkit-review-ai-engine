import React from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReviewsExplorer({
  searchQuery,
  setSearchQuery,
  filterSentiment,
  setFilterSentiment,
  filterTag,
  setFilterTag,
  filterSource,
  setFilterSource,
  sortBy,
  setSortBy,
  CATEGORY_TAGS,
  currentReviews,
  parsePythonicJSON,
  explorerList,
  currentPage,
  setCurrentPage,
  reviewsPerPage,
  totalPages
}) {
  return (
    <div className="section-container">
      <div className="section-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 className="section-title">Raw Feedback Explorer</h2>
          <p className="section-description">Filter, search, and verify individual customer reviews mapped by the classifier.</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="explorer-filters-bar glass mb-2">
        <div className="search-input-wrapper">
          <Search size={16} className="search-input-icon" />
          <input
            type="text"
            placeholder="Search Blinkit customer reviews (e.g., refund, delivery)..."
            className="explorer-input-field"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div>
          <select className="explorer-select-field" value={filterSentiment} onChange={(e) => { setFilterSentiment(e.target.value); setCurrentPage(1); }}>
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
        <div>
          <select className="explorer-select-field" value={filterTag} onChange={(e) => { setFilterTag(e.target.value); setCurrentPage(1); }}>
            <option value="all">All Category Tags</option>
            {CATEGORY_TAGS.map(t => (
              <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div>
          <select className="explorer-select-field" value={filterSource} onChange={(e) => { setFilterSource(e.target.value); setCurrentPage(1); }}>
            <option value="all">All Sources</option>
            <option value="play_store">Google Play</option>
            <option value="app_store">App Store</option>
            <option value="reddit">Reddit</option>
            <option value="twitter">Twitter/X</option>
          </select>
        </div>
        <div>
          <select className="explorer-select-field" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="rating-desc">Rating: High to Low</option>
            <option value="rating-asc">Rating: Low to High</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-responsive glass">
        <table className="reviews-table">
          <thead>
            <tr>
              <th style={{ width: '70px' }}>ID</th>
              <th style={{ width: '110px' }}>Source</th>
              <th>Feedback Content</th>
              <th style={{ width: '110px' }}>Sentiment</th>
              <th style={{ width: '110px' }}>Rating</th>
              <th style={{ width: '120px' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  No reviews found matching the filters.
                </td>
              </tr>
            ) : (
              currentReviews.map(r => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td>
                    <span className={`badge badge-source-${r.source?.toLowerCase()}`}>
                      {r.source?.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{r.author || 'Anonymous'}</div>
                    <p style={{ marginTop: '0.2rem', fontSize: '0.9rem', lineHeight: '1.4' }}>{r.text}</p>
                    <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                      {parsePythonicJSON(r.category_tags).map((tag, i) => (
                        <span key={i} className="badge badge-accent" style={{ fontSize: '0.7rem' }}>{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-sentiment-${r.sentiment?.toLowerCase()}`}>
                      {r.sentiment}
                    </span>
                  </td>
                  <td>
                    <div className="stars-row" style={{ color: 'var(--accent-yellow)' }}>
                      {'★'.repeat(Math.round(Number(r.rating || 0)))}
                      {'☆'.repeat(5 - Math.round(Number(r.rating || 0)))}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination */}
      <div className="table-pagination mt-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
          Showing {Math.min(explorerList.length, (currentPage - 1) * reviewsPerPage + 1)}-{Math.min(explorerList.length, currentPage * reviewsPerPage)} of {explorerList.length} reviews
        </span>
        <div className="pagination-btns" style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="btn btn-secondary btn-sm"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="btn btn-secondary btn-sm"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
