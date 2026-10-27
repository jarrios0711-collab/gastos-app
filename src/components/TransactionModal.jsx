import React, { useState, useEffect } from 'react';
import CategoryIcon from './CategoryIcon';
import { PAYMENT_METHODS } from '../constants/categories';
import { X, Plus, Check, Calendar, CreditCard, Tag } from 'lucide-react';

export default function TransactionModal({
  isOpen,
  onClose,
  onSave,
  expenseCategories,
  incomeCategories,
  onAddCategory,
  editingTransaction = null,
  currency = '$',
}) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [date, setDate] = useState('');
  
  // Custom category modal within modal state
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const currentCategories = type === 'expense' ? expenseCategories : incomeCategories;

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setNote(editingTransaction.note || '');
      setPaymentMethod(editingTransaction.paymentMethod || 'efectivo');
      
      const localDate = new Date(editingTransaction.date);
      // Format as YYYY-MM-DDTHH:MM for datetime-local input
      const pad = (n) => String(n).padStart(2, '0');
      const formatted = `${localDate.getFullYear()}-${pad(localDate.getMonth() + 1)}-${pad(localDate.getDate())}T${pad(localDate.getHours())}:${pad(localDate.getMinutes())}`;
      setDate(formatted);
    } else {
      setType('expense');
      setAmount('');
      setCategory(expenseCategories[0]?.id || 'nafta');
      setNote('');
      setPaymentMethod('efectivo');
      
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
      setDate(formatted);
    }
    setShowNewCatInput(false);
    setNewCatName('');
  }, [editingTransaction, isOpen, expenseCategories]);

  // When type changes, ensure valid category
  const handleTypeChange = (newType) => {
    setType(newType);
    const catList = newType === 'expense' ? expenseCategories : incomeCategories;
    setCategory(catList[0]?.id || '');
  };

  const handleAddQuickAmount = (val) => {
    const current = Number(amount) || 0;
    setAmount((current + val).toString());
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    const catId = newCatName.toLowerCase().trim().replace(/\s+/g, '_') + '_' + Date.now().toString().slice(-4);
    const newCategory = {
      id: catId,
      name: newCatName.trim(),
      icon: 'Tag',
      color: type === 'expense' ? '#f43f5e' : '#10b981',
      bg: type === 'expense' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
    };
    
    onAddCategory(type, newCategory);
    setCategory(catId);
    setNewCatName('');
    setShowNewCatInput(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Por favor ingresa un monto válido mayor a 0');
      return;
    }
    if (!category) {
      alert('Por favor selecciona una categoría');
      return;
    }

    const txDate = date ? new Date(date).toISOString() : new Date().toISOString();

    onSave({
      id: editingTransaction?.id || `tx-${Date.now()}`,
      type,
      amount: parsedAmount,
      category,
      note: note.trim(),
      paymentMethod,
      date: txDate,
    });
    onClose();
  };

  if (!isOpen) return null;

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
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#0e1526',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          padding: '24px',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            {editingTransaction ? 'Editar Registro' : 'Nueva Transacción'}
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

        {/* Segmented Control: Gasto vs Ingreso */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.35)',
            padding: '4px',
            borderRadius: '16px',
            marginBottom: '20px',
          }}
        >
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            style={{
              padding: '12px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.95rem',
              background: type === 'expense' ? 'var(--expense)' : 'transparent',
              color: type === 'expense' ? '#ffffff' : 'var(--text-dim)',
              boxShadow: type === 'expense' ? '0 4px 15px rgba(244, 63, 94, 0.35)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            - Gasto
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            style={{
              padding: '12px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.95rem',
              background: type === 'income' ? 'var(--income)' : 'transparent',
              color: type === 'income' ? '#ffffff' : 'var(--text-dim)',
              boxShadow: type === 'income' ? '0 4px 15px rgba(16, 185, 129, 0.35)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            + Ingreso
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Big Amount Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Monto ({currency})
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  color: type === 'expense' ? 'var(--expense)' : 'var(--income)',
                }}
              >
                {currency}
              </span>
              <input
                type="number"
                step="any"
                required
                autoFocus
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  paddingLeft: '44px',
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  color: 'var(--text-main)',
                  height: '58px',
                  borderRadius: '16px',
                }}
              />
            </div>

            {/* Quick Add Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
              {[1000, 5000, 10000, 20000, 50000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleAddQuickAmount(val)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  +{val.toLocaleString('es-AR')}
                </button>
              ))}
            </div>
          </div>

          {/* Category Picker */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Categoría {type === 'expense' ? '(ej: Nafta, Despensa)' : '(ej: Sueldo, Venta)'}
              </label>
              <button
                type="button"
                onClick={() => setShowNewCatInput(!showNewCatInput)}
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--primary)',
                  background: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Plus size={14} /> Nueva categoría
              </button>
            </div>

            {/* Custom Category Input on the fly */}
            {showNewCatInput && (
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '10px',
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '12px',
                }}
              >
                <input
                  type="text"
                  placeholder="Nombre de nueva categoría..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  style={{ height: '38px', padding: '6px 12px' }}
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  style={{
                    padding: '0 16px',
                    borderRadius: '10px',
                    background: 'var(--primary)',
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Agregar
                </button>
              </div>
            )}

            {/* Grid of categories */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '8px',
                maxHeight: '180px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {currentCategories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '12px',
                      background: isSelected ? cat.bg : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? `1.5px solid ${cat.color}` : '1px solid var(--border-subtle)',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '7px',
                        background: cat.bg,
                        color: cat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CategoryIcon name={cat.icon} size={14} color={cat.color} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: isSelected ? '700' : '500',
                        color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Método de Pago / Cuenta
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {PAYMENT_METHODS.map((pm) => {
                const isSelected = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? '700' : '500',
                      background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <CategoryIcon name={pm.icon} size={14} />
                    {pm.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note / Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Detalle / Nota opcional
            </label>
            <input
              type="text"
              placeholder="Ej: Nafta Shell, Coto verdulería, Pago cliente..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ fontSize: '0.9rem' }}
            />
          </div>

          {/* Date and Time */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Fecha y Hora
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ fontSize: '0.9rem' }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              marginTop: '10px',
              padding: '14px',
              borderRadius: '14px',
              fontWeight: '700',
              fontSize: '1rem',
              color: '#ffffff',
              background:
                type === 'expense'
                  ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow:
                type === 'expense'
                  ? '0 6px 20px rgba(244, 63, 94, 0.4)'
                  : '0 6px 20px rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Check size={20} />
            {editingTransaction ? 'Guardar Cambios' : type === 'expense' ? 'Registrar Gasto' : 'Registrar Ingreso'}
          </button>
        </form>
      </div>
    </div>
  );
}
