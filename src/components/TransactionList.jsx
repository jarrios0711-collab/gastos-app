import React, { useState } from 'react';
import CategoryIcon from './CategoryIcon';
import { formatCurrency, formatTime, getRelativeDayLabel } from '../utils/formatters';
import { PAYMENT_METHODS } from '../constants/categories';
import { Search, Edit3, Trash2, ArrowDownLeft, ArrowUpRight, Filter, Receipt } from 'lucide-react';

export default function TransactionList({
  transactions,
  categories,
  currency,
  onEdit,
  onDelete,
  filterCategory,
  onClearCategoryFilter,
}) {
  const [filterType, setFilterType] = useState('all'); // 'all', 'expense', 'income'
  const [searchTerm, setSearchTerm] = useState('');

  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const paymentMethodMap = new Map(PAYMENT_METHODS.map((p) => [p.id, p]));

  // Filter transactions
  const filtered = transactions.filter((t) => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterCategory && t.category !== filterCategory) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const cat = categoryMap.get(t.category);
      const catName = cat ? cat.name.toLowerCase() : '';
      const note = (t.note || '').toLowerCase();
      const pm = (t.paymentMethod || '').toLowerCase();
      if (!catName.includes(term) && !note.includes(term) && !pm.includes(term)) {
        return false;
      }
    }
    return true;
  });

  // Group by date (YYYY-MM-DD)
  const grouped = {};
  filtered.forEach((t) => {
    const dayKey = new Date(t.date).toISOString().slice(0, 10);
    if (!grouped[dayKey]) {
      grouped[dayKey] = [];
    }
    grouped[dayKey].push(t);
  });

  // Sort day keys descending
  const sortedDayKeys = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Header & Controls */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-main)',
              }}
            >
              <Receipt size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                Movimientos Diarios
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {filtered.length} registro{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Type Filter Buttons */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '4px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {[
              { id: 'all', label: 'Todos' },
              { id: 'expense', label: 'Gastos' },
              { id: 'income', label: 'Ingresos' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  background: filterType === f.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: filterType === f.id ? 'var(--text-main)' : 'var(--text-dim)',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar & active category filter badge */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-dim)',
              }}
            />
            <input
              type="text"
              placeholder="Buscar por detalle, categoría, pago..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                paddingLeft: '38px',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontSize: '0.88rem',
                borderRadius: '12px',
              }}
            />
          </div>

          {filterCategory && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(99, 102, 241, 0.2)',
                color: 'var(--primary)',
                border: '1px solid var(--primary)',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: '600',
              }}
            >
              <span>Categoría: {categoryMap.get(filterCategory)?.name || filterCategory}</span>
              <button
                onClick={onClearCategoryFilter}
                style={{ background: 'none', color: 'var(--primary)', padding: 0 }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* List Container */}
      {sortedDayKeys.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 16px',
            color: 'var(--text-dim)',
            background: 'var(--bg-subtle)',
            borderRadius: '16px',
          }}
        >
          <Filter size={32} style={{ opacity: 0.35, marginBottom: '10px' }} />
          <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '500' }}>
            No se encontraron movimientos con los filtros actuales.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {sortedDayKeys.map((dayKey) => {
            const dayTxs = grouped[dayKey];
            const dayTotalExpense = dayTxs
              .filter((t) => t.type === 'expense')
              .reduce((s, t) => s + Number(t.amount || 0), 0);
            const dayTotalIncome = dayTxs
              .filter((t) => t.type === 'income')
              .reduce((s, t) => s + Number(t.amount || 0), 0);

            return (
              <div key={dayKey}>
                {/* Day Header Divider */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '8px',
                    marginBottom: '10px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                    {getRelativeDayLabel(dayKey)}
                  </span>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', fontWeight: '600' }}>
                    {dayTotalIncome > 0 && (
                      <span style={{ color: 'var(--income)' }}>+{formatCurrency(dayTotalIncome, currency)}</span>
                    )}
                    {dayTotalExpense > 0 && (
                      <span style={{ color: 'var(--expense)' }}>-{formatCurrency(dayTotalExpense, currency)}</span>
                    )}
                  </div>
                </div>

                {/* Day's Transactions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {dayTxs.map((tx) => {
                    const cat = categoryMap.get(tx.category) || {
                      name: tx.category || 'Varios',
                      icon: 'Layers',
                      color: '#94a3b8',
                      bg: 'rgba(148, 163, 184, 0.15)',
                    };
                    const pm = paymentMethodMap.get(tx.paymentMethod);
                    const isExpense = tx.type === 'expense';

                    return (
                      <div
                        key={tx.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: '14px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--border-subtle)',
                          transition: 'background 0.2s ease, border-color 0.2s ease',
                        }}
                      >
                        {/* Left: Category Icon + Details */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '11px',
                              background: cat.bg,
                              color: cat.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <CategoryIcon name={cat.icon} size={18} color={cat.color} />
                          </div>

                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  fontSize: '0.92rem',
                                  fontWeight: '700',
                                  color: 'var(--text-main)',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {tx.note || cat.name}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                              {tx.note && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                  {cat.name} •
                                </span>
                              )}
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                {formatTime(tx.date)}
                              </span>
                              {pm && (
                                <span
                                  style={{
                                    fontSize: '0.7rem',
                                    padding: '2px 6px',
                                    borderRadius: '6px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'var(--text-muted)',
                                  }}
                                >
                                  {pm.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Amount + Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span
                            style={{
                              fontSize: '1rem',
                              fontWeight: '800',
                              color: isExpense ? 'var(--expense)' : 'var(--income)',
                              letterSpacing: '-0.02em',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {isExpense ? '-' : '+'}
                            {formatCurrency(tx.amount, currency)}
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button
                              title="Editar"
                              onClick={() => onEdit(tx)}
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '8px',
                                background: 'transparent',
                                color: 'var(--text-dim)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              title="Eliminar"
                              onClick={() => onDelete(tx.id)}
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '8px',
                                background: 'transparent',
                                color: 'var(--text-dim)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
