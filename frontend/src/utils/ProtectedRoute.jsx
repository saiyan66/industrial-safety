import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
 
  const { token, role } = useContext(AuthContext);
 
  // 1. Not logged in - redirect to login
  if (!token && !localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }
 
  // 2. Logged in but wrong role - redirect to overview
  const currentRole = role || localStorage.getItem("role");
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/" />;
  }
 
  return children;
}