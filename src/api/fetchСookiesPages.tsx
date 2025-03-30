import { supabase } from '../utils/supabaseClient';

const fetchCookiesPage = async () => {
  const { data, error } = await supabase
    .from('temp_cookies_page')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
};

export default fetchCookiesPage;