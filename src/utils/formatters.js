export function formatCurrency(amount, currencySymbol = '$') {
  if (amount === undefined || amount === null || isNaN(amount)) return `${currencySymbol} 0`;
  const formatted = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  return `${currencySymbol} ${formatted}`;
}

export function formatDate(dateString) {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatTime(dateString) {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function getRelativeDayLabel(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  
  const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffDays = Math.round((dToday - d1) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays === -1) return 'Mañana';
  if (diffDays > 1 && diffDays < 7) {
    return new Intl.DateTimeFormat('es-AR', { weekday: 'long' }).format(date);
  }
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function exportToCSV(transactions, allCategories) {
  const categoryMap = new Map(allCategories.map(c => [c.id, c.name]));
  const headers = ['ID', 'Fecha', 'Hora', 'Tipo', 'Categoría', 'Monto', 'Método de Pago', 'Nota'];
  
  const rows = transactions.map(t => {
    const d = new Date(t.date);
    return [
      t.id,
      d.toLocaleDateString('es-AR'),
      d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      t.type === 'income' ? 'Ingreso' : 'Gasto',
      `"${categoryMap.get(t.category) || t.category || 'Sin categoría'}"`,
      t.amount,
      `"${t.paymentMethod || 'Efectivo'}"`,
      `"${(t.note || '').replace(/"/g, '""')}"`
    ];
  });
  
  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `mis_gastos_ingresos_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `backup_finanzas_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
