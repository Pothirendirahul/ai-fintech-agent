import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, addMessage, clearChat, fetchHistory } from '../store/chatSlice';
import { addNotification } from '../store/notificationSlice';
import socket from '../services/socket';
import toast from 'react-hot-toast';

const AGENT_COLORS = {
  analytics: '#38bdf8',
  fraud: '#ef4444',
  advisor: '#34d399',
  market: '#f59e0b',
};

const SUGGESTIONS = [
  'What is my total spending?',
  'Are there any suspicious transactions?',
  'Give me savings tips',
  'What is USD to INR rate?',
];

const Chat = () => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector(s => s.chat);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    dispatch(fetchHistory());

    socket.on('fraud:alert', (data) => {
      toast.error('🚨 Fraud Alert Detected!', { duration: 5000 });
      dispatch(addNotification({ message: data.message, type: 'fraud' }));
    });

    return () => socket.off('fraud:alert');
  }, [dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (msg) => {
    const text = msg || input.trim();
    if (!text) return;

    dispatch(addMessage({ role: 'user', content: text }));
    setInput('');

    dispatch(sendMessage({
      message: text,
      history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      <h2 style={{ color: '#e2e8f0', marginBottom: '16px' }}>🤖 AI Financial Assistant</h2>

      {/* Suggestions */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => handleSend(s)} style={{
            background: '#1e293b', border: '1px solid #334155', color: '#94a3b8',
            padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px',
          }}>
            {s}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', background: '#1e293b',
        borderRadius: '12px', padding: '16px', marginBottom: '16px',
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#475569', padding: '40px' }}>
            Ask me anything about your finances! 💬
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '12px',
          }}>
            <div style={{
              maxWidth: '70%', padding: '12px 16px', borderRadius: '12px',
              background: m.role === 'user' ? '#38bdf8' : '#0f172a',
              color: m.role === 'user' ? '#0f172a' : '#e2e8f0',
              border: m.role !== 'user' ? '1px solid #334155' : 'none',
            }}>
              {m.role !== 'user' && m.agent_used && (
                <div style={{
                  fontSize: '11px', marginBottom: '6px',
                  color: AGENT_COLORS[m.agent_used] || '#94a3b8',
                  fontWeight: 'bold', textTransform: 'uppercase',
                }}>
                  {m.agent_used} agent
                </div>
              )}
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', padding: '12px 16px', borderRadius: '12px', color: '#38bdf8' }}>
              🤔 Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your finances..."
          style={{
            flex: 1, padding: '14px 16px', borderRadius: '12px',
            background: '#1e293b', border: '1px solid #334155',
            color: '#e2e8f0', fontSize: '15px', outline: 'none',
          }}
        />
        <button onClick={() => handleSend()} disabled={loading} style={{
          padding: '14px 24px', borderRadius: '12px', border: 'none',
          background: loading ? '#334155' : '#38bdf8', color: '#0f172a',
          fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px',
        }}>
          {loading ? '...' : 'Send'}
        </button>
        <button onClick={() => dispatch(clearChat())} style={{
          padding: '14px 16px', borderRadius: '12px', border: '1px solid #334155',
          background: 'transparent', color: '#94a3b8', cursor: 'pointer',
        }}>
          🗑️
        </button>
      </div>
    </div>
  );
};

export default Chat;