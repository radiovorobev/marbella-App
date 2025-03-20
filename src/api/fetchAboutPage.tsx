import { supabase } from '../utils/supabaseClient';

const fetchAboutPage = async () => {
  const { data, error } = await supabase
    .from('temp_about_page')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
};

export default fetchAboutPage;