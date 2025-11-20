import { Navigate } from "react-router-dom";
import { Status } from "../../../assets/globals/types/types";
import { useAppSelector } from "../../../store/hooks";
import type { JSX } from "react";

  const LoginProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, status } = useAppSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  // Only redirect if logged in and NOT in the process of showing toast
  const isLoggedIn = Boolean(user || (token && token.trim() !== ""));

  if (isLoggedIn && status !== Status.SUCCESS) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default LoginProtectedRoute
