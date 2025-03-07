import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = localStorage.getItem("token"); // Check if token exists

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
