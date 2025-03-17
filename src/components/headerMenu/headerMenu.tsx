import { useState, useEffect } from "react";
import fetchMenu from "../../api/fetchMenu";

import styles from "./headerMenu.module.css";

import { useLanguage } from "../../context/languageContext";

type MenuItem = {
  id: number;
  title_en: string;
  title_es: string | null;
  title_ru: string | null;
  url: string;
  sort_order: number;
  is_active: boolean;
};

const HeaderMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { currentLanguage } = useLanguage();
  
  useEffect(() => {
    const getMenu = async () => {
      const result = await fetchMenu();
      if (result) {
        setMenuItems(result);
      }
    };
    
    getMenu();
  }, []);

    // Функция для получения заголовка на текущем языке
    const getMenuItemTitle = (item: MenuItem) => {
      // Используем индексированный доступ для получения поля `title_${currentLanguage}`
      const titleField = `title_${currentLanguage}` as keyof MenuItem;
      // Возвращаем перевод или английскую версию, если перевод отсутствует
      return (item[titleField] as string) || item.title_en;
    };

  return (
    <nav className={styles.header__menu_container}>
      <ul className={styles.header__menu}>
        {menuItems.map((item) => (
          item.is_active && (
            <li key={item.id}>
              <a href={item.url}>{getMenuItemTitle(item)}</a>
            </li>
          )
        ))}
      </ul>
    </nav>
  );
};

export default HeaderMenu;