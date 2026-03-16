import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchDashboard = createAsyncThunk('dashboard/fetch', async () => {
  const res = await axios.get(`${API}/dashboard`);
  return res.data.data;
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    summary: {},
    byCategory: [],
    recent: [],
    trend: [],
    flagged: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
        state.byCategory = action.payload.byCategory;
        state.recent = action.payload.recent;
        state.trend = action.payload.trend;
        state.flagged = action.payload.flagged;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;