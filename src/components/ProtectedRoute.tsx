import { useAuth } from "../hooks/useAuth.ts";
import { Spinner } from "react-bootstrap";
import { Outlet, Navigate } from "react-router-dom";
import React from "react";

/**
 * A component that wraps routes requiring authentication.
 * - Shows a loading spinner while checking auth status.
 * - Renders the child route (via Outlet) if the user is authenticated.
 * - Redirects to the login page if the user is not authenticated.
 */
const ProtectedRoute: React.FC = () => {
  const { accessToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation={"border"} role={"status"}>
          <span className={"visually-hidden"}>Loading...</span>
        </Spinner>
      </div>
    );
  }
  if (accessToken) {
    return <Outlet />;
  }
  return <Navigate to={"/login"} replace />;
};

export default ProtectedRoute;
