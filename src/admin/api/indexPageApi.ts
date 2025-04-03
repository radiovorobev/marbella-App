import { supabase } from '../../utils/supabaseClient';
import { IndexPageData, IndexPageFormData } from '../indexPageTypes';

export const indexPageApi = {
  // Get homepage data
  async getIndexPageData(): Promise<IndexPageData | null> {
    try {
      console.log('Starting request for homepage data from Supabase...');
      const { data, error } = await supabase
        .from('temp_index_page')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // If no record exists, it's not an error for us - just no data
        if (error.code === 'PGRST116') {
          console.log('Homepage data not found');
          return null;
        }
        console.error('Supabase error when getting homepage data:', error);
        throw error;
      }
      
      console.log('Homepage data received');
      return data;
    } catch (e) {
      console.error('Unhandled error in getIndexPageData:', e);
      throw e;
    }
  },

  // Update/create homepage data
  async updateIndexPageData(formData: IndexPageFormData): Promise<IndexPageData> {
    try {
      // First check if a record already exists
      const existingData = await this.getIndexPageData();
      
      if (existingData) {
        // Update existing record
        const { data, error } = await supabase
          .from('temp_index_page')
          .update(formData)
          .eq('id', existingData.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating homepage data:', error);
          throw error;
        }
        
        return data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('temp_index_page')
          .insert(formData)
          .select()
          .single();

        if (error) {
          console.error('Error creating homepage data:', error);
          throw error;
        }
        
        return data;
      }
    } catch (e) {
      console.error('Unhandled error in updateIndexPageData:', e);
      throw e;
    }
  }
};