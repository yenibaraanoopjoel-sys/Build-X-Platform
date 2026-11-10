import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Loader from "./components/Loader";

export const PrivateRoute = ({ children }) => {
  const { currentUser, loading, token } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!currentUser && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const PublicOnlyRoute = ({ children }) => {
  const { currentUser, loading, token } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (currentUser || token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
