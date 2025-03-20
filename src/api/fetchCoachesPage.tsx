import { supabase } from '../utils/supabaseClient';

const fetchCoachesPage = async () => {
  const { data, error } = await supabase
    .from('temp_coaches_page')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
};

export default fetchCoachesPage;