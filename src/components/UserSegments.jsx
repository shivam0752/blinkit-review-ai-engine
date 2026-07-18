import React from 'react';
import { ShoppingBag, Zap, Clock, Sparkles } from 'lucide-react';

const SEGMENTS = [
  {
    title: "Daily Essentials Stocker",
    icon: <Clock size={20} className="text-accent" />,
    habit: "High-frequency, repetitive morning or daily purchases.",
    items: "Milk, eggs, fresh coriander, bread, daily vegetables, and breakfast staples.",
    factors: "10-minute delivery speed, fresh produce quality guarantees, and subscription automation.",
    color: "rgba(56, 189, 248, 0.05)",
    borderColor: "rgba(56, 189, 248, 0.2)"
  },
  {
    title: "Impulse Snacker & Entertainer",
    icon: <ShoppingBag size={20} style={{ color: '#fb923c' }} />,
    habit: "Medium-frequency, unpredictable evening & late-night spikes.",
    items: "Chips, cold drinks, chocolates, instant noodles, party mixers, and ice creams.",
    factors: "App homepage recommendations, promotional discounts, and late-night slot availability.",
    color: "rgba(251, 146, 60, 0.05)",
    borderColor: "rgba(251, 146, 60, 0.2)"
  },
  {
    title: "Emergency Utility Buyer",
    icon: <Zap size={20} style={{ color: '#f87171' }} />,
    habit: "Low-frequency, highly urgent transactional purchases.",
    items: "Phone chargers, batteries, bulbs, OTC medicines, stationery, and urgent gifts.",
    factors: "Immediate availability, authentic brand tags, and local shop stock verification.",
    color: "rgba(248, 113, 113, 0.05)",
    borderColor: "rgba(248, 113, 113, 0.2)"
  },
  {
    title: "Gourmet Trial Enthusiast",
    icon: <Sparkles size={20} style={{ color: '#4ade80' }} />,
    habit: "Medium-frequency exploratory purchases checking 'New Launches'.",
    items: "Exotic sauces, imported chocolates, organic ingredients, and new snack brands.",
    factors: "Rich social proof, user ratings & reviews, recipe-based suggestions, and search suggestions.",
    color: "rgba(74, 222, 128, 0.05)",
    borderColor: "rgba(74, 222, 128, 0.2)"
  }
];

export default function UserSegments() {
  return (
    <div className="section-container" style={{ marginTop: '2.5rem', marginBottom: '1.5rem' }}>
      <h2 className="section-title">Strategic User Segments</h2>
      <p className="section-description">
        Key target groups mapped from customer reviews based on purchase habits, items ordered, and primary purchase influencers.
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.25rem',
        marginTop: '1.25rem'
      }}>
        {SEGMENTS.map((seg, i) => (
          <div 
            key={i} 
            className="glass" 
            style={{ 
              backgroundColor: seg.color, 
              border: `1px solid ${seg.borderColor}`, 
              borderRadius: '12px', 
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.05)', 
                padding: '0.5rem', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {seg.icon}
              </div>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {seg.title}
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem', lineHeight: '1.4' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>
                  Purchase Habit
                </strong>
                <span style={{ color: 'var(--text-secondary)' }}>{seg.habit}</span>
              </div>

              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>
                  Key Items
                </strong>
                <span style={{ color: 'var(--text-secondary)' }}>{seg.items}</span>
              </div>

              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>
                  Influence Factors
                </strong>
                <span style={{ color: 'var(--text-secondary)' }}>{seg.factors}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
