import { configureStore } from "@reduxjs/toolkit";

import authReducer     from "../features/auth/authSlice";
import cartReducer     from "../features/user/cart/cartSlice";
import wishlistReducer from "../features/user/wishlist/wishlistSlice";
import productReducer  from "../features/user/products/productSlice";
import sellerReducer   from "../features/seller/sellerSlice";
import adminReducer    from "../features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    auth:     authReducer,
    cart:     cartReducer,
    wishlist: wishlistReducer,
    products: productReducer,
    seller:   sellerReducer,
    admin:    adminReducer,
  },
});
