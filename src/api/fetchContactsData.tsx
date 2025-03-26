import { supabase } from '../utils/supabaseClient';

const fetchContactsData = async () => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('address_en, address_es, address_ru, phone_number, whatsapp_link, address_url');
  if (error) {
    throw error;
  }

  return data;
};

export default fetchContactsData;