import { useEffect } from "react";
import { useDispatch } from "react-redux";

import api from "@/services/axios";
import { setUser, clearUser } from "@/redux/authSlice";
import { fetchWishlist, clearWishlist } from "@/redux/wishlistSlice";
import { getMyCart, clearCart } from "@/redux/cartSlice";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data } = await api.get("/user/me");

        if (!mounted) return;

        if (data?.user) {
          dispatch(setUser(data.user));
          dispatch(fetchWishlist());
          dispatch(getMyCart());
        } else {
          dispatch(clearUser());
          dispatch(clearWishlist());
          dispatch(clearCart());
        }
      } catch {
        // 401 = not logged in (expected); any other error = treat as logged out
        if (!mounted) return;
        dispatch(clearUser());
        dispatch(clearWishlist());
        dispatch(clearCart());
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return children;
};

export default AuthInitializer;
