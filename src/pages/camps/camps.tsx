import { useEffect, useState } from "react";
import fetchCampsPage from "../../api/fetchCampsPages";
import TextBlock from "../../components/textBlock/textBlock";
import { useLanguage } from "../../context/languageContext";
import getLocalizedContent from "../../utils/getLocalizedContent";
import ArticleText from "../../components/articleText/articleText";
import styles from './camps.module.css';
import SectionImage from "../../components/sectionImage/sectionImage";

interface CampsPage {
  intro_en: string;
  intro_es: string | null;
  intro_ru: string | null;
  text_en: string;
  text_es: string | null;
  text_ru: string | null;

  [key: string]: string | number | null | undefined;

}

const CampsPage = () => {

  const [camps, setCamps] = useState<CampsPage[] | null >(null);
  const { currentLanguage } = useLanguage();

  useEffect (() => {
    const getCampsPage = async () => {
      const result = await fetchCampsPage();
      if (result) {
        setCamps(result);
      }
    }

    getCampsPage();
  }, []);

  return (
    <main>
      { camps && camps.length > 0 && 
      <>
        <SectionImage title={getLocalizedContent(camps[0], 'title', currentLanguage)} />
        <section className={styles.page__container}>
          <TextBlock text={getLocalizedContent(camps[0], 'intro', currentLanguage)} />
          <ArticleText articleText={getLocalizedContent(camps[0], 'text', currentLanguage)} />
        </section>
      </>
      }       
    </main>
  );
};

export default CampsPage;