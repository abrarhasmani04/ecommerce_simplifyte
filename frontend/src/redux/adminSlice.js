import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/axios";

// ─── Thunks ────────────────────────────────────────────────────────────────

/** Fetch admin dashboard summary (users, products, orders, revenue) */
export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/dashboard");
      return data.dashboard ?? data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to load admin dashboard"
      );
    }
  }
);

/** Fetch all users (paginated) */
export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchUsers",
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/users", {
        params: { page, limit },
      });
      const items = data.users ?? data.data ?? data ?? [];
      const total = data.total ?? data.totalUsers ?? items.length;
      const totalPages =
        data.totalPages ?? Math.max(1, Math.ceil(total / limit));
      return { items, total, totalPages, page };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to load users"
      );
    }
  }
);

/** Fetch seller applications */
export const fetchSellerApplications = createAsyncThunk(
  "admin/fetchSellerApplications",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/seller-applications");
      return data.applications ?? data ?? [];
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to load applications"
      );
    }
  }
);

/** Fetch recent orders (last 10) */
export const fetchRecentOrders = createAsyncThunk(
  "admin/fetchRecentOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/recent-orders");
      return data.recentOrders ?? data.orders ?? data ?? [];
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to load recent orders"
      );
    }
  }
);

/** Approve or reject a seller application */
export const updateSellerApplication = createAsyncThunk(
  "admin/updateSellerApplication",
  async ({ id, status, rejectionReason }, { rejectWithValue }) => {
    try {
      await api.put(`/admin/seller-applications/${id}`, {
        status,
        ...(rejectionReason ? { rejectionReason } : {}),
      });
      return { id, status: status.toLowerCase(), rejectionReason };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to update application"
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

  // Users list
  users: {
    items: [],
    total: 0,
    totalPages: 1,
    page: 1,
    loading: false,
    error: null,
  },

  // Seller applications
  applications: {
    items: [],
    loading: false,
    error: null,
  },

  // Recent orders
  recentOrders: {
    items: [],
    loading: false,
    error: null,
  },
};

const adminSlice = createSlice({
  name: "admin",
  initialState,

  reducers: {
    clearAdminState: () => initialState,
  },

  extraReducers: (builder) => {
    // ── fetchAdminDashboard ──────────────────────────────────────────────
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload;
        state.dashboardLoading = false;
        state.dashboardError = null;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload ?? "Failed to load dashboard";
      });

    // ── fetchAdminUsers ──────────────────────────────────────────────────
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.users.items = action.payload.items;
        state.users.total = action.payload.total;
        state.users.totalPages = action.payload.totalPages;
        state.users.page = action.payload.page;
        state.users.loading = false;
        state.users.error = null;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload ?? "Failed to load users";
      });

    // ── fetchSellerApplications ──────────────────────────────────────────
    builder
      .addCase(fetchSellerApplications.pending, (state) => {
        state.applications.loading = true;
        state.applications.error = null;
      })
      .addCase(fetchSellerApplications.fulfilled, (state, action) => {
        state.applications.items = action.payload;
        state.applications.loading = false;
        state.applications.error = null;
      })
      .addCase(fetchSellerApplications.rejected, (state, action) => {
        state.applications.loading = false;
        state.applications.error = action.payload ?? "Failed to load applications";
      });

    // ── updateSellerApplication ──────────────────────────────────────────
    builder
      .addCase(updateSellerApplication.fulfilled, (state, action) => {
        const { id, status, rejectionReason } = action.payload;
        const app = state.applications.items.find(
          (a) => a._id === id || a.id === id
        );
        if (app) {
          app.status = status;
          if (rejectionReason) app.rejectionReason = rejectionReason;
        }
      });

    // ── fetchRecentOrders ────────────────────────────────────────────────
    builder
      .addCase(fetchRecentOrders.pending, (state) => {
        state.recentOrders.loading = true;
        state.recentOrders.error = null;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.recentOrders.items = action.payload;
        state.recentOrders.loading = false;
        state.recentOrders.error = null;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.recentOrders.loading = false;
        state.recentOrders.error = action.payload ?? "Failed to load recent orders";
      });
  },
});

export const { clearAdminState } = adminSlice.actions;

export default adminSlice.reducer;
