import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "./MainLayout";

/**
 * UserLayout — wraps MainLayout with authentication protection.
 * Any route nested under this layout requires the user to be logged in.
 * Unauthenticated users are redirected to /login.
 */
const UserLayout = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout />;
};

export default UserLayout;
