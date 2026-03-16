import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const sendMessage = createAsyncThunk('chat/sendMessage', async ({ message, history }) => {
  const res = await axios.post(`${API}/chat`, { message, history });
  return res.data;
});

export const fetchHistory = createAsyncThunk('chat/fetchHistory', async () => {
  const res = await axios.get(`${API}/chat/history`);
  return res.data.data;
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearChat: (state) => { state.messages = []; },
    addMessage: (state, action) => { state.messages.push(action.payload); },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          role: 'assistant',
          content: action.payload.response,
          agent_used: action.payload.agent_used,
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.messages = action.payload.map(m => ({
          role: m.role,
          content: m.message,
          agent_used: m.agent_used,
        }));
      });
  },
});

export const { clearChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer;