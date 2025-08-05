import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export interface MenuItem {
  id: number;
  title_en: string;
  url: string;
  is_active: boolean;
  sort_order: number;
  default_language: string;
  type: string;
}

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('sort_order');

      if (!error && data) {
        setMenuItems(data);
      }

      setLoading(false);
    };

    fetchMenu();
  }, []);

  return { menuItems, loading };
}
