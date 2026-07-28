import { createSlice } from "@reduxjs/toolkit";
import { MOCK_TOP_SELLERS } from "@/constants/adminMockData";

const initialState = {
  sellers: MOCK_TOP_SELLERS,
  selectedSeller: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: MOCK_TOP_SELLERS.length },
  filters: { search: "", status: "all" },
};

const sellerSlice = createSlice({
  name: "adminSellers",
  initialState,
  reducers: {
    setSellers: (state, action) => {
      state.sellers = action.payload;
    },
    setSelectedSeller: (state, action) => {
      state.selectedSeller = action.payload;
    },
    updateSeller: (state, action) => {
      const idx = state.sellers.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) state.sellers[idx] = { ...state.sellers[idx], ...action.payload };
    },
    deleteSeller: (state, action) => {
      state.sellers = state.sellers.filter((s) => s.id !== action.payload);
    },
    setSellerFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSellerLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setSellers, setSelectedSeller, updateSeller, deleteSeller,
  setSellerFilters, setSellerLoading,
} = sellerSlice.actions;
export default sellerSlice.reducer;
