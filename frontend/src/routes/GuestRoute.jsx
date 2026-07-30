import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default GuestRoute;
