import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PageLoader from "../components/common/PageLoader";

const RoleGuard = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <PageLoader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

 if (!allowedRoles.includes(user?.role?.toUpperCase())) {
  return <Navigate to="/home" replace />;

  }

  return children;
};

export default RoleGuard;
