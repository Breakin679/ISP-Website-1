// src/components/AdminRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function AdminRoute({ children }) {
  // Read the role from localStorage (set by your AuthForm)
  const role = localStorage.getItem("role");

  // Capture where they were trying to go
  const location = useLocation();

  // If not an admin, redirect them back to /
  if (role !== "admin") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Otherwise render the protected admin component
  return children;
}
