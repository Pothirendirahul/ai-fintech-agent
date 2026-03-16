import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, addTransaction, deleteTransaction } from '../store/transactionSlice';
import toast from 'react-hot-toast';

const CATEGORIES = ['salary', 'freelance', 'food', 'utilities', 'entertainment', 'health', 'shopping', 'transport', 'investment', 'education', 'transfer', 'general'];

const Transactions = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(s => s.transactions);
  const [filter, setFilter] = useState({ type: '', category: '' });
  const [form, setForm] = useState({ title: '', amount: '', type: 'expense', category: 'general' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { dispatch(fetchTransactions(filter)); }, [dispatch, filter]);

  const handleAdd = async () => {
    if (!form.title || !form.amount) return toast.error('Fill all fields');
    await dispatch(addTransaction(form));
    setForm({ title: '', amount: '', type: 'expense', category: 'general' });
    setShowForm(false);
    toast.success('Transaction added!');
  };

  const handleDelete = async (id) => {
    await dispatch(deleteTransaction(id));
    toast.success('Transaction deleted');
  };

  const inputStyle = {
    padding: '10px 12px', borderRadius: '8px', border: '1px solid #334155',
    background: '#0f172a', color: '#e2e8f0', fontSize: '14px', width: '100%',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#e2e8f0', margin: 0 }}>💳 Transactions</h2>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '10px 20px', borderRadius: '8px', border: 'none',
          background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer',
        }}>
          + Add Transaction
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ color: '#e2e8f0', marginTop: 0 }}>New Transaction</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input style={inputStyle} placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <input style={inputStyle} placeholder="Amount" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
            <select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={handleAdd} style={{
            marginTop: '12px', padding: '10px 24px', borderRadius: '8px',
            border: 'none', background: '#34d399', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer',
          }}>
            Save
          </button>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <select style={{ ...inputStyle, width: 'auto' }} value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select style={{ ...inputStyle, width: 'auto' }} value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', padding: '12px 16px', background: '#0f172a', color: '#64748b', fontSize: '13px', fontWeight: 'bold' }}>
          <span>Title</span><span>Category</span><span>Type</span><span>Amount</span><span>Action</span>
        </div>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#38bdf8' }}>Loading...</div>
        ) : items.map(t => (
          <div key={t.id} style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
            padding: '14px 16px', borderBottom: '1px solid #0f172a',
            background: t.is_flagged ? '#ef444411' : 'transparent',
            alignItems: 'center',
          }}>
            <span style={{ color: '#e2e8f0' }}>
              {t.is_flagged && '🚨 '}{t.title}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>{t.category}</span>
            <span style={{
              color: t.type === 'income' ? '#34d399' : '#f87171',
              textTransform: 'capitalize', fontSize: '13px',
            }}>{t.type}</span>
            <span style={{ color: t.type === 'income' ? '#34d399' : '#f87171', fontWeight: 'bold' }}>
              {t.type === 'income' ? '+' : '-'}${t.amount}
            </span>
            <button onClick={() => handleDelete(t.id)} style={{
              background: 'transparent', border: 'none', color: '#ef4444',
              cursor: 'pointer', fontSize: '16px',
            }}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;