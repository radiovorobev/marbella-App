import { supabase } from '../utils/supabaseClient';

const fetchCoaches = async () => {
  const { data, error } = await supabase
    .from('coaches')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};

export default fetchCoaches