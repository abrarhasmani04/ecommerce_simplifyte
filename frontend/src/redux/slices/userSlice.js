import { createSlice } from "@reduxjs/toolkit";
import { MOCK_USERS } from "@/constants/adminMockData";

const initialState = {
  users: MOCK_USERS,
  selectedUser: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: MOCK_USERS.length },
  filters: { search: "", status: "all", role: "all" },
};

const userSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    updateUser: (state, action) => {
      const idx = state.users.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) state.users[idx] = { ...state.users[idx], ...action.payload };
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
    setUserFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    setUserPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setUserLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setUsers, setSelectedUser, updateUser, deleteUser,
  setUserFilters, setUserPage, setUserLoading,
} = userSlice.actions;
export default userSlice.reducer;
