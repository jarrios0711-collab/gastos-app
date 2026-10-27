export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'nafta', name: 'Nafta / Combustible', icon: 'Fuel', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' },
  { id: 'despensa', name: 'Despensa / Súper', icon: 'ShoppingCart', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  { id: 'comida', name: 'Comida / Delivery', icon: 'Utensils', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' },
  { id: 'vehiculo', name: 'Auto / Mantenimiento', icon: 'Car', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
  { id: 'servicios', name: 'Servicios (Luz/Gas/Net)', icon: 'Zap', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
  { id: 'vivienda', name: 'Vivienda / Alquiler', icon: 'Home', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' },
  { id: 'salud', name: 'Salud / Farmacia', icon: 'HeartPulse', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.15)' },
  { id: 'suscripciones', name: 'Suscripciones / Tel', icon: 'Smartphone', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
  { id: 'ocio', name: 'Ocio / Salidas', icon: 'Gamepad2', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  { id: 'otros', name: 'Varios / Otros', icon: 'Layers', color: '#64748b', bg: 'rgba(100, 116, 139, 0.15)' },
];

export const DEFAULT_INCOME_CATEGORIES = [
  { id: 'sueldo', name: 'Sueldo / Salario', icon: 'Briefcase', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  { id: 'ventas', name: 'Ventas / Negocio', icon: 'Store', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
  { id: 'freelance', name: 'Trabajos / Extras', icon: 'Laptop', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
  { id: 'inversiones', name: 'Inversiones / Rendimientos', icon: 'TrendingUp', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
  { id: 'regalos', name: 'Regalo / Reembolso', icon: 'Gift', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  { id: 'otros_ingresos', name: 'Otros Ingresos', icon: 'PlusCircle', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.15)' },
];

export const PAYMENT_METHODS = [
  { id: 'efectivo', name: 'Efectivo', icon: 'Banknote' },
  { id: 'mercadopago', name: 'Billetera / MP', icon: 'Smartphone' },
  { id: 'debito', name: 'Tarjeta Débito', icon: 'CreditCard' },
  { id: 'credito', name: 'Tarjeta Crédito', icon: 'CreditCard' },
  { id: 'transferencia', name: 'Transferencia', icon: 'ArrowRightLeft' },
];

export const INITIAL_DEMO_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'income',
    amount: 350000,
    category: 'sueldo',
    note: 'Cobro de quincena / sueldo',
    paymentMethod: 'transferencia',
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'tx-2',
    type: 'expense',
    amount: 32000,
    category: 'nafta',
    note: 'Llenado de tanque YPF Super',
    paymentMethod: 'mercadopago',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'tx-3',
    type: 'expense',
    amount: 48500,
    category: 'despensa',
    note: 'Compra semanal supermercado (frutas, verduras, lácteos)',
    paymentMethod: 'debito',
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'tx-4',
    type: 'income',
    amount: 25000,
    category: 'ventas',
    note: 'Venta de producto / cobro extra',
    paymentMethod: 'efectivo',
    date: new Date().toISOString(),
  },
  {
    id: 'tx-5',
    type: 'expense',
    amount: 8500,
    category: 'comida',
    note: 'Almuerzo / empanadas al paso',
    paymentMethod: 'efectivo',
    date: new Date().toISOString(),
  },
  {
    id: 'tx-6',
    type: 'expense',
    amount: 14200,
    category: 'servicios',
    note: 'Factura de luz y gas',
    paymentMethod: 'mercadopago',
    date: new Date(Date.now() - 4 * 86400000).toISOString(),
  }
];
