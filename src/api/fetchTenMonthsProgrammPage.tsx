import { supabase } from '../utils/supabaseClient';

const fetchTenMonthsProgrammPage = async () => {
  const { data, error } = await supabase
    .from('temp_ten_month_programm_page')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
};

export default fetchTenMonthsProgrammPage;