import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import Navbar from './components/Navbar';
import DashboardPage from './pages/Dashboard';
import ChatPage from './pages/Chat';
import TransactionsPage from './pages/Transactions';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0' }}>
          <Navbar />
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
            </Routes>
          </div>
        </div>
        <Toaster position="top-right" />
      </BrowserRouter>
    </Provider>
  );
}

export default App;