import { createSlice } from "@reduxjs/toolkit";
import { MOCK_TOP_PRODUCTS } from "@/constants/adminMockData";

const initialState = {
  products: MOCK_TOP_PRODUCTS,
  selectedProduct: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: MOCK_TOP_PRODUCTS.length },
  filters: { search: "", category: "all", status: "all" },
};

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    setAdminProducts: (state, action) => {
      state.products = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    updateAdminProduct: (state, action) => {
      const idx = state.products.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.products[idx] = { ...state.products[idx], ...action.payload };
    },
    deleteAdminProduct: (state, action) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    setAdminProductFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setAdminProductPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setAdminProductLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setAdminProducts, setSelectedProduct, updateAdminProduct,
  deleteAdminProduct, setAdminProductFilters, setAdminProductPage,
  setAdminProductLoading,
} = adminProductSlice.actions;
export default adminProductSlice.reducer;
