import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;