import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addToCartApi,
  getMyCartApi,
  updateCartQuantityApi,
  removeCartItemApi,
  deleteAllCartApi,
} from "./cartApi";

export const getMyCart = createAsyncThunk(
  "cart/getMyCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getMyCartApi();
      const raw = Array.isArray(data) ? data : data.items ?? data.cart ?? [];
      return raw.map((item) => ({
        _id: item._id,
        productId: item.product?._id ?? item.productId,
        title: item.product?.name ?? item.title ?? "",
        image: item.product?.images?.[0] ?? item.image ?? "",
        price: item.product?.discountPrice ?? item.product?.price ?? item.price ?? 0,
        quantity: item.quantity,
      }));
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message ?? "Failed to fetch cart");
    }
  }
);

/**
 * Add a product to the cart.
 * POST /api/cart/add  →  { productId, quantity }
 * Optimistic: item appears in Redux immediately; reverted on failure.
 * After success, refreshes cart from server so items get their real _id.
 */
export const addToCart = createAsyncThunk(
  "cart/addItem",
  async ({ productId, quantity, title, image, price }, { rejectWithValue }) => {
    try {
      const { data } = await addToCartApi(productId, quantity ?? 1);
      return { productId, quantity: quantity ?? 1, title, image, price, serverItem: data };
    } catch (err) {
      return rejectWithValue({
        productId,
        quantity: quantity ?? 1,
        message: err?.response?.data?.message ?? "Failed to add to cart",
      });
    }
  }
);

/**
 * Update the quantity of a specific cart item.
 * PUT /api/cart/:id  →  { quantity }
 * Optimistic update; reverts on failure.
 */
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ id, quantity }, { rejectWithValue, getState }) => {
    const prevQuantity = getState().cart.items.find((i) => i._id === id)?.quantity;
    try {
      await updateCartQuantityApi(id, quantity);
      return { id, quantity };
    } catch (err) {
      return rejectWithValue({
        id,
        prevQuantity,
        message: err?.response?.data?.message ?? "Failed to update quantity",
      });
    }
  }
);

/**
 * Remove a single cart item.
 * DELETE /api/cart/:id
 * Optimistic removal; reverts on failure.
 */
export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (id, { rejectWithValue, getState }) => {
    const removed = getState().cart.items.find((i) => i._id === id);
    try {
      await removeCartItemApi(id);
      return id;
    } catch (err) {
      return rejectWithValue({
        item: removed,
        message: err?.response?.data?.message ?? "Failed to remove item",
      });
    }
  }
);

/**
 * Clear the entire cart.
 * DELETE /api/cart/clear
 * Optimistic clear; reverts on failure.
 */
export const deleteAllCart = createAsyncThunk(
  "cart/deleteAll",
  async (_, { rejectWithValue }) => {
    try {
      await deleteAllCartApi();
      return [];
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message ?? "Failed to clear cart");
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────

const initialState = {
  items: [],   // [{ _id, productId, title, image, price, quantity }]
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

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },

    updateCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) item.quantity = quantity;
    },

    clearCart: (state) => {
      state.items = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // ── getMyCart ──────────────────────────────────────────────────────────
      .addCase(getMyCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMyCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch cart";
      })

      // ── addToCart ──────────────────────────────────────────────────────────
      .addCase(addToCart.pending, (state, action) => {
        const { productId, quantity, title, image, price } = action.meta.arg;
        const existing = state.items.find((i) => i.productId === productId);
        if (existing) {
          existing.quantity += quantity ?? 1;
        } else {
          state.items.push({
            _id: null,
            productId,
            title: title ?? "",
            image: image ?? "",
            price: price ?? 0,
            quantity: quantity ?? 1,
          });
        }
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const { productId, serverItem } = action.payload;
        const item = state.items.find((i) => i.productId === productId);
        if (item && serverItem?._id) {
          item._id = serverItem._id;
        }
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        const { productId, quantity } = action.payload ?? {};
        state.error = action.payload?.message ?? "Failed to add to cart";
        if (productId) {
          const item = state.items.find((i) => i.productId === productId);
          if (item) {
            item.quantity -= quantity ?? 1;
            if (item.quantity <= 0) {
              state.items = state.items.filter((i) => i.productId !== productId);
            }
          }
        }
      })

      // ── updateCartItemQuantity ─────────────────────────────────────────────
      .addCase(updateCartItemQuantity.pending, (state, action) => {
        const { id, quantity } = action.meta.arg;
        const item = state.items.find((i) => i._id === id);
        if (item) item.quantity = quantity;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const { id, quantity } = action.payload;
        const item = state.items.find((i) => i._id === id);
        if (item) item.quantity = quantity;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        const { id, prevQuantity } = action.payload ?? {};
        state.error = action.payload?.message ?? "Failed to update quantity";
        if (id != null && prevQuantity != null) {
          const item = state.items.find((i) => i._id === id);
          if (item) item.quantity = prevQuantity;
        }
      })

      // ── removeCartItem ─────────────────────────────────────────────────────
      .addCase(removeCartItem.pending, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.meta.arg);
      })
      .addCase(removeCartItem.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload?.message ?? "Failed to remove item";
        if (action.payload?.item) {
          state.items.push(action.payload.item);
        }
      })

      // ── deleteAllCart ──────────────────────────────────────────────────────
      .addCase(deleteAllCart.pending, (state) => {
        state.items = [];
      })
      .addCase(deleteAllCart.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(deleteAllCart.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to clear cart";
      });
  },
});

export const {
  setCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
