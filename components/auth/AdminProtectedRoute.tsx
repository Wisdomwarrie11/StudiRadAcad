import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { adminAuth } from '../../firebase';
import { Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = adminAuth.onAuthStateChanged((currentUser: any) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Verifying access...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated, render the protected page
  return <>{children}</>;
};

export default AdminProtectedRoute;