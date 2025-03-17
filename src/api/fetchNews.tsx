import { supabase } from '../utils/supabaseClient';

const fetchNews = async () => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .limit(4)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

export default fetchNews;