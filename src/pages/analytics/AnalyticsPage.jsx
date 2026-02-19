import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';
import './AnalyticsPage.css';

// localStorage keys (seninkiler farklıysa değiştir)
const TX_KEY = 'financeapp_transactions';
const BUDGETS_KEY = 'financeapp_budgets';
const POTS_KEY = 'financeapp_pots';

const toNumber = (v) => {
  const n = Number(String(v ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const normalizeCategory = (c) => (c || 'Uncategorized').trim();

const formatShortDate = (iso) => {
  // 2025-12-28 -> 12/28 (gözü yormasın)
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${m}/${d}`;
};

const AnalyticsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [pots, setPots] = useState([]);

  useEffect(() => {
    const readAll = () => {
      try {
        setTransactions(JSON.parse(localStorage.getItem(TX_KEY) || '[]'));
        setBudgets(JSON.parse(localStorage.getItem(BUDGETS_KEY) || '[]'));
        setPots(JSON.parse(localStorage.getItem(POTS_KEY) || '[]'));
      } catch {
        setTransactions([]);
        setBudgets([]);
        setPots([]);
      }
    };

    readAll();

    // başka tab/route localStorage değiştirince anlık güncellensin
    const onStorage = (e) => {
      if ([TX_KEY, BUDGETS_KEY, POTS_KEY].includes(e.key)) readAll();
    };
    window.addEventListener('storage', onStorage);

    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const computed = useMemo(() => {
    // tx modelini bilmediğim için esnek okuyorum:
    // amount: "-32.00" veya 32, type: "income"/"expense" veya amount işaretinden anlaşılır
    const tx = Array.isArray(transactions) ? transactions : [];

    const incomeTx = tx.filter((t) => {
      const type = (t.type || '').toLowerCase();
      const amt = toNumber(t.amount);
      return type === 'income' || amt > 0;
    });

    const expenseTx = tx.filter((t) => {
      const type = (t.type || '').toLowerCase();
      const amt = toNumber(t.amount);
      return type === 'expense' || amt < 0;
    });

    const totalIncome = incomeTx.reduce((s, t) => s + Math.abs(toNumber(t.amount)), 0);
    const totalExpenses = expenseTx.reduce((s, t) => s + Math.abs(toNumber(t.amount)), 0);
    const net = totalIncome - totalExpenses;

    // Cashflow over time (date bazlı)
    const mapByDate = new Map();
    for (const t of tx) {
      const date = t.date || t.transactionDate || t.createdAt || t.time || '';
      const key = date ? String(date).slice(0, 10) : 'unknown';
      const type = (t.type || '').toLowerCase();
      const raw = toNumber(t.amount);
      const isIncome = type === 'income' || raw > 0;
      const amt = Math.abs(raw);

      if (!mapByDate.has(key)) mapByDate.set(key, { date: key, income: 0, expense: 0 });
      const row = mapByDate.get(key);
      if (isIncome) row.income += amt;
      else row.expense += amt;
    }

    const cashflowSeries = Array.from(mapByDate.values())
      .filter((r) => r.date !== 'unknown')
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14) // son 14 gün/işlem tarihi
      .map((r) => ({
        ...r,
        label: formatShortDate(r.date),
      }));

    // Spending by category (pie)
    const spendByCatMap = new Map();
    for (const t of expenseTx) {
      const cat = normalizeCategory(t.category);
      const amt = Math.abs(toNumber(t.amount));
      spendByCatMap.set(cat, (spendByCatMap.get(cat) || 0) + amt);
    }
    const spendingByCategory = Array.from(spendByCatMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    // Budget usage (bar): spent vs remaining
    // bütçe modelin: {category, maximum/max/limit, ...}
    const b = Array.isArray(budgets) ? budgets : [];
    const budgetUsage = b.map((budget) => {
      const cat = normalizeCategory(budget.category);
      const limit = toNumber(budget.maximum ?? budget.max ?? budget.limit ?? budget.amount);
      const spent = expenseTx
        .filter((t) => normalizeCategory(t.category) === cat)
        .reduce((s, t) => s + Math.abs(toNumber(t.amount)), 0);

      const remaining = Math.max(0, limit - spent);

      return {
        category: cat,
        spent,
        remaining,
        limit,
      };
    });

    // Pots progress list
    const p = Array.isArray(pots) ? pots : [];
    const potsProgress = p.map((pot) => {
      const target = toNumber(pot.target ?? pot.goal ?? pot.amount);
      const saved = toNumber(pot.saved ?? pot.totalSaved ?? pot.current ?? pot.balance);
      const pct = target > 0 ? Math.min(100, (saved / target) * 100) : 0;
      return {
        name: pot.name || 'Unnamed Pot',
        saved,
        target,
        pct,
      };
    });

    return {
      totalIncome,
      totalExpenses,
      net,
      count: tx.length,
      cashflowSeries,
      spendingByCategory,
      budgetUsage,
      potsProgress,
    };
  }, [transactions, budgets, pots]);

  const PIE_COLORS = [
    '#0ea5e9', '#22c55e', '#f59e0b', '#a855f7', '#ef4444', '#14b8a6', '#3b82f6', '#f97316',
  ];

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1 className="analytics-title">Analytics</h1>
      </div>

      {/* KPI */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <p className="kpi-label">Total Income</p>
          <p className="kpi-value">${computed.totalIncome.toFixed(2)}</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Total Expenses</p>
          <p className="kpi-value">-${computed.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Net</p>
          <p className="kpi-value">${computed.net.toFixed(2)}</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Transactions</p>
          <p className="kpi-value">{computed.count}</p>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Cashflow line */}
        <section className="panel">
          <div className="panel-head">
            <h2>Cashflow (Last Dates)</h2>
          </div>

          {computed.cashflowSeries.length === 0 ? (
            <p className="panel-empty">No transaction data yet.</p>
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={computed.cashflowSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Spending pie */}
        <section className="panel">
          <div className="panel-head">
            <h2>Spending by Category</h2>
          </div>

          {computed.spendingByCategory.length === 0 ? (
            <p className="panel-empty">No expense data yet.</p>
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={computed.spendingByCategory}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                  >
                    {computed.spendingByCategory.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Budget usage bars */}
        <section className="panel panel-wide">
          <div className="panel-head">
            <h2>Budget Usage</h2>
          </div>

          {computed.budgetUsage.length === 0 ? (
            <p className="panel-empty">Create a budget to see usage.</p>
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={computed.budgetUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="spent" stackId="a" fill="#ef4444" />
                  <Bar dataKey="remaining" stackId="a" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Pots progress */}
        <section className="panel">
          <div className="panel-head">
            <h2>Pots Progress</h2>
          </div>

          {computed.potsProgress.length === 0 ? (
            <p className="panel-empty">No pots yet.</p>
          ) : (
            <div className="pots-list">
              {computed.potsProgress.slice(0, 6).map((p) => (
                <div className="pot-row" key={p.name}>
                  <div className="pot-top">
                    <span className="pot-name">{p.name}</span>
                    <span className="pot-num">${p.saved.toFixed(2)} / ${p.target.toFixed(2)}</span>
                  </div>
                  <div className="pot-bar">
                    <div className="pot-fill" style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AnalyticsPage;