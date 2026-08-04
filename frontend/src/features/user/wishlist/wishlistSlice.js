import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/axios";

// ─── Thunks ────────────────────────────────────────────────────────────────

/** Load all wishlist items for the logged-in user */
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/wishlist/");
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message ?? "Failed to load wishlist");
    }
  }
);

/**
 * Toggle wishlist item.
 * Caller must pass `isWishlisted` (current Redux state) so the thunk
 * knows what to do BEFORE the optimistic update mutates the store.
 */
export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async ({ productId, productData, isWishlisted }, { rejectWithValue }) => {
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${productId}`);
        return { action: "removed", productId };
      } else {
        await api.post(`/wishlist/${productId}/`);
        return { action: "added", productId, productData };
      }
    } catch (err) {
      return rejectWithValue({
        message: err?.response?.data?.message ?? "Wishlist update failed",
        isWishlisted,
        productId,
        productData,
      });
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────

const initialState = {
  items: [],      // [{ productId, title, image, price }]
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },

  extraReducers: (builder) => {
    // ── fetchWishlist ────────────────────────────────────────────────────
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const raw =
          action.payload?.wishlist ??
          action.payload?.items ??
          action.payload ??
          [];
        state.items = raw.map((entry) => {
          const p = entry.product ?? entry;
          return {
            productId: p._id ?? p.productId,
            title:     p.name  ?? p.title ?? "",
            image:     p.images?.[0] ?? p.image ?? "",
            price:     p.discountPrice ?? p.price ?? 0,
          };
        });
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── toggleWishlist ───────────────────────────────────────────────────
    builder
      .addCase(toggleWishlist.pending, (state, action) => {
        const { productId, productData, isWishlisted } = action.meta.arg;
        if (isWishlisted) {
          state.items = state.items.filter((i) => i.productId !== productId);
        } else if (productData) {
          state.items.push({
            productId,
            title: productData.title ?? "",
            image: productData.image ?? "",
            price: productData.price ?? 0,
          });
        }
      })
      .addCase(toggleWishlist.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        const { isWishlisted, productId, productData } = action.payload ?? {};
        state.error = action.payload?.message ?? "Wishlist update failed";

        if (isWishlisted) {
          if (productData && !state.items.some((i) => i.productId === productId)) {
            state.items.push({
              productId,
              title: productData.title ?? "",
              image: productData.image ?? "",
              price: productData.price ?? 0,
            });
          }
        } else {
          state.items = state.items.filter((i) => i.productId !== productId);
        }
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
