// src/auth/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthState, User, UserLogin } from '../authTypes';
import { authApi } from '../api/authApi';

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  login: async () => {},
  logout: () => {},
  clearError: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null
  });

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = authApi.getCurrentUser();
        
        if (user) {
          setAuthState({
            user,
            isAuthenticated: true,
            loading: false,
            error: null
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null
          });
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: 'Failed to load user'
        });
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (credentials: UserLogin) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const user = await authApi.login(credentials);
      
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('Login error:', err);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        isAuthenticated: false,
        error: err instanceof Error ? err.message : 'Failed to login'
      }));
    }
  };

  // Logout function
  const logout = () => {
    authApi.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });
  };

  // Clear error function
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);