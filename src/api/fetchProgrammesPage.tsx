import { supabase } from '../utils/supabaseClient';

const fetchProgrammesPage = async () => {
  const { data, error } = await supabase
    .from('temp_programmes_page')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
};

export default fetchProgrammesPage;