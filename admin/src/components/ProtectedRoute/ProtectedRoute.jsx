// src/admin/components/ProtectedRoute/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  // ✅ Safe JSON parse
  const getStoredUser = (key) => {
    try {
      const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const user = getStoredUser("user");

  // ✅ Not logged in → go to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Non-admin trying to access admin-only → go to home
  if (adminOnly && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
