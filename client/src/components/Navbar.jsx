import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const location = useLocation();
  const notifications = useSelector(s => s.notifications.items);
  const unread = notifications.filter(n => !n.is_read).length;

  const links = [
    { path: '/dashboard', label: '📊 Dashboard' },
    { path: '/transactions', label: '💳 Transactions' },
    { path: '/chat', label: '🤖 AI Chat' },
  ];

  return (
    <nav style={{
      background: '#1e293b',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #334155',
    }}>
      <h1 style={{ margin: 0, fontSize: '20px', color: '#38bdf8' }}>
        💰 AI Fintech Agent
      </h1>
      <div style={{ display: 'flex', gap: '8px' }}>
        {links.map(l => (
          <Link key={l.path} to={l.path} style={{
            padding: '8px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            color: location.pathname === l.path ? '#0f172a' : '#94a3b8',
            background: location.pathname === l.path ? '#38bdf8' : 'transparent',
            fontWeight: '500',
            fontSize: '14px',
          }}>
            {l.label}
          </Link>
        ))}
        {unread > 0 && (
          <span style={{
            background: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
          }}>
            {unread}
          </span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;