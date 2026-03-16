import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';
import transactionReducer from './transactionSlice';
import dashboardReducer from './dashboardSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    transactions: transactionReducer,
    dashboard: dashboardReducer,
    notifications: notificationReducer,
  },
});

export default store;