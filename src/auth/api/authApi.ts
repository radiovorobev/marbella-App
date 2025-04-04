// src/admin/api/authApi.ts

import { supabase } from '../../utils/supabaseClient';
import { User, UserLogin } from '../authTypes';
import CryptoJS from 'crypto-js';

// Helper function to hash passwords
const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};

// Helper to generate a strong, random password for Supabase Auth
const generateRandomPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
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

      // After validating the user in our custom table,
      // authenticate with Supabase Auth
      
      // Check if user already exists in Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      // If authentication in Supabase failed, it might be because the user doesn't exist in Auth
      if (authError) {
        console.log('Supabase Auth login failed, attempting signup', authError);
        
        // Try to sign up the user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password
        });

        if (signUpError) {
          console.error('Failed to sign up user in Supabase Auth:', signUpError);
          // Continue anyway, since we authenticated against our custom table
        } else {
          console.log('User signed up in Supabase Auth successfully');
        }
      } else {
        console.log('User logged in via Supabase Auth successfully');
      }

      // Create user object from custom table data
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
  async logout(): Promise<void> {
    // Sign out from Supabase Auth
    await supabase.auth.signOut();
    
    // Remove token from localStorage
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
  },

  // Check Supabase Auth session
  async checkSession(): Promise<boolean> {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  },

  // Refresh session if needed
  async refreshSession(): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) return false;

    const { data: sessionData } = await supabase.auth.getSession();
    
    // If session exists, we're good
    if (sessionData.session) return true;

    // If no session but we have a user, try to log in again silently
    try {
      // This is a simplified approach. In a real app, you might want to store
      // refresh tokens or handle this more securely.
      // For now, we'll just log the user in again if they have a valid session in localStorage
      await this.reAuthenticate(user.email);
      return true;
    } catch (error) {
      console.error('Failed to refresh session:', error);
      return false;
    }
  },

  // Re-authenticate with Supabase silently
  async reAuthenticate(email: string): Promise<void> {
    // In a real app, you would use a refresh token or a more secure method
    // This is a simplified version that would require the user's password again
    console.log('Attempting to re-authenticate with Supabase Auth');
    
    // For now, we'll just check if there's an existing session
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      console.warn('No active Supabase session, some operations might fail due to RLS policies');
    }
  }
};

export default authApi;
