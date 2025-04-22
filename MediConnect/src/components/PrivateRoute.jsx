import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    // If not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userInfo.user.role)) {
    // If logged in but role is not allowed, redirect to Home
    return <Navigate to="/" replace />;
  }

  // If role is allowed, render the component
  return children;
};

export default PrivateRoute;
