// src/admin/api/coachesPageApi.ts
import { supabase } from '../../utils/supabaseClient';
import { CoachesPageData, CoachesPageFormData } from '../coachesPageTypes';

export const coachesPageApi = {
  // Get coaches page data
  async getCoachesPageData(): Promise<CoachesPageData | null> {
    try {
      console.log('Starting request for coaches page data from Supabase...');
      const { data, error } = await supabase
        .from('temp_coaches_page')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // If no record exists, it's not an error for us - just no data
        if (error.code === 'PGRST116') {
          console.log('No coaches page data found');
          return null;
        }
        console.error('Supabase error when getting coaches page data:', error);
        throw error;
      }
      
      console.log('Coaches page data received:', data);
      return data;
    } catch (e) {
      console.error('Unhandled error in getCoachesPageData:', e);
      throw e;
    }
  },

  // Update/create coaches page data
  async updateCoachesPageData(formData: CoachesPageFormData): Promise<CoachesPageData> {
    try {
      // First check if a record already exists
      const existingData = await this.getCoachesPageData();
      
      if (existingData) {
        // Update existing record
        const { data, error } = await supabase
          .from('temp_coaches_page')
          .update(formData)
          .eq('id', existingData.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating coaches page data:', error);
          throw error;
        }
        
        return data;
      } else {
        // Create a new record
        const { data, error } = await supabase
          .from('temp_coaches_page')
          .insert(formData)
          .select()
          .single();

        if (error) {
          console.error('Error creating coaches page data:', error);
          throw error;
        }
        
        return data;
      }
    } catch (e) {
      console.error('Unhandled error in updateCoachesPageData:', e);
      throw e;
    }
  }
};