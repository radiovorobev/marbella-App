import { supabase } from '../utils/supabaseClient';

const fetchMenu = async () => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('id, title_en, title_es, title_ru, url, sort_order, is_active, type, component_key')
      .in('type', ['HeaderMain', 'HeaderServices'])   // ← берём оба типа
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

export default fetchMenu;
