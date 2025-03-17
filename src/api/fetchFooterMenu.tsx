import { supabase } from '../utils/supabaseClient';

const fetchFooterMenu = async () => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq("is_active", true)
      .eq("type", "Footer")
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

export default fetchFooterMenu;