import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyAddressesApi,
  addAddressApi,
  updateAddressApi,
  deleteAddressApi,
} from "@/services/addressApi";

// ─── Thunks 

export const fetchAddresses = createAsyncThunk(
  "address/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getMyAddressesApi();
      return data.addresses ?? data ?? [];
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to fetch addresses"
      );
    }
  }
);

const extractError = (err, fallback) => {
  const body = err?.response?.data;
  if (!body) return fallback;
  // express-validator shape: { errors: [{ msg, path }] }
  if (Array.isArray(body.errors) && body.errors.length > 0) {
    return body.errors[0].msg ?? fallback;
  }
  return body.message ?? fallback;
};

export const addAddress = createAsyncThunk(
  "address/add",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await addAddressApi(payload);
      return data.address;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to add address"));
    }
  }
);

export const updateAddress = createAsyncThunk(
  "address/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await updateAddressApi(id, payload);
      return data.address;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to update address"));
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteAddressApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to delete address"
      );
    }
  }
);

// ─── Slice 

const initialState = {
  addresses: [],
  selectedAddressId: null,
  loading: false,
  submitting: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,

  reducers: {
    selectAddress: (state, action) => {
      state.selectedAddressId = action.payload;
    },
    clearAddressError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ── fetchAddresses 
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
        state.loading = false;
        // Auto-select first address if none selected
        if (!state.selectedAddressId && action.payload.length > 0) {
          state.selectedAddressId = action.payload[0]._id;
        }
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── addAddress 
    builder
      .addCase(addAddress.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.unshift(action.payload);
        state.submitting = false;
        // Auto-select the newly added address
        state.selectedAddressId = action.payload._id;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });

    // ── updateAddress 
    builder
      .addCase(updateAddress.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        const idx = state.addresses.findIndex(
          (a) => a._id === action.payload._id
        );
        if (idx !== -1) state.addresses[idx] = action.payload;
        state.submitting = false;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });

    // ── deleteAddress 
    builder
      .addCase(deleteAddress.pending, (state, action) => {
        // Optimistic removal
        state.addresses = state.addresses.filter(
          (a) => a._id !== action.meta.arg
        );
        if (state.selectedAddressId === action.meta.arg) {
          state.selectedAddressId =
            state.addresses.length > 0 ? state.addresses[0]._id : null;
        }
      })
      .addCase(deleteAddress.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { selectAddress, clearAddressError } = addressSlice.actions;

export default addressSlice.reducer;
