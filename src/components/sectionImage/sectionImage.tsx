import styles from "./sectionImage.module.css";

import firstScreenVideo from '../../video/background.mp4';
import backgroundPoster from '../../images/backgroundPoster.jpg';
import { useLanguage } from "../../context/languageContext";

const SectionImage = () => {

  const {currentLanguage} = useLanguage();

  function getLang(lang: string) {
    switch(lang) {
      case 'en':
        return "Passion Growth Excellence";
      case 'es':
        return "Pasión Crecimiento Excelencia";
      case 'ru':
        return "Страсть Рост Превосходство";
      default:
        return "Passion Growth Excellence";
    }
  }

  return (
    <section className={styles.section__image}>
      <video autoPlay muted loop playsInline poster={backgroundPoster} className={styles.backgroundVideo}>
        <source src={firstScreenVideo} type="video/mp4" />
      </video>
      <h2 className={styles.section__image_text}>{getLang(currentLanguage)}</h2>
    </section>
  );
};

export default SectionImage;