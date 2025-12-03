import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { adminAuth } from "../../firebase";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication state on the Admin Auth instance
    const unsubscribe = adminAuth.onAuthStateChanged((user: any) => {
      setAuthenticated(!!user);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return authenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;