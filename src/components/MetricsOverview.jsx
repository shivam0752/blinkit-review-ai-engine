import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Award, Users, TrendingUp } from 'lucide-react';

export default function MetricsOverview({ 
  sentimentChartData, 
  sentimentCounts, 
  sourcesChartData, 
  categoriesChartData 
}) {
  return (
    <div className="metrics-grid">
      <div className="metric-card glass">
        <div className="metric-header">
          <span className="metric-title">Sentiment Distribution</span>
          <Award size={16} className="text-accent" />
        </div>
        <div className="chart-container-mini" style={{ height: '140px' }}>
          <Doughnut
            data={sentimentChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
              }
            }}
          />
        </div>
        <div className="custom-legend" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
            <span className="text-secondary">Positive ({sentimentCounts.positive})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }}></span>
            <span className="text-secondary">Negative ({sentimentCounts.negative})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }}></span>
            <span className="text-secondary">Neutral ({sentimentCounts.neutral})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></span>
            <span className="text-secondary">Mixed ({sentimentCounts.mixed})</span>
          </div>
        </div>
      </div>

      <div className="metric-card glass">
        <div className="metric-header">
          <span className="metric-title">Feedback Sources</span>
          <Users size={16} className="text-accent" />
        </div>
        <div className="chart-container-mini">
          <Bar
            data={sourcesChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: 'y',
              plugins: { legend: { display: false } },
              scales: { x: { grid: { display: false } }, y: { grid: { display: false } } }
            }}
          />
        </div>
      </div>

      <div className="metric-card glass">
        <div className="metric-header">
          <span className="metric-title">Category Tag Count</span>
          <TrendingUp size={16} className="text-accent" />
        </div>
        <div className="chart-container-mini">
          <Bar
            data={categoriesChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: {
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 45,
                    font: {
                      size: 8.5
                    }
                  }
                },
                y: {
                  grid: { display: false }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
