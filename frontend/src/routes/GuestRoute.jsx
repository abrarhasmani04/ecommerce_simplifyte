import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PageLoader from "../components/common/PageLoader";

const GuestRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    return children;
  }

  const role = user?.role?.toUpperCase();

  if (role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (role === "SELLER") {
    return <Navigate to="/seller/dashboard" replace />;
  }

  return <Navigate to="/home" replace />;
};

export default GuestRoute;