import { useEffect, useState } from "react";
import { useLanguage } from "../../context/languageContext";
import getLocalizedContent from "../../utils/getLocalizedContent";
import ArticleText from "../../components/articleText/articleText";
import styles from './privacyPolicy.module.css';
import fetchPrivacyPolicy from "../../api/fetchPrivacyPolicyPage";
import { Link } from "react-router-dom";

import miniArrowImg from "../../images/icon_mini_arrow.svg";

interface PrivacyPolicy {
  title_en: string;
  title_es: string | null;
  title_ru: string | null;
  text_en: string;
  text_es: string | null;
  text_ru: string | null;

  [key: string]: string | number | null | undefined;

}

const PrivacyPolicy = () => {

  const [data, setData] = useState<PrivacyPolicy[] | null >(null);
  const { currentLanguage } = useLanguage();

  useEffect (() => {
    const getPrivacyPolicy = async () => {
      const result = await fetchPrivacyPolicy();
      if (result) {
        setData(result);
      }
    }

    getPrivacyPolicy();
  }, []);

  return (
    <main>
      { data && data.length > 0 && 
      <>
        <section className={styles.newsHeader}>
          <Link className={styles.backButton} to="/">
            <img src={miniArrowImg} alt="Back to Main Page" />Back to Main Page
          </Link>
          <h1 className={styles.title}>{getLocalizedContent(data[0], 'title', currentLanguage)}</h1>
        </section>
        <h1 className={styles.titleMobile}>{getLocalizedContent(data[0], 'title', currentLanguage)}</h1>
        <section className={styles.page__container}>
          <ArticleText articleText={getLocalizedContent(data[0], 'text', currentLanguage)} />
        </section>
      </>
      }       
    </main>
  );
};

export default PrivacyPolicy;