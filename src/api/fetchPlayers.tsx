import { supabase } from '../utils/supabaseClient';

const fetchPlayers = async () => {
  const { data, error } = await supabase
    .from('players')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
};

export default fetchPlayers;