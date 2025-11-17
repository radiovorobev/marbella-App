// src/components/headerMenu/headerMenu.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fetchMenu from "../../api/fetchMenu";

import styles from "./headerMenu.module.css";
import { useLanguage } from "../../context/languageContext";

export type MenuType = "HeaderMain" | "HeaderServices" | "Footer";

export type MenuItem = {
  id: number;
  title_en: string;
  title_es: string | null;
  title_ru: string | null;
  url: string;
  sort_order: number;
  is_active: boolean;
  type: MenuType;         // 👈 НОВОЕ поле
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

  const getMenuItemTitle = (item: MenuItem) => {
    const titleField = `title_${currentLanguage}` as keyof MenuItem;
    return (item[titleField] as string) || item.title_en;
  };

  const mainItems = menuItems
    .filter((item) => item.is_active && item.type === "HeaderMain")
    .sort((a, b) => a.sort_order - b.sort_order);

  const serviceItems = menuItems
    .filter((item) => item.is_active && item.type === "HeaderServices")
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <nav className={styles.header__menu_container}>
      {/* Первая строка – HeaderMain */}
      <ul className={`${styles.header__menu} ${styles.header__menu_primary}`}>
        {mainItems.map((item) => (
          <li key={item.id}>
            <Link to={`/${item.url}`}>{getMenuItemTitle(item)}</Link>
          </li>
        ))}
      </ul>

      {/* Вторая строка – HeaderServices */}
      {serviceItems.length > 0 && (
        <ul
          className={`${styles.header__menu} ${styles.header__menu_secondary}`}
        >
          {serviceItems.map((item) => (
            <li key={item.id}>
              <Link to={`/${item.url}`}>{getMenuItemTitle(item)}</Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default HeaderMenu;
