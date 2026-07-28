import { createSlice } from "@reduxjs/toolkit";
import { MOCK_RECENT_ORDERS } from "@/constants/adminMockData";

const initialState = {
  orders: MOCK_RECENT_ORDERS,
  selectedOrder: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: MOCK_RECENT_ORDERS.length },
  filters: { search: "", status: "all", payment: "all" },
};

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    setAdminOrders: (state, action) => {
      state.orders = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const idx = state.orders.findIndex((o) => o.id === id);
      if (idx !== -1) state.orders[idx].status = status;
    },
    setAdminOrderFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setAdminOrderPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setAdminOrderLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setAdminOrders, setSelectedOrder, updateOrderStatus,
  setAdminOrderFilters, setAdminOrderPage, setAdminOrderLoading,
} = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
