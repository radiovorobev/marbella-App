import { useState, useEffect } from "react";
import fetchMenu from "../../api/fetchMenu";

import styles from "./headerMenuMobile.module.css";
import { useLanguage } from "../../context/languageContext";

type MenuItem = {
  id: number;
  title_en: string;
  title_es: string | null;
  title_ru: string | null;
  url: string;
  sort_order: number;
  is_active: boolean;
  parent_id: number | null;
};

const HeaderMenuMobile = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { currentLanguage } = useLanguage();
  const [openParentId, setOpenParentId] = useState<number | null>(null);
  
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

  const topLevelItems = menuItems
    .filter((item) => item.is_active && item.parent_id === null)
    .sort((a, b) => a.sort_order - b.sort_order);

  const childrenByParent: Record<number, MenuItem[]> = {};
  menuItems
    .filter((item) => item.is_active && item.parent_id !== null)
    .forEach((item) => {
      const parentId = item.parent_id as number;
      if (!childrenByParent[parentId]) {
        childrenByParent[parentId] = [];
      }
      childrenByParent[parentId].push(item);
    });

  Object.keys(childrenByParent).forEach((key) => {
    childrenByParent[Number(key)].sort((a, b) => a.sort_order - b.sort_order);
  });

  const toggleParent = (id: number) => {
    setOpenParentId((current) => (current === id ? null : id));
  };

  return (
    <ul className={styles.header__menu_mobile_list}>
      {topLevelItems.map((item) => {
        const children = childrenByParent[item.id] || [];
        const hasChildren = children.length > 0;
        const isOpen = openParentId === item.id;

        if (!hasChildren) {
          return (
            <li key={item.id}>
              <a href={`/${item.url}`}>{getMenuItemTitle(item)}</a>
            </li>
          );
        }

        return (
          <li key={item.id}>
            <button
              type="button"
              className={styles.header__menu_mobile_parent_btn}
              onClick={() => toggleParent(item.id)}
            >
              <span>{getMenuItemTitle(item)}</span>
              <span className={styles.header__menu_mobile_parent_icon}>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <ul className={styles.header__submenu_mobile}>
                {children.map((child) => (
                  <li key={child.id}>
                    <a href={`/${child.url}`}>{getMenuItemTitle(child)}</a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
      <li>
        <a href="https://academymarbella.com/ten-months-program" rel="noreferrer" >
          <div className={`${styles.header__cta_button_mobile_list} ${styles.header__cta_button_mobile_list_container}`}>
            10 Months Program
            </div>
            </a>
            
        <a href="https://wa.me/message/474IL7PF6E25O1" target="_blank" rel="noreferrer">
          <div className={`${styles.header__cta_button_mobile_list} ${styles.header__cta_button_mobile_list_container}`}>
          Join Us</div>
        </a>
      </li>
    </ul>
  );
};

export default HeaderMenuMobile;
