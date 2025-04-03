import { supabase } from '../../utils/supabaseClient';
import { MenuItem, MenuItemFormData, MenuType } from '../menuTypes';

export const menuApi = {
  // Get all menu items
  async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      console.log('Starting request for menu items from Supabase...');
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Supabase error when getting menu items:', error);
        throw error;
      }
      
      console.log('Menu items received:', data);
      return data || [];
    } catch (e) {
      console.error('Unhandled error in getAllMenuItems:', e);
      throw e;
    }
  },

  // Get menu items by type (header or footer)
  async getMenuItemsByType(type: MenuType): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('type', type)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error(`Error getting ${type} menu items:`, e);
      throw e;
    }
  },

  // Get menu item by ID
  async getMenuItemById(id: number): Promise<MenuItem> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Error getting menu item by ID:', e);
      throw e;
    }
  },

  // Create a new menu item
  async createMenuItem(menuItem: MenuItemFormData): Promise<MenuItem> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert(menuItem)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Error creating menu item:', e);
      throw e;
    }
  },

  // Update a menu item
  async updateMenuItem(id: number, menuItem: MenuItemFormData): Promise<MenuItem> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update(menuItem)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Error updating menu item:', e);
      throw e;
    }
  },

  // Delete a menu item
  async deleteMenuItem(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      console.error('Error deleting menu item:', e);
      throw e;
    }
  },

  // Update menu items order
  async updateMenuItemsOrder(items: { id: number; sort_order: number }[]): Promise<void> {
    try {
      // Create a transaction to update all items at once
      for (const item of items) {
        const { error } = await supabase
          .from('menu_items')
          .update({ sort_order: item.sort_order })
          .eq('id', item.id);
        
        if (error) throw error;
      }
    } catch (e) {
      console.error('Error updating menu items order:', e);
      throw e;
    }
  }
};