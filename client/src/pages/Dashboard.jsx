import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from '../store/dashboardSlice';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#38bdf8', '#34d399', '#f59e0b', '#ef4444', '#a78bfa', '#fb923c'];

const Card = ({ title, value, sub, color }) => (
  <div style={{
    background: '#1e293b', borderRadius: '12px', padding: '20px',
    border: `1px solid ${color}33`,
  }}>
    <p style={{ margin: '0 0 8px', color: '#94a3b8', fontSize: '14px' }}>{title}</p>
    <h2 style={{ margin: '0 0 4px', color, fontSize: '28px' }}>{value}</h2>
    {sub && <p style={{ margin: 0, color: '#64748b', fontSize: '12px' }}>{sub}</p>}
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { summary, byCategory, recent, trend, flagged, loading } = useSelector(s => s.dashboard);

  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#38bdf8' }}>Loading dashboard...</div>;

  const expenseCategories = byCategory.filter(c => c.type === 'expense').map(c => ({
    name: c.category, value: parseFloat(c.total)
  }));

  return (
    <div>
      <h2 style={{ color: '#e2e8f0', marginBottom: '24px' }}>📊 Financial Dashboard</h2>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <Card title="Total Income" value={`$${parseFloat(summary.total_income || 0).toLocaleString()}`} color="#34d399" />
        <Card title="Total Expenses" value={`$${parseFloat(summary.total_expenses || 0).toLocaleString()}`} color="#ef4444" />
        <Card title="Net Balance" value={`$${parseFloat(summary.net_balance || 0).toLocaleString()}`} color="#38bdf8" />
        <Card title="Transactions" value={summary.total_transactions || 0} color="#a78bfa" />
        <Card title="Flagged" value={summary.flagged_count || 0} color="#f59e0b" sub="Suspicious transactions" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>

        {/* Bar Chart - Trend */}
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ color: '#e2e8f0', marginTop: 0 }}>📈 Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[...trend].reverse()}>
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
              <Bar dataKey="income" fill="#34d399" radius={[4,4,0,0]} />
              <Bar dataKey="expenses" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Categories */}
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ color: '#e2e8f0', marginTop: 0 }}>🍕 Spending by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={expenseCategories} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name}>
                {expenseCategories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Flagged Transactions */}
      {flagged.length > 0 && (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid #ef444433' }}>
          <h3 style={{ color: '#ef4444', marginTop: 0 }}>🚨 Flagged Transactions</h3>
          {flagged.map(t => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#0f172a', borderRadius: '8px', marginBottom: '8px' }}>
              <span style={{ color: '#e2e8f0' }}>{t.title}</span>
              <span style={{ color: '#ef4444' }}>${t.amount}</span>
              <span style={{ color: '#94a3b8', fontSize: '12px' }}>{t.flag_reason}</span>
            </div>
          ))}
        </div>
      )}

      {/* Recent Transactions */}
      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ color: '#e2e8f0', marginTop: 0 }}>🕒 Recent Transactions</h3>
        {recent.map(t => (
          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#0f172a', borderRadius: '8px', marginBottom: '8px' }}>
            <span style={{ color: '#e2e8f0' }}>{t.title}</span>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>{t.category}</span>
            <span style={{ color: t.type === 'income' ? '#34d399' : '#ef4444' }}>
              {t.type === 'income' ? '+' : '-'}${t.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;