import { createSlice } from "@reduxjs/toolkit";
import { MOCK_SELLER_APPLICATIONS } from "@/constants/adminMockData";

const initialState = {
  applications: MOCK_SELLER_APPLICATIONS,
  selectedApplication: null,
  loading: false,
  error: null,
  filters: { status: "all" },
};

const sellerApplicationSlice = createSlice({
  name: "sellerApplications",
  initialState,
  reducers: {
    setApplications: (state, action) => {
      state.applications = action.payload;
    },
    setSelectedApplication: (state, action) => {
      state.selectedApplication = action.payload;
    },
    approveApplication: (state, action) => {
      const idx = state.applications.findIndex((a) => a.id === action.payload);
      if (idx !== -1) state.applications[idx].status = "approved";
    },
    rejectApplication: (state, action) => {
      const { id, reason } = action.payload;
      const idx = state.applications.findIndex((a) => a.id === id);
      if (idx !== -1) {
        state.applications[idx].status = "rejected";
        state.applications[idx].rejectionReason = reason;
      }
    },
    setApplicationFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setApplicationLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setApplications, setSelectedApplication, approveApplication,
  rejectApplication, setApplicationFilters, setApplicationLoading,
} = sellerApplicationSlice.actions;
export default sellerApplicationSlice.reducer;
