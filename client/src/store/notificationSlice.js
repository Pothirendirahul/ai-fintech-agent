import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
        is_read: false,
      });
    },
    markAllRead: (state) => {
      state.items = state.items.map(n => ({ ...n, is_read: true }));
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, markAllRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;