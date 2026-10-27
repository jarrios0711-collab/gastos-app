import React from 'react';
import { formatCurrency } from '../utils/formatters';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ArrowDownLeft,
  Plus,
  Percent,
  Calendar,
  Settings,
  Download,
  Upload
} from 'lucide-react';

export default function BalanceHeader({
  totalBalance,
  periodIncome,
  periodExpense,
  period,
  onPeriodChange,
  currency,
  onOpenNewTx,
  onOpenSettings,
}) {
  const netSavings = periodIncome - periodExpense;
  const savingsRate = periodIncome > 0 ? Math.round((netSavings / periodIncome) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
      {/* Top Navbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
            }}
          >
            <Wallet size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              Mis Finanzas
            </h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Gastos diarios e ingresos organizados
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onOpenSettings}
            title="Ajustes y Respaldos"
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Settings size={18} />
          </button>

          <button
            onClick={onOpenNewTx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '14px',
              fontWeight: '700',
              fontSize: '0.9rem',
              color: '#ffffff',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Plus size={18} />
            <span>Nuevo Registro</span>
          </button>
        </div>
      </div>

      {/* Period Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        {[
          { id: 'today', label: 'Hoy' },
          { id: 'week', label: 'Últimos 7 días' },
          { id: 'month', label: 'Este Mes' },
          { id: 'all', label: 'Histórico Total' },
        ].map((p) => {
          const isActive = period === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onPeriodChange(p.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '0.82rem',
                fontWeight: '600',
                background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                whiteSpace: 'nowrap',
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Main KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Balance Card */}
        <div
          className="glass-panel"
          style={{
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
              Balance Total
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Wallet size={16} />
            </div>
          </div>

          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
            {formatCurrency(totalBalance, currency)}
          </div>

          <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Saldo acumulado en todas las cuentas
          </div>
        </div>

        {/* Income Card */}
        <div
          className="glass-panel"
          style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.25) 0%, rgba(15, 23, 42, 0.7) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
              Entradas ({period === 'today' ? 'Hoy' : period === 'week' ? '7D' : period === 'month' ? 'Mes' : 'Total'})
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--income)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowDownLeft size={16} />
            </div>
          </div>

          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--income)', letterSpacing: '-0.03em' }}>
            +{formatCurrency(periodIncome, currency)}
          </div>

          <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--income)' }}>
            ✓ Ingresos registrados
          </div>
        </div>

        {/* Expense Card */}
        <div
          className="glass-panel"
          style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(136, 19, 55, 0.25) 0%, rgba(15, 23, 42, 0.7) 100%)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
              Gastos ({period === 'today' ? 'Hoy' : period === 'week' ? '7D' : period === 'month' ? 'Mes' : 'Total'})
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'rgba(244, 63, 94, 0.15)',
                color: 'var(--expense)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowUpRight size={16} />
            </div>
          </div>

          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--expense)', letterSpacing: '-0.03em' }}>
            -{formatCurrency(periodExpense, currency)}
          </div>

          <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Nafta, despensa, servicios y salidas
          </div>
        </div>

        {/* Net Flow / Savings Rate Card */}
        <div
          className="glass-panel"
          style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.25) 0%, rgba(15, 23, 42, 0.7) 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
              Flujo Neto / Ahorro
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'rgba(168, 85, 247, 0.15)',
                color: 'var(--accent-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Percent size={16} />
            </div>
          </div>

          <div
            style={{
              fontSize: '1.8rem',
              fontWeight: '800',
              color: netSavings >= 0 ? 'var(--income)' : 'var(--expense)',
              letterSpacing: '-0.03em',
            }}
          >
            {netSavings >= 0 ? '+' : ''}
            {formatCurrency(netSavings, currency)}
          </div>

          <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            {periodIncome > 0 ? `${savingsRate}% de tus ingresos retenidos` : 'Registra entradas para ver tasa'}
          </div>
        </div>
      </div>
    </div>
  );
}
