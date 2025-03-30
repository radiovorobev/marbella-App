import { supabase } from '../utils/supabaseClient';

const fetchPrivacyPolicyPage = async () => {
  const { data, error } = await supabase
    .from('temp_privacyPolicy_page')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
};

export default fetchPrivacyPolicyPage;