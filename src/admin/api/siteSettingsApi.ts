// src/admin/api/siteSettingsApi.ts
import { supabase } from '../../utils/supabaseClient';
import { SiteSettings, SiteSettingsFormData } from '../siteSettingsTypes';

export const siteSettingsApi = {
  // Get site settings
  async getSiteSettings(): Promise<SiteSettings | null> {
    try {
      console.log('Starting request for site settings data from Supabase...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // If no record exists, it's not an error for us - just no data
        if (error.code === 'PGRST116') {
          console.log('Site settings data not found');
          return null;
        }
        console.error('Supabase error when getting site settings data:', error);
        throw error;
      }
      
      console.log('Site settings data received');
      return data;
    } catch (e) {
      console.error('Unhandled error in getSiteSettings:', e);
      throw e;
    }
  },

  // Update/create site settings
  async updateSiteSettings(formData: SiteSettingsFormData): Promise<SiteSettings> {
    try {
      // First check if a record already exists
      const existingSettings = await this.getSiteSettings();
      
      if (existingSettings) {
        // Update existing record
        const { data, error } = await supabase
          .from('site_settings')
          .update(formData)
          .eq('id', existingSettings.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating site settings:', error);
          throw error;
        }
        
        return data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('site_settings')
          .insert(formData)
          .select()
          .single();

        if (error) {
          console.error('Error creating site settings:', error);
          throw error;
        }
        
        return data;
      }
    } catch (e) {
      console.error('Unhandled error in updateSiteSettings:', e);
      throw e;
    }
  }
};