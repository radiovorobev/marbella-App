import { supabase } from '../utils/supabaseClient';

const fetchAllNews = async (page = 0, pageSize = 4) => {
  const from = page * pageSize;
  
  const { data, error, count } = await supabase
    .from('news')
    .select('*', { count: 'exact' })
    .range(from, from + pageSize - 1)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return { 
    data,
    hasMore: count !== null ? count > from + pageSize : false,
    total: count || 0
  };
};

export default fetchAllNews;