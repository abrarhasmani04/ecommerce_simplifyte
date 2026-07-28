import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import orderReducer from "./slices/orderSlice";
// Admin slices
import dashboardReducer from "./slices/dashboardSlice";
import userReducer from "./slices/userSlice";
import sellerReducer from "./slices/sellerSlice";
import sellerApplicationReducer from "./slices/sellerApplicationSlice";
import adminOrderReducer from "./slices/adminOrderSlice";
import categoryReducer from "./slices/categorySlice";
import adminProductReducer from "./slices/adminProductSlice";
import notificationReducer from "./slices/notificationSlice";

const store = configureStore({
  reducer: {
    // Shared
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: orderReducer,
    // Admin
    dashboard: dashboardReducer,
    adminUsers: userReducer,
    adminSellers: sellerReducer,
    sellerApplications: sellerApplicationReducer,
    adminOrders: adminOrderReducer,
    categories: categoryReducer,
    adminProducts: adminProductReducer,
    notifications: notificationReducer,
  },
});

export default store;
