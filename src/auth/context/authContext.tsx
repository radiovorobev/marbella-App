// src/auth/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthState, User, UserLogin } from '../authTypes';
import { authApi } from '../api/authApi';
import { supabase } from '../../utils/supabaseClient';

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
        // Проверяем наличие пользователя в вашем custom хранилище
        const user = authApi.getCurrentUser();
        
        // Проверяем наличие активной сессии в Supabase
        const { data: sessionData } = await supabase.auth.getSession();
        const supabaseSessionActive = !!sessionData.session;
        
        console.log('Local user:', user);
        console.log('Supabase session active:', supabaseSessionActive);
        
        if (user) {
          // Если пользователь есть локально, но нет сессии в Supabase, 
          // пытаемся восстановить сессию
          if (!supabaseSessionActive) {
            console.log('Trying to restore Supabase session...');
            await authApi.refreshSession();
            
            // Повторно проверяем сессию после попытки восстановления
            const { data: refreshedSession } = await supabase.auth.getSession();
            console.log('Session after refresh attempt:', !!refreshedSession.session);
          }
          
          setAuthState({
            user,
            isAuthenticated: true,
            loading: false,
            error: null
          });
        } else {
          // Если локального пользователя нет, но есть сессия в Supabase,
          // очищаем и её для согласованности
          if (supabaseSessionActive) {
            console.log('Supabase session exists but no local user - signing out from Supabase');
            await supabase.auth.signOut();
          }
          
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
    
    // Слушаем изменения сессии Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Supabase auth event:', event);
        
        if (event === 'SIGNED_OUT') {
          // Если выход из Supabase, также очищаем локальное хранилище
          if (authState.isAuthenticated) {
            console.log('Signing out from local storage due to Supabase signout');
            authApi.logout();
            setAuthState({
              user: null,
              isAuthenticated: false,
              loading: false,
              error: null
            });
          }
        }
      }
    );
    
    // Очистка подписки при размонтировании
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (credentials: UserLogin) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Авторизация через ваше API
      const user = await authApi.login(credentials);
      
      // Проверяем активную сессию в Supabase после логина
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Supabase session after login:', !!sessionData.session);
      
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
  const logout = async () => {
    // Сначала выходим из Supabase
    await supabase.auth.signOut();
    
    // Затем из локального хранилища
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