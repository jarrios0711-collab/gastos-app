import React, { useState, useEffect } from 'react';
import BalanceHeader from './components/BalanceHeader';
import CategoryBreakdown from './components/CategoryBreakdown';
import DailyTrendChart from './components/DailyTrendChart';
import TransactionList from './components/TransactionList';
import TransactionModal from './components/TransactionModal';
import SettingsModal from './components/SettingsModal';
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
  INITIAL_DEMO_TRANSACTIONS
} from './constants/categories';
import { Plus } from 'lucide-react';

const STORAGE_KEYS = {
  TX: 'gastos_app_transactions_v1',
  EXP_CAT: 'gastos_app_expense_categories_v1',
  INC_CAT: 'gastos_app_income_categories_v1',
  CURRENCY: 'gastos_app_currency_v1',
};

export default function App() {
  // Load state from localStorage
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TX);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_TRANSACTIONS;
    } catch {
      return INITIAL_DEMO_TRANSACTIONS;
    }
  });

  const [expenseCategories, setExpenseCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXP_CAT);
      return saved ? JSON.parse(saved) : DEFAULT_EXPENSE_CATEGORIES;
    } catch {
      return DEFAULT_EXPENSE_CATEGORIES;
    }
  });

  const [incomeCategories, setIncomeCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INC_CAT);
      return saved ? JSON.parse(saved) : DEFAULT_INCOME_CATEGORIES;
    } catch {
      return DEFAULT_INCOME_CATEGORIES;
    }
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENCY) || '$';
  });

  // UI State
  const [period, setPeriod] = useState('month'); // 'today', 'week', 'month', 'all'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TX, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXP_CAT, JSON.stringify(expenseCategories));
  }, [expenseCategories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INC_CAT, JSON.stringify(incomeCategories));
  }, [incomeCategories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
  }, [currency]);

  // Filter transactions by selected period
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const periodTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    if (period === 'today') {
      return tDate.toISOString().slice(0, 10) === todayStr;
    }
    if (period === 'week') {
      return tDate >= sevenDaysAgo;
    }
    if (period === 'month') {
      return tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth;
    }
    return true; // 'all'
  });

  // Calculate totals
  const totalBalance = transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + Number(t.amount || 0) : acc - Number(t.amount || 0);
  }, 0);

  const periodIncome = periodTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const periodExpense = periodTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  // Handlers
  const handleSaveTransaction = (tx) => {
    setTransactions((prev) => {
      const exists = prev.some((item) => item.id === tx.id);
      if (exists) {
        return prev.map((item) => (item.id === tx.id ? tx : item));
      }
      return [tx, ...prev];
    });
  };

  const handleDeleteTransaction = (id) => {
    if (confirm('¿Eliminar este movimiento?')) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setIsTxModalOpen(true);
  };

  const handleAddCategory = (type, newCategory) => {
    if (type === 'expense') {
      setExpenseCategories((prev) => [...prev, newCategory]);
    } else {
      setIncomeCategories((prev) => [...prev, newCategory]);
    }
  };

  const handleResetDemoData = () => {
    setTransactions(INITIAL_DEMO_TRANSACTIONS);
    setExpenseCategories(DEFAULT_EXPENSE_CATEGORIES);
    setIncomeCategories(DEFAULT_INCOME_CATEGORIES);
    setSelectedCategory(null);
  };

  const handleClearAllData = () => {
    setTransactions([]);
    setSelectedCategory(null);
  };

  const allCategories = [...expenseCategories, ...incomeCategories];

  return (
    <div style={{ minHeight: '100vh', padding: '20px 16px 80px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header and KPI cards */}
      <BalanceHeader
        totalBalance={totalBalance}
        periodIncome={periodIncome}
        periodExpense={periodExpense}
        period={period}
        onPeriodChange={setPeriod}
        currency={currency}
        onOpenNewTx={() => {
          setEditingTransaction(null);
          setIsTxModalOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Visual Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <CategoryBreakdown
            transactions={periodTransactions}
            categories={expenseCategories}
            currency={currency}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <DailyTrendChart transactions={transactions} currency={currency} />
        </div>

        {/* Right Column: Daily Transactions Log */}
        <div>
          <TransactionList
            transactions={periodTransactions}
            categories={allCategories}
            currency={currency}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            filterCategory={selectedCategory}
            onClearCategoryFilter={() => setSelectedCategory(null)}
          />
        </div>
      </div>

      {/* Floating Action Button for Mobile Thumb Ergonomics */}
      <button
        onClick={() => {
          setEditingTransaction(null);
          setIsTxModalOpen(true);
        }}
        title="Registrar Gasto o Ingreso"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(99, 102, 241, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 900,
          border: '2px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Plus size={28} />
      </button>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        onAddCategory={handleAddCategory}
        editingTransaction={editingTransaction}
        currency={currency}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        transactions={transactions}
        allCategories={allCategories}
        currency={currency}
        onCurrencyChange={setCurrency}
        onResetDemoData={handleResetDemoData}
        onClearAllData={handleClearAllData}
        onImportData={(imported) => setTransactions(imported)}
      />
    </div>
  );
}
