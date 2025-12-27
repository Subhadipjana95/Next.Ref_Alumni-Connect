// Protected Route Component
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<'Student' | 'Alumni'>;
  redirectTo?: string;
}

/**
 * Protected Route wrapper that checks authentication and role-based access
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show nothing while checking auth status
  if (isLoading) {
    return null; // Or return a loading spinner component
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && !allowedRoles.includes(user.accountType)) {
    // Redirect to appropriate dashboard based on actual role
    const dashboardPath = user.accountType === 'Student' 
      ? '/student' 
      : '/alumni';
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
}

/**
 * Public Route wrapper that redirects authenticated users
 */
interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show nothing while checking auth status
  if (isLoading) {
    return null;
  }

  // Redirect authenticated users to their dashboard
  if (isAuthenticated && user) {
    const from = (location.state as { from?: Location })?.from?.pathname;
    const dashboardPath = user.accountType === 'Student' 
      ? '/student' 
      : '/alumni';
    return <Navigate to={from || dashboardPath} replace />;
  }

  return <>{children}</>;
}

/**
 * Hook to get role-based redirect path
 */
export function useRoleRedirect() {
  const { user, isAuthenticated } = useAuth();

  const getRedirectPath = (): string => {
    if (!isAuthenticated || !user) {
      return '/';
    }
    return user.accountType === 'Student' 
      ? '/student' 
      : '/alumni';
  };

  return { getRedirectPath };
}
