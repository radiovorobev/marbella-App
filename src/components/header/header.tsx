import styles from './Header.module.css';
import logoImg from '../../images/logo.svg';
import HeaderMenu from '../headerMenu/headerMenu';
import LangButton from '../langButton/langButton';
import { useEffect, useState } from 'react';
import HeaderMenuMobile from '../headerMenuMobile/headerMenuMobile';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Обработчик скролла
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Обработчик клика по меню
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={`${styles.header__container} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.header__top_row}>
          <div className={`${styles.header__menu_button} ${menuOpen ? styles.open : ''}`} onClick={toggleMenu}>
            <div className={styles.header__menu_line}></div>
            <div className={styles.header__menu_line}></div>
            <div className={styles.header__menu_line}></div>
          </div>
          <nav className={`${styles.header__menu_mobile} ${menuOpen ? styles.open : ''}`}>
            <HeaderMenuMobile />
          </nav>
          <a href="https://academymarbella.com" className={styles.header__logo_container}>
            <img src={logoImg} alt="Marbella International Football Academy" className={styles.header__logo}/>
            <h1 className={styles.header__logo_text}>Marbella International Football Academy</h1>
          </a>
          <HeaderMenu />
           <a href="https://academymarbella.com/ten-months-programm" className={`${styles.header__cta_button} ${styles.header__cta_button_visible}`}>
            10 Months Programm
          </a>
          <a href="https://wa.me/message/474IL7PF6E25O1" className={styles.header__cta_button} target="_blank">
            Join Us
          </a>
          <LangButton />
        </div>
      </div>
    </header>
  );
}

export default Header;
