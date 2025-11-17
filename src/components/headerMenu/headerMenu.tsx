import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fetchMenu from "../../api/fetchMenu";

import styles from "./headerMenu.module.css";
import { useLanguage } from "../../context/languageContext";

export type MenuItem = {
  id: number;
  title_en: string;
  title_es: string | null;
  title_ru: string | null;
  url: string;
  sort_order: number;
  is_active: boolean;
  parent_id: number | null;
  // если в БД есть поле type (Header/Footer) – можно добавить:
  // type?: string;
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

  // верхний уровень – без parent_id
  const topLevelItems = menuItems
    .filter((item) => item.is_active && item.parent_id === null)
    .sort((a, b) => a.sort_order - b.sort_order);

  // сгруппированные дети по parent_id
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
    const id = Number(key);
    childrenByParent[id].sort((a, b) => a.sort_order - b.sort_order);
  });

  return (
    <nav className={styles.header__menu_container}>
      <ul className={styles.header__menu}>
        {topLevelItems.map((item) => {
          const children = childrenByParent[item.id] || [];
          const hasChildren = children.length > 0;

          return (
            <li
              key={item.id}
              className={hasChildren ? styles.header__menu_item_with_sub : undefined}
            >
              {/* 
                Если у пункта есть дети – это "служебная" кнопка с дропдауном 
                (стрелочка вниз), сам по себе он не ведёт на URL
              */}
              {hasChildren ? (
                <button
                  type="button"
                  className={styles.header__menu_parent_btn}
                >
                  {getMenuItemTitle(item)}
                </button>
              ) : (
                <Link to={`/${item.url}`}>{getMenuItemTitle(item)}</Link>
              )}

              {hasChildren && (
                <ul className={styles.header__submenu}>
                  {children.map((child) => (
                    <li key={child.id}>
                      <Link to={`/${child.url}`}>
                        {getMenuItemTitle(child)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default HeaderMenu;
