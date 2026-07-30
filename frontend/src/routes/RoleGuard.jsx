import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleGuard = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default RoleGuard;
