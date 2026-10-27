import React, { useState } from 'react';
import CategoryIcon from './CategoryIcon';
import { formatCurrency } from '../utils/formatters';
import { PieChart, TrendingDown } from 'lucide-react';

export default function CategoryBreakdown({
  transactions,
  categories,
  currency,
  selectedCategory,
  onSelectCategory,
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Group and sum expenses by category
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const categoryTotals = {};
  expenses.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount || 0);
  });

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const breakdownData = Object.entries(categoryTotals)
    .map(([catId, amount]) => {
      const cat = categoryMap.get(catId) || {
        id: catId,
        name: catId,
        icon: 'Layers',
        color: '#94a3b8',
        bg: 'rgba(148, 163, 184, 0.15)',
      };
      const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
      return {
        ...cat,
        amount,
        percentage,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // Calculate SVG Donut Arcs
  const radius = 68;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(244, 63, 94, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--expense)',
            }}
          >
            <PieChart size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
              Gastos por Categoría
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {breakdownData.length} categorías con movimiento
            </span>
          </div>
        </div>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            Limpiar filtro ✕
          </button>
        )}
      </div>

      {breakdownData.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 16px',
            color: 'var(--text-dim)',
            background: 'var(--bg-subtle)',
            borderRadius: '16px',
          }}
        >
          <TrendingDown size={32} style={{ opacity: 0.4, marginBottom: '8px' }} />
          <p style={{ margin: 0, fontSize: '0.9rem' }}>No hay gastos registrados en este período.</p>
        </div>
      ) : (
        <div>
          {/* Donut Chart Visualizer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              margin: '10px 0 24px',
            }}
          >
            <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth={strokeWidth}
              />
              {breakdownData.map((item, idx) => {
                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -accumulatedAngle;
                accumulatedAngle += (item.percentage / 100) * circumference;

                const isHovered = hoveredIdx === idx;
                const isSelected = selectedCategory === item.id;

                return (
                  <circle
                    key={item.id}
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke={item.color}
                    strokeWidth={isHovered || isSelected ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      opacity: selectedCategory && !isSelected ? 0.35 : 1,
                      filter: isHovered || isSelected ? `drop-shadow(0 0 6px ${item.color})` : 'none',
                    }}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={() => onSelectCategory(isSelected ? null : item.id)}
                  />
                );
              })}
            </svg>

            {/* Inner Center Stats */}
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Gastos
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
                {formatCurrency(totalExpense, currency)}
              </span>
            </div>
          </div>

          {/* List of categories with progress meters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {breakdownData.map((item, idx) => {
              const isSelected = selectedCategory === item.id;
              const isHovered = hoveredIdx === idx;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectCategory(isSelected ? null : item.id)}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: isSelected
                      ? 'rgba(99, 102, 241, 0.15)'
                      : isHovered
                      ? 'rgba(255, 255, 255, 0.04)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: item.bg,
                          color: item.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CategoryIcon name={item.icon} size={15} color={item.color} />
                      </div>
                      <span
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                        }}
                      >
                        {item.name}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>
                        {formatCurrency(item.amount, currency)}
                      </span>
                      <span
                        style={{
                          marginLeft: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Progress track */}
                  <div
                    style={{
                      height: '5px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${item.percentage}%`,
                        height: '100%',
                        background: item.color,
                        borderRadius: '10px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
