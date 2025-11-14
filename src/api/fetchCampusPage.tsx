import { supabase } from '../utils/supabaseClient';

const fetchCampusPage = async () => {
  const { data, error } = await supabase
    .from('temp_campus_page')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
};

export default fetchCampusPage;