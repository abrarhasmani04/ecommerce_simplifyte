import { createSlice } from "@reduxjs/toolkit";
import { MOCK_CATEGORIES } from "@/constants/adminMockData";

const initialState = {
  categories: MOCK_CATEGORIES,
  selectedCategory: null,
  loading: false,
  error: null,
  filters: { search: "" },
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    addCategory: (state, action) => {
      state.categories.unshift(action.payload);
    },
    updateCategory: (state, action) => {
      const idx = state.categories.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.categories[idx] = { ...state.categories[idx], ...action.payload };
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter((c) => c.id !== action.payload);
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setCategoryFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setCategoryLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setCategories, addCategory, updateCategory, deleteCategory,
  setSelectedCategory, setCategoryFilters, setCategoryLoading,
} = categorySlice.actions;
export default categorySlice.reducer;
