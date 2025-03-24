import { supabase } from '../utils/supabaseClient';

const fetchContactsPage = async () => {
  const { data, error } = await supabase
    .from('temp_contacts_page')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
};

export default fetchContactsPage;