import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],      // [{ productId, title, image, price, quantity }]
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },

    addToCart: (state, action) => {
      const existing = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (existing) {
        existing.quantity += action.payload.quantity ?? 1;
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity ?? 1 });
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },

    updateCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    setCartLoading: (state, action) => {
      state.loading = action.payload;
    },

    setCartError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  setCartLoading,
  setCartError,
} = cartSlice.actions;

export default cartSlice.reducer;
