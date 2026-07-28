import { createSlice } from "@reduxjs/toolkit";
import { MOCK_NOTIFICATIONS } from "@/constants/adminMockData";

const initialState = {
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.read).length,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
    markAsRead: (state, action) => {
      const idx = state.notifications.findIndex((n) => n.id === action.payload);
      if (idx !== -1) {
        state.notifications[idx].read = true;
        state.unreadCount = state.notifications.filter((n) => !n.read).length;
      }
    },
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
      state.unreadCount = 0;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) state.unreadCount += 1;
    },
  },
});

export const { setNotifications, markAsRead, markAllAsRead, addNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
