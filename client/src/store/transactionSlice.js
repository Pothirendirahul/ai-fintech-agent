import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchTransactions = createAsyncThunk('transactions/fetchAll', async (params = {}) => {
  const res = await axios.get(`${API}/transactions`, { params });
  return res.data.data;
});

export const addTransaction = createAsyncThunk('transactions/add', async (data) => {
  const res = await axios.post(`${API}/transactions`, data);
  return res.data.data;
});

export const deleteTransaction = createAsyncThunk('transactions/delete', async (id) => {
  await axios.delete(`${API}/transactions/${id}`);
  return id;
});

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => { state.loading = true; })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
      });
  },
});

export default transactionSlice.reducer;