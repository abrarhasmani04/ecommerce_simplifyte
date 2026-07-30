import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  items: [],      // [{ productId, title, image, price }]
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },

    addToWishlist: (state, action) => {
      const already = state.items.some(
        (item) => item.productId === action.payload.productId
      );
      if (!already) {
        state.items.push(action.payload);
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },

    clearWishlist: (state) => {
      state.items = [];
    },

    setWishlistLoading: (state, action) => {
      state.loading = action.payload;
    },

    setWishlistError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlistLoading,
  setWishlistError,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
