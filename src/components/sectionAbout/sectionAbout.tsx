import styles from './sectionAbout.module.css';

import aboutImg_1 from '../../images/index/Elite_Training_and_Development.jpg';
import aboutImg_2 from '../../images/index/Train_on_Natural_Grass_Pitches.jpg';
import aboutImg_3 from '../../images/index/Global_Community.jpg';

interface Bullet {
  header: string;
  text: string;
}

interface AboutSectionProps {
  aboutData: {
    header: string;
    bullets: Bullet[];
  } | null;
}

const SectionAbout: React.FC<AboutSectionProps> = ({ aboutData }) => {
  // Если данные еще не загружены, показываем загрузку
  if (!aboutData) {
    return <div>Loading...</div>;
  }

  return (
    <section className={styles.section__about}>
      <h2 className={styles.section__about_header}>
        {aboutData.header}
      </h2>
      
      {/* Первый блок */}
      <div className={styles.section__about_block}>
        <div className={styles.section__about_textBlock}>
          {/* <p className={styles.section__about_number}>01</p> */}
          <h3>{aboutData.bullets[0].header}</h3>
          {/* Заменяем вложенность p > div на просто div */}
          <div className={styles.section__about_text} dangerouslySetInnerHTML={{ __html: aboutData.bullets[0].text }} />
        </div>
        <img src={aboutImg_1} alt={aboutData.bullets[0].header} />
      </div>
      
      {/* Второй блок */}
      <div className={styles.section__about_block}>
        <img src={aboutImg_2} alt={aboutData.bullets[1].header} />
        <div className={styles.section__about_textBlock}>
          {/* <p className={styles.section__about_number}>02</p> */}
          <h3>{aboutData.bullets[1].header}</h3>
          <div className={styles.section__about_text} dangerouslySetInnerHTML={{ __html: aboutData.bullets[1].text }} />
        </div>
      </div>
      
      {/* Третий блок */}
      <div className={styles.section__about_block}>
        <div className={styles.section__about_textBlock}>
          {/* <p className={styles.section__about_number}>03</p> */}
          <h3>{aboutData.bullets[2].header}</h3>
          <div className={styles.section__about_text} dangerouslySetInnerHTML={{ __html: aboutData.bullets[2].text }} />
        </div>
        <img src={aboutImg_3} alt={aboutData.bullets[2].header} />
      </div>
    </section>
  );
};

export default SectionAbout;