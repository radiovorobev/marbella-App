import { supabase } from '../utils/supabaseClient';

const fetchCampsPage = async () => {
  const { data, error } = await supabase
    .from('temp_camps_page')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
};

export default fetchCampsPage;