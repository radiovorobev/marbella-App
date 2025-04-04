import { supabase } from '../utils/supabaseClient';

const fetchProgrammes = async () => {
  const { data, error } = await supabase
    .from('programmes')
    .select('*')
    .eq('is_active', 'TRUE')
    .order('sort_order', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};

export default fetchProgrammes;