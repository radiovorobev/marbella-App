import styles from './footer.module.css';
import logoImg from '../../images/logo.svg';
import youTubeImg from '../../images/icon_youtube.svg';
import tikTokImg from '../../images/icon_tik-tok.svg';
import instagramImg from '../../images/icon_insta.svg';
import facebookImg from '../../images/icon_fb.svg';
import FooterMenu from '../footerMenu/footerMenu';
import { useLanguage } from '../../context/languageContext';

const Footer = () => {

  const { currentLanguage } = useLanguage();

  function getLang(lang: string) {
    switch(lang) {
      case 'en':
        return "Primary Office";
      case 'es':
        return "Oficina principal";
      case 'ru':
        return "Главный офис";
      default:
        return "Primary Office";
    }
  }

  return (
    <footer className={styles.footer}>
    <div className={styles.footer__container}>
      <div className={styles.footer__logo_container}>
          <img src={logoImg} alt="Marbella International Football Academy" className={styles.footer__logo} />
          <h1 className={styles.footer__logo_text}>Marbella International<br />Football Academy</h1>
      </div>
      <div className={styles.footer__contacts}>
        <a className={styles.footer__phone} href="https://wa.me/message/474IL7PF6E25O1" target="_blank">+34 663 13 12 78</a>
        <a className={styles.footer__mail} href="mailto:info@academymarbella.com">info@academymarbella.com</a>
      </div>
      <FooterMenu />
      <div className={styles.footer__social}>
        <a href="https://www.youtube.com/@academymarbella" target="_blank">
          <img src={youTubeImg} alt="YouTube" className={styles.footer__social_icon} />
        </a>
        <a href="https://www.tiktok.com/@academymarbella" target="_blank">
          <img src={tikTokImg} alt="TikTok" className={styles.footer__social_icon} />
        </a>
        <a href="https://www.instagram.com/academymarbella" target="_blank">
          <img src={instagramImg} alt="Instagram" className={styles.footer__social_icon} />
        </a>
        <a href="https://www.facebook.com/academymarbella" target="_blank">
          <img src={facebookImg} alt="Facebook" className={styles.footer__social_icon} />
        </a>
      </div>
      <div className={styles.footer__copyright_container}>
        <p className={styles.footer__copyright}>&copy; Marbella International Football Academy. 2025.</p>
      </div>
      <div className={styles.footer__address_container}>
        <p className={styles.footer__address}>{getLang(currentLanguage)}:</p>
        <p className={styles.footer__address}>La Dama de Noche, Nueva Andalucía, 29660 Marbella, Málaga</p>
      </div>
    </div>
    </footer>
  );
}

export default Footer;

/* Oficina principal */