import { supabase } from '../utils/supabaseClient';

const fetchArticle = async (id: number) => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

export default fetchArticle;