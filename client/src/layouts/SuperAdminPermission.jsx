import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const SuperAdminPermission = ({ children }) => {
  const user = useSelector((state) => state.user);

  if (user.role !== "SUPERADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default SuperAdminPermission;
