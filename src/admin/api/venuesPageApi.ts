// src/admin/api/venuesPageApi.ts
import { supabase } from '../../utils/supabaseClient';
import { VenuesPageData, VenuesPageFormData } from '../venuesPageTypes';

export const venuesPageApi = {
  // Get venues page data
  async getVenuesPageData(): Promise<VenuesPageData | null> {
    try {
      console.log('Starting request for venues page data from Supabase...');
      const { data, error } = await supabase
        .from('temp_venues_page')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // If no record exists, it's not an error for us - just no data
        if (error.code === 'PGRST116') {
          console.log('Venues page data not found');
          return null;
        }
        console.error('Supabase error when getting venues page data:', error);
        throw error;
      }
      
      console.log('Venues page data received');
      return data;
    } catch (e) {
      console.error('Unhandled error in getVenuesPageData:', e);
      throw e;
    }
  },

  // Update/create venues page data
  async updateVenuesPageData(formData: VenuesPageFormData): Promise<VenuesPageData> {
    try {
      // First check if a record already exists
      const existingData = await this.getVenuesPageData();
      
      if (existingData) {
        // Update existing record
        const { data, error } = await supabase
          .from('temp_venues_page')
          .update(formData)
          .eq('id', existingData.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating venues page data:', error);
          throw error;
        }
        
        return data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('temp_venues_page')
          .insert(formData)
          .select()
          .single();

        if (error) {
          console.error('Error creating venues page data:', error);
          throw error;
        }
        
        return data;
      }
    } catch (e) {
      console.error('Unhandled error in updateVenuesPageData:', e);
      throw e;
    }
  },

  // Upload venues image
  async uploadVenuesImage(file: File): Promise<string> {
    try {
      const fileName = `venues-${Date.now()}-${file.name}`;
      const filePath = `venues/${fileName}`;
      
      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, file);
        
      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (e) {
      console.error('Unhandled error in uploadVenuesImage:', e);
      throw e;
    }
  }
};