import React, { useRef } from 'react';
import { exportToCSV, exportToJSON } from '../utils/formatters';
import { INITIAL_DEMO_TRANSACTIONS } from '../constants/categories';
import { X, Download, Upload, RefreshCw, Trash2, ShieldCheck, DollarSign } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  transactions,
  allCategories,
  currency,
  onCurrencyChange,
  onResetDemoData,
  onClearAllData,
  onImportData,
}) {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    exportToCSV(transactions, allCategories);
  };

  const handleExportJSON = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      transactions,
    };
    exportToJSON(backup);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed.transactions)) {
          onImportData(parsed.transactions);
          alert('¡Copia de seguridad importada exitosamente!');
          onClose();
        } else if (Array.isArray(parsed)) {
          onImportData(parsed);
          alert('¡Copia de seguridad importada exitosamente!');
          onClose();
        } else {
          alert('El archivo no tiene el formato esperado.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel animate-pop-in"
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#0e1526',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Ajustes y Respaldos
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Currency Configuration */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>
              Símbolo de Moneda
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['$', 'ARS $', 'USD $', '€', 'MXN $'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onCurrencyChange(c)}
                  style={{
                    flex: 1,
                    padding: '10px 8px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: currency === c ? '700' : '500',
                    background: currency === c ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                    color: currency === c ? '#fff' : 'var(--text-muted)',
                    border: currency === c ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Export & Import actions */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '10px' }}>
              Exportar e Importar Datos
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={handleExportCSV}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Download size={16} color="var(--primary)" />
                Exportar CSV
              </button>

              <button
                onClick={handleExportJSON}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Download size={16} color="var(--accent-cyan)" />
                Copia JSON
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  gridColumn: 'span 2',
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px dashed var(--primary)',
                  color: 'var(--primary)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Upload size={16} />
                Restaurar desde archivo JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* Reset / Clean Options */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '10px' }}>
              Gestión de Datos
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => {
                  if (confirm('¿Cargar datos de prueba de ejemplo?')) {
                    onResetDemoData();
                    onClose();
                  }
                }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RefreshCw size={15} />
                  <span>Cargar datos de ejemplo (demo)</span>
                </div>
              </button>

              <button
                onClick={() => {
                  if (confirm('¿Estás seguro de que deseas borrar TODOS los registros? Esta acción no se puede deshacer.')) {
                    onClearAllData();
                    onClose();
                  }
                }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(244, 63, 94, 0.08)',
                  border: '1px solid rgba(244, 63, 94, 0.2)',
                  color: 'var(--expense)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trash2 size={15} />
                  <span>Borrar todos los movimientos</span>
                </div>
              </button>
            </div>
          </div>

          {/* Privacy Note */}
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <ShieldCheck size={18} color="var(--income)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
              Tus finanzas se guardan 100% de forma local y privada en tu navegador (LocalStorage). Ningún dato sale de tu dispositivo.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
