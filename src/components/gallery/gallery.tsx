import styles from './gallery.module.css';

import Gallery_1 from '../../images/gallery/gallery-1.jpg';
import Gallery_2 from '../../images/gallery/gallery-2.jpg';
import Gallery_3 from '../../images/gallery/gallery-3.jpg';
import Gallery_4 from '../../images/gallery/gallery-4.jpg';
import Gallery_5 from '../../images/gallery/gallery-5.jpg';
import Gallery_6 from '../../images/gallery/gallery-6.jpg';
import Gallery_7 from '../../images/gallery/gallery-7.jpg';
import Gallery_8 from '../../images/gallery/gallery-8.jpg';

import instagramIcon from '../../images/icon_insta.svg';
import { useLanguage } from '../../context/languageContext';

const Gallery = () => {

  const { currentLanguage } = useLanguage();

  function getLang(lang: string) {
    switch(lang) {
      case 'en':
        return "Play with us";
      case 'es':
        return "Juega con nosotros";
      case 'ru':
        return "Играй вместе с нами";
      default:
        return "Play with us";
    }
  }

  return (
    <section className={styles.section__instagram}>
      <div className={styles.section__instagram_container}>
        <div className={styles.section__header}>
          <h2>{getLang(currentLanguage)}:</h2>
          <a href="https://www.instagram.com/academymarbella" target="_blank">
            <img src={instagramIcon} alt="Instagram" className={styles.section__header_social_icon} />
          </a>
        </div>
        
        <div className={styles.section__instagram_container}>
          <ul className={styles.section__instagram_block}>
            <img className={styles.section__instagram_image} src={Gallery_1} alt="Play with us" />
            <img className={styles.section__instagram_image} src={Gallery_2} alt="Play with us" />
            <img className={styles.section__instagram_image} src={Gallery_3} alt="Play with us" />
            <img className={styles.section__instagram_image} src={Gallery_4} alt="Play with us" />
            <img className={styles.section__instagram_image} src={Gallery_5} alt="Play with us" />
            <img className={styles.section__instagram_image} src={Gallery_6} alt="Play with us" />
            <img className={styles.section__instagram_image} src={Gallery_7} alt="Play with us" />
            <img className={styles.section__instagram_image} src={Gallery_8} alt="Play with us" />
          </ul>
        </div>
        <div className={`${styles.section__instagram_more_button} ${styles.left} ${styles.hidden}`}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M43 28H10" stroke="currentColor" strokeWidth="2"/>
            <path d="M26 15L10 28L26 41" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>        
        <div className={styles.section__instagram_more_button}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 28H43" stroke="currentColor" strokeWidth="2"/>
            <path d="M30 15L43 28L30 41" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
      </div>
    </section>
  )
}

export default Gallery;