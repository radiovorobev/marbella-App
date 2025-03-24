import { supabase } from '../utils/supabaseClient';

const fetchNewsPage = async () => {
  const { data, error } = await supabase
    .from('temp_news_page')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
};

export default fetchNewsPage;