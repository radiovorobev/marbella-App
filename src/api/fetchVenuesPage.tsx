import { supabase } from '../utils/supabaseClient';

const fetchVenuesPage = async () => {
  const { data, error } = await supabase
    .from('temp_venues_page')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
};

export default fetchVenuesPage;