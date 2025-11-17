import { supabase } from '../utils/supabaseClient';

const fetchMenu = async () => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq("is_active", true)
      .eq("type", "Header")
      .order("sort_order");
    
    if (error) {
      throw error;
    }
    
    if (data) {
      return data;
    }
  } catch (error) {
    console.error('Error fetching menu items:', error);
  }
}

export default fetchMenu;