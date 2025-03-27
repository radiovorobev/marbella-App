import { useEffect, useState } from "react";
import fetchProgrammesPage from "../../api/fetchProgrammesPage";
import { useLanguage } from "../../context/languageContext";
import TextBlock from "../../components/textBlock/textBlock";
import getLocalizedContent from "../../utils/getLocalizedContent";

import styles from './programmes.module.css';
import fetchProgrammes from "../../api/fetchProgrammes";
import SectionImage from "../../components/sectionImage/sectionImage";
import Subscriptions from "../../components/subscriptions/subscriptions";

interface ProgrammesPage {
  id: number;
  created_at: string;
  text_en: string;
  text_es: string;
  text_ru: string;
  title_en: string;
  title_es: string;
  title_ru: string;
  subs_title_en: string;
  subs_title_es: string;
  subs_title_ru: string;
  subs_text_en: string;
  subs_text_es: string;
  subs_text_ru: string;

  [key: string]: string | number | null | undefined;
}

interface Programme {
  id: number;
  created_at: string;
  updated_at: string;
  
  // Title fields
  title_en: string;
  title_es: string | null;
  title_ru: string | null;
  
  // Level fields
  level_en: string;
  level_es: string | null;
  level_ru: string | null;
  
  // Age range fields
  age_range_en: string | null;
  age_range_es: string | null;
  age_range_ru: string | null;
  
  // Description fields
  description_en: string;
  description_es: string | null;
  description_ru: string | null;
  
  // Features arrays
  features_en: string[] | null;
  features_es: string[] | null;
  features_ru: string[] | null;
  
  // Other properties
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  
  // Add index signature for getLocalizedContent compatibility
  [key: string]: string | number | boolean | string[] | null | undefined;
 }

const ProgrammesPage = () => {

  const [programmesPageData, setProgrammesPageData] = useState<ProgrammesPage[] | null>(null);
  const [programmesData, setProgrammesData] = useState<Programme[] | null>(null);

  const { currentLanguage } = useLanguage();

  useEffect (() => {
    const getProgrammesPage = async () => {
      const result = await fetchProgrammesPage();
      if (result) {
        setProgrammesPageData(result);
      }
    }
    const getProgrammes = async () => {
      const result = await fetchProgrammes();
      if (result) {
        setProgrammesData(result);
      }
    }

    getProgrammesPage();
    getProgrammes();

  }, []);

  return (
    <main>
      {programmesPageData && programmesPageData.length > 0 ? (
        <>
         <SectionImage title={getLocalizedContent(programmesPageData[0], 'title', currentLanguage)} />
          <TextBlock text={getLocalizedContent(programmesPageData[0], 'text', currentLanguage)} />
          {/*
          <section className={styles.section__programms}>
            { programmesData && programmesData.length > 0 ? (
              programmesData.map(programm => (
                <Programm key={programm.id} programm={programm} />
              ))
            ) : (
               <></>
          )}
          </section> 
          */}
          <Subscriptions title={getLocalizedContent(programmesPageData[0], 'subs_title', currentLanguage)} text={getLocalizedContent(programmesPageData[0], 'subs_text', currentLanguage)} /> 
        </>
        ) : (
        <></>
        )
      } 
    </main>
  )
}

export default ProgrammesPage;