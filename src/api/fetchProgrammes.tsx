import { supabase } from '../utils/supabaseClient';

const fetchProgrammes = async () => {
  const { data, error } = await supabase
    .from('programmes')
    .select('*')
    .eq('is_active', 'TRUE');

  if (error) {
    throw error;
  }

  return data;
};

export default fetchProgrammes;