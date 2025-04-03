import { supabase } from '../../utils/supabaseClient';
import { User, UserLogin } from '../authTypes';
import CryptoJS from 'crypto-js';

// Helper function to hash passwords
const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};

export const authApi = {
  // Login user
  async login(credentials: UserLogin): Promise<User> {
    try {
      // Hash the password before comparing
      const hashedPassword = hashPassword(credentials.password);
      
      // Fetch user by email
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', credentials.email)
        .eq('is_active', true)
        .single();

      if (error) {
        throw new Error('Invalid email or password');
      }

      if (!data) {
        throw new Error('User not found');
      }

      // Compare hashed passwords
      if (data.password !== hashedPassword) {
        throw new Error('Invalid email or password');
      }

      const user: User = {
        id: data.id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        email: data.email,
        name: data.name,
        last_name: data.last_name,
        role: data.role,
        is_active: data.is_active
      };

      // Store auth token in localStorage
      localStorage.setItem('auth_token', JSON.stringify({ user }));
      
      return user;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  },

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    
    try {
      const { user } = JSON.parse(token);
      return user;
    } catch (err) {
      console.error('Error parsing auth token:', err);
      return null;
    }
  },

  // Logout user
  logout(): void {
    localStorage.removeItem('auth_token');
  },

  // Check if user is authenticated and has required role
  hasAccess(requiredRole?: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // If no specific role is required, just being authenticated is enough
    if (!requiredRole) return true;
    
    // Admin has access to everything
    if (user.role === 'Admin') return true;
    
    // Check if user has the required role
    return user.role === requiredRole;
  }
};