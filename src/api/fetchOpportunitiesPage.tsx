import { supabase } from '../utils/supabaseClient';

const fetchOpportunitiesPage = async () => {
  const { data, error } = await supabase
    .from('temp_opportunities_page')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
};

export default fetchOpportunitiesPage;