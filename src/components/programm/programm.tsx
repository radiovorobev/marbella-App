import styles from './programm.module.css';
import { useLanguage } from '../../context/languageContext';
import getLocalizedContent from '../../utils/getLocalizedContent';

interface Programme {
  id: number;
  created_at: string;
  updated_at: string;
  
  title_en: string;
  title_es: string | null;
  title_ru: string | null;
  
  level_en: string;
  level_es: string | null;
  level_ru: string | null;
  
  age_range_en: string | null;
  age_range_es: string | null;
  age_range_ru: string | null;
  
  description_en: string;
  description_es: string | null;
  description_ru: string | null;
  
  features_en: string[] | null;
  features_es: string[] | null;
  features_ru: string[] | null;
  
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  
  [key: string]: string | number | boolean | string[] | null | undefined;
}

interface ProgrammProps {
  programm: Programme;
}

const Programm = ({ programm }: ProgrammProps) => {
  const { currentLanguage } = useLanguage();
  
  return (
    <div className={styles.section__programms_programm}>
      <div className={styles.section__programms_programm_container}>
        <div className={styles.section__programms_programm_description}>
          <h2 className={styles.section__programms_programm_title}>
            {getLocalizedContent(programm, 'title', currentLanguage)}
          </h2>
          <div className={styles.section__programms_programm_specs}>
            <span className={styles.section__programms_programm_specs_level}>
              {getLocalizedContent(programm, 'level', currentLanguage)}
            </span>
            <span className={styles.section__programms_programm_specs_age}>
              {getLocalizedContent(programm, 'age_range', currentLanguage)}
            </span>
          </div>
          <p className={styles.section__programms_programm_text}  dangerouslySetInnerHTML={{ __html: getLocalizedContent(programm, 'description', currentLanguage) }}>
          </p>
        </div>
        <img 
          src={programm.image_url || './images/programmes/default.png'} 
          alt={getLocalizedContent(programm, 'title', currentLanguage)} 
          className={styles.section__programms_programm_image} 
        />
      </div>
    </div>
  );
}

export default Programm;