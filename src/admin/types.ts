// types.ts
export type UserRole = 'Manager' | 'Admin' | 'User';

export interface User {
  id: number;
  created_at: string;
  updated_at: string;
  email: string;
  name: string;
  last_name: string;
  password: string;
  role: UserRole;
  is_active: boolean;
}

export interface UserFormData {
  email: string;
  name: string;
  last_name: string;
  password: string;
  role: UserRole;
  is_active: boolean;
}

export type UserUpdateData = Partial<Omit<UserFormData, 'email'>>;