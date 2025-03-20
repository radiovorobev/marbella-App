import { supabase } from '../utils/supabaseClient';

const fetchIndexPage = async () => {
  const { data, error } = await supabase
    .from('temp_index_page')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
};

export default fetchIndexPage;