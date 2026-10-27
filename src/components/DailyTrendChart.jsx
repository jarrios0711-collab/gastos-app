import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { BarChart3, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function DailyTrendChart({ transactions, currency }) {
  // Generate the last 7 days keys (YYYY-MM-DD)
  const days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayName = i === 0 ? 'Hoy' : i === 1 ? 'Ayer' : new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(d);
    days.push({
      dateStr,
      dayName: dayName.toUpperCase(),
      income: 0,
      expense: 0,
    });
  }

  // Populate data
  transactions.forEach((t) => {
    const txDateStr = new Date(t.date).toISOString().slice(0, 10);
    const found = days.find((d) => d.dateStr === txDateStr);
    if (found) {
      if (t.type === 'income') {
        found.income += Number(t.amount || 0);
      } else {
        found.expense += Number(t.amount || 0);
      }
    }
  });

  const maxVal = Math.max(
    ...days.map((d) => Math.max(d.income, d.expense)),
    1000 // minimum scale
  );

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
            }}
          >
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
              Flujo Diario (Últimos 7 días)
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Comparativa de entradas vs salidas por día
            </span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--income)' }} />
            <span style={{ color: 'var(--text-muted)' }}>Ingresos</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--expense)' }} />
            <span style={{ color: 'var(--text-muted)' }}>Gastos</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '12px',
          height: '180px',
          alignItems: 'flex-end',
          paddingTop: '20px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
        }}
      >
        {days.map((day) => {
          const expenseHeight = (day.expense / maxVal) * 120;
          const incomeHeight = (day.income / maxVal) * 120;

          return (
            <div
              key={day.dateStr}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
                position: 'relative',
              }}
              title={`${day.dateStr}\nIngresos: ${formatCurrency(day.income, currency)}\nGastos: ${formatCurrency(day.expense, currency)}`}
            >
              {/* Bars Pair */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '130px', width: '100%', justifyContent: 'center' }}>
                {/* Income Bar */}
                <div
                  style={{
                    width: '38%',
                    maxWidth: '18px',
                    height: `${Math.max(incomeHeight, day.income > 0 ? 6 : 2)}px`,
                    background: day.income > 0 ? 'var(--income)' : 'rgba(255,255,255,0.04)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s ease',
                    boxShadow: day.income > 0 ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none',
                  }}
                />

                {/* Expense Bar */}
                <div
                  style={{
                    width: '38%',
                    maxWidth: '18px',
                    height: `${Math.max(expenseHeight, day.expense > 0 ? 6 : 2)}px`,
                    background: day.expense > 0 ? 'var(--expense)' : 'rgba(255,255,255,0.04)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s ease',
                    boxShadow: day.expense > 0 ? '0 0 10px rgba(244, 63, 94, 0.3)' : 'none',
                  }}
                />
              </div>

              {/* Day Label */}
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: '600',
                  color: day.dayName === 'HOY' ? 'var(--primary)' : 'var(--text-dim)',
                  marginTop: '10px',
                }}
              >
                {day.dayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
