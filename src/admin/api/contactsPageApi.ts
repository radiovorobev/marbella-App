// src/admin/api/contactsPageApi.ts
import { supabase } from '../../utils/supabaseClient';
import { ContactsPageData, ContactsPageFormData } from '../contactsPageTypes';

export const contactsPageApi = {
  // Get contacts page data
  async getContactsPageData(): Promise<ContactsPageData | null> {
    try {
      console.log('Starting request for contacts page data from Supabase...');
      const { data, error } = await supabase
        .from('temp_contacts_page')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // If no record exists, it's not an error for us - just no data
        if (error.code === 'PGRST116') {
          console.log('Contacts page data not found');
          return null;
        }
        console.error('Supabase error when getting contacts page data:', error);
        throw error;
      }
      
      console.log('Contacts page data received');
      return data;
    } catch (e) {
      console.error('Unhandled error in getContactsPageData:', e);
      throw e;
    }
  },

  // Update/create contacts page data
  async updateContactsPageData(formData: ContactsPageFormData): Promise<ContactsPageData> {
    try {
      // First check if a record already exists
      const existingData = await this.getContactsPageData();
      
      if (existingData) {
        // Update existing record
        const { data, error } = await supabase
          .from('temp_contacts_page')
          .update(formData)
          .eq('id', existingData.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating contacts page data:', error);
          throw error;
        }
        
        return data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('temp_contacts_page')
          .insert(formData)
          .select()
          .single();

        if (error) {
          console.error('Error creating contacts page data:', error);
          throw error;
        }
        
        return data;
      }
    } catch (e) {
      console.error('Unhandled error in updateContactsPageData:', e);
      throw e;
    }
  }
};