import { supabase } from '../utils/supabaseClient';

const fetchIndexAbout = async () => {
  try {
    const { data, error } = await supabase
      .from('temp_index_page')
      .select('about_header_en, about_header_es, about_header_ru, bullit_one_header_en, bullit_one_header_es, bullit_one_header_ru, bullit_two_header_en, bullit_two_header_es, bullit_two_header_ru, bullit_three_header_en, bullit_three_header_es, bullit_three_header_ru, bullit_one_text_en, bullit_one_text_es, bullit_one_text_ru, bullit_two_text_en, bullit_two_text_es, bullit_two_text_ru, bullit_three_text_en, bullit_three_text_es, bullit_three_text_ru')
    
    if (error) {
      throw error;
    }
    
    if (data) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching about index data:', error);
    return null;
  }
}

export default fetchIndexAbout;