import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/axios";

// ─── Thunks ────────────────────────────────────────────────────────────────

/** Fetch seller dashboard statistics */
export const fetchSellerDashboard = createAsyncThunk(
  "seller/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/seller/dashboard");
      return data.dashboard ?? data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to load seller dashboard"
      );
    }
  }
);

/** Fetch seller's own products */
export const fetchSellerProducts = createAsyncThunk(
  "seller/fetchProducts",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/seller/products", {
        params: { page, limit },
      });
      const items = data.products ?? data.data ?? data ?? [];
      const total = data.total ?? data.totalProducts ?? items.length;
      const totalPages =
        data.totalPages ?? Math.max(1, Math.ceil(total / limit));
      return { items, total, totalPages, page };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to load products"
      );
    }
  }
);

/** Fetch seller's orders */
export const fetchSellerOrders = createAsyncThunk(
  "seller/fetchOrders",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/seller/orders", {
        params: { page, limit },
      });
      const items = data.orders ?? data.data ?? data ?? [];
      const total = data.total ?? data.totalOrders ?? items.length;
      const totalPages =
        data.totalPages ?? Math.max(1, Math.ceil(total / limit));
      return { items, total, totalPages, page };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to load orders"
      );
    }
  }
);

/** Fetch seller analytics */
export const fetchSellerAnalytics = createAsyncThunk(
  "seller/fetchAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/seller/analytics");
      return data.analytics ?? data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to load analytics"
      );
    }
  }
);

/** Update status of a seller order */
export const updateSellerOrderStatus = createAsyncThunk(
  "seller/updateOrderStatus",
  async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/seller/orders/${orderId}/status`, {
        orderStatus,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to update order status"
      );
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────

const initialState = {
  // Dashboard stats
  dashboard: null,
  dashboardLoading: false,
  dashboardError: null,

  // Seller products
  products: {
    items: [],
    total: 0,
    totalPages: 1,
    page: 1,
    loading: false,
    error: null,
  },

  // Seller orders
  orders: {
    items: [],
    total: 0,
    totalPages: 1,
    page: 1,
    loading: false,
    error: null,
  },

  // Seller analytics
  analytics: null,
  analyticsLoading: false,
  analyticsError: null,
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,

  reducers: {
    clearSellerState: () => initialState,
  },

  extraReducers: (builder) => {
    // ── fetchSellerDashboard ─────────────────────────────────────────────
    builder
      .addCase(fetchSellerDashboard.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchSellerDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload;
        state.dashboardLoading = false;
        state.dashboardError = null;
      })
      .addCase(fetchSellerDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload ?? "Failed to load dashboard";
      });

    // ── fetchSellerProducts ──────────────────────────────────────────────
    builder
      .addCase(fetchSellerProducts.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.products.items = action.payload.items;
        state.products.total = action.payload.total;
        state.products.totalPages = action.payload.totalPages;
        state.products.page = action.payload.page;
        state.products.loading = false;
        state.products.error = null;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload ?? "Failed to load products";
      });

    // ── fetchSellerAnalytics ─────────────────────────────────────────────
    builder
      .addCase(fetchSellerAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.analyticsError = null;
      })
      .addCase(fetchSellerAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
        state.analyticsLoading = false;
        state.analyticsError = null;
      })
      .addCase(fetchSellerAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.analyticsError = action.payload ?? "Failed to load analytics";
      });

    // ── fetchSellerOrders ────────────────────────────────────────────────
    builder
      .addCase(fetchSellerOrders.pending, (state) => {
        state.orders.loading = true;
        state.orders.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.orders.items = action.payload.items;
        state.orders.total = action.payload.total;
        state.orders.totalPages = action.payload.totalPages;
        state.orders.page = action.payload.page;
        state.orders.loading = false;
        state.orders.error = null;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.orders.loading = false;
        state.orders.error = action.payload ?? "Failed to load orders";
      });
  },
});

export const { clearSellerState } = sellerSlice.actions;

export default sellerSlice.reducer;
