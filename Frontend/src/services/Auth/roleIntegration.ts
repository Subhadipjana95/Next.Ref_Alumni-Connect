// Role-Based Authentication Integration
// Connects authentication flow with RoleSelector

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from '@/lib/types';

/**
 * Hook to handle role selection and route to appropriate auth flow
 * Works in conjunction with existing RoleSelector.tsx
 */
export function useRoleAuth() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle role selection from RoleSelector
   * Routes to appropriate auth page or dashboard
   */
  const handleRoleSelect = useCallback((role: UserRole) => {
    if (!role || role === 'verifier') {
      // Verifier role uses wallet-based auth from WalletContext
      return;
    }

    // If already authenticated, check role match
    if (isAuthenticated && user) {
      const userRole = user.accountType.toLowerCase();
      
      // If selecting same role and authenticated, go to dashboard
      if (userRole === role) {
        navigate(`/dashboard/${role}`);
        return;
      }
      
      // If selecting different role, need to logout first
      // This shouldn't happen if RoleSelector restrictions work correctly
      logout();
    }

    // Route to auth page for selected role
    navigate(`/auth/${role}`);
  }, [isAuthenticated, user, navigate, logout]);

  /**
   * Get the appropriate dashboard path based on user role
   */
  const getDashboardPath = useCallback((): string | null => {
    if (!isAuthenticated || !user) {
      return null;
    }
    
    const role = user.accountType.toLowerCase();
    return `/${role}`;
  }, [isAuthenticated, user]);

  /**
   * Check if user should be redirected from role selector
   * (i.e., they're already authenticated)
   */
  const shouldRedirectToDashboard = useCallback((): boolean => {
    return isAuthenticated && !!user;
  }, [isAuthenticated, user]);

  /**
   * Get current user role as UserRole type
   */
  const getCurrentRole = useCallback((): UserRole => {
    if (!isAuthenticated || !user) {
      return null;
    }
    return user.accountType.toLowerCase() as UserRole;
  }, [isAuthenticated, user]);

  return {
    handleRoleSelect,
    getDashboardPath,
    shouldRedirectToDashboard,
    getCurrentRole,
    isAuthenticated,
    user,
  };
}

/**
 * Maps backend accountType to frontend UserRole
 */
export function accountTypeToRole(accountType: 'Student' | 'Alumni'): UserRole {
  return accountType.toLowerCase() as UserRole;
}

/**
 * Maps frontend UserRole to backend accountType
 */
export function roleToAccountType(role: UserRole): 'Student' | 'Alumni' | null {
  if (role === 'student') return 'Student';
  if (role === 'alumni') return 'Alumni';
  return null;
}
