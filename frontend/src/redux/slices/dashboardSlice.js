import { createSlice } from "@reduxjs/toolkit";
import {
  MOCK_DASHBOARD_STATS,
  MOCK_REVENUE_DATA,
  MOCK_CATEGORY_DATA,
  MOCK_RECENT_ORDERS,
  MOCK_TOP_PRODUCTS,
  MOCK_TOP_SELLERS,
  MOCK_RECENT_ACTIVITY,
} from "@/constants/adminMockData";

const initialState = {
  stats: MOCK_DASHBOARD_STATS,
  revenueData: MOCK_REVENUE_DATA,
  categoryData: MOCK_CATEGORY_DATA,
  recentOrders: MOCK_RECENT_ORDERS,
  topProducts: MOCK_TOP_PRODUCTS,
  topSellers: MOCK_TOP_SELLERS,
  recentActivity: MOCK_RECENT_ACTIVITY,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardLoading: (state, action) => {
      state.loading = action.payload;
    },
    setDashboardData: (state, action) => {
      const { stats, revenueData, categoryData, recentOrders, topProducts, topSellers, recentActivity } = action.payload;
      if (stats) state.stats = stats;
      if (revenueData) state.revenueData = revenueData;
      if (categoryData) state.categoryData = categoryData;
      if (recentOrders) state.recentOrders = recentOrders;
      if (topProducts) state.topProducts = topProducts;
      if (topSellers) state.topSellers = topSellers;
      if (recentActivity) state.recentActivity = recentActivity;
    },
    setDashboardError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setDashboardLoading, setDashboardData, setDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
