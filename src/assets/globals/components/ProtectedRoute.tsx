import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import type { JSX } from "react";


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAppSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  const isLoggedIn = Boolean(user || (token && token.trim() !== ""));

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
