import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div>
        <Loader2 />
      </div>
    );

  if (!user || user?.app_metadata?.role !== "super-admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
