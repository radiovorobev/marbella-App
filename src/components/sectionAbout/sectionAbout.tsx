import styles from './sectionAbout.module.css';

import aboutImg_1 from '../../images/index/Elite_Training_and_Development.jpg';
import aboutImg_2 from '../../images/index/Train_on_Natural_Grass_Pitches.jpg';
import aboutImg_3 from '../../images/index/Global_Community.jpg';

import { useEffect, useState } from 'react';
import fetchIndexAbout from '../../api/fetchIndexAbout';
import { useLanguage } from '../../context/languageContext';

type IndexAboutData = {
  about_header_en: string;
  about_header_es: string | null;
  about_header_ru: string | null;
  bullit_one_header_en: string;
  bullit_one_header_es: string | null;
  bullit_one_header_ru: string | null;
  bullit_two_header_en: string;
  bullit_two_header_es: string | null;
  bullit_two_header_ru: string | null;
  bullit_three_header_en: string;
  bullit_three_header_es: string | null;
  bullit_three_header_ru: string | null;
  bullit_one_text_en: string;
  bullit_one_text_es: string | null;
  bullit_one_text_ru: string | null;
  bullit_two_text_en: string;
  bullit_two_text_es: string | null;
  bullit_two_text_ru: string | null;
  bullit_three_text_en: string;
  bullit_three_text_es: string | null;
  bullit_three_text_ru: string | null;
  [key: string]: string | null;
};

const SectionAbout = () => {
  const [indexAbout, setIndexAbout] = useState<IndexAboutData | null>(null);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const getAboutData = async () => {
      const result = await fetchIndexAbout();
      console.log("fetchIndexAbout result:", result);
      if (result && result.length > 0) {
        setIndexAbout(result[0]); // Берем первый элемент массива данных
      }
    };
    
    getAboutData();
  }, []);
  
  // Если данные еще не загружены, показываем загрузку
  if (!indexAbout) {
    return <div>Loading...</div>;
  }

  // Функция для получения текста на нужном языке
  const getText = (fieldBase: string): string => {
    const fieldName = `${fieldBase}_${currentLanguage}`;
    return indexAbout[fieldName] || indexAbout[`${fieldBase}_en`] || '';
  };

  return (
    <section className={styles.section__about}>
      <h2 className={styles.section__about_header}>
        {getText('about_header')}
      </h2>
      <div className={styles.section__about_block}>
        <div className={styles.section__about_textBlock}>
          <p className={styles.section__about_number}>01</p>
          <h3>{getText('bullit_one_header')}</h3>
          <p className={styles.section__about_text}>
            {getText('bullit_one_text')}
          </p>
        </div>
        <img src={aboutImg_1} alt={getText('bullit_one_header')} />
      </div>
      <div className={styles.section__about_block}>
        <img src={aboutImg_2} alt={getText('bullit_two_header')} />
        <div className={styles.section__about_textBlock}>
          <p className={styles.section__about_number}>02</p>
          <h3>{getText('bullit_two_header')}</h3>
          <p className={styles.section__about_text}>
            {getText('bullit_two_text')}
          </p>
        </div>
      </div>
      <div className={styles.section__about_block}>
        <div className={styles.section__about_textBlock}>
          <p className={styles.section__about_number}>03</p>
          <h3>{getText('bullit_three_header')}</h3>
          <p className={styles.section__about_text}>
            {getText('bullit_three_text')}
          </p>
        </div>
        <img src={aboutImg_3} alt={getText('bullit_three_header')} />
      </div>
    </section>
  );
};

export default SectionAbout;