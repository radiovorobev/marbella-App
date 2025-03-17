import { supabase } from '../utils/supabaseClient';

const fetchLanguages = async () => {
  try {
    const { data, error } = await supabase
      .from('languages')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    if (data) {
      return data;
    }
  } catch (error) {
    console.error('Error fetching languages:', error);
  }
}

export default fetchLanguages;