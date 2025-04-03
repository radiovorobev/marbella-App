export type UserRole = 'Admin' | 'Manager' | 'Editor';

export interface User {
  id: number;
  created_at: string;
  updated_at: string;
  email: string;
  name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: UserLogin) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}