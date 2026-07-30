import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser, setLoading } from "../../features/auth/authSlice";
import api from "../../api/axios";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setLoading(true));
      try {
        const res = await api.get("/user/me");
        if (res.data.user) {
          dispatch(setUser(res.data.user));
        } else {
          dispatch(clearUser());
        }
      } catch {
        dispatch(clearUser());
      }
    };
    checkAuth();
  }, [dispatch]);

  return children;
};

export default AuthInitializer;
