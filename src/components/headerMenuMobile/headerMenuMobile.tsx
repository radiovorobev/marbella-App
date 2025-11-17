// src/components/headerMenuMobile/headerMenuMobile.tsx

import { useState, useEffect } from "react";
import fetchMenu from "../../api/fetchMenu";

import styles from "./headerMenuMobile.module.css";
import { useLanguage } from "../../context/languageContext";

type MenuType = "HeaderMain" | "HeaderServices" | "Footer";

type MenuItem = {
  id: number;
  title_en: string;
  title_es: string | null;
  title_ru: string | null;
  url: string;
  sort_order: number;
  is_active: boolean;
  type: MenuType;
};

const HeaderMenuMobile = () => {
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

  // Мобильное: всё одним столбцом по sort_order
  // Если хочешь исключить Footer — просто поменяй фильтр.
  const visibleItems = menuItems
    .filter((item) => item.is_active && item.type !== "Footer")
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <ul className={styles.header__menu_mobile_list}>
      {visibleItems.map((item) => (
        <li key={item.id}>
          <a href={`/${item.url}`}>{getMenuItemTitle(item)}</a>
        </li>
      ))}
      <li>
        <a
          href="https://wa.me/message/474IL7PF6E25O1"
          target="_blank"
          rel="noreferrer"
        >
          <div className={styles.header__cta_button_mobile_list}>Join Us</div>
        </a>
      </li>
    </ul>
  );
};

export default HeaderMenuMobile;
