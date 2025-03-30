import { useEffect, useState } from "react";
import { useLanguage } from "../../context/languageContext";
import getLocalizedContent from "../../utils/getLocalizedContent";
import ArticleText from "../../components/articleText/articleText";
import styles from './cookies.module.css';
import fetchCookiesPage from "../../api/fetchСookiesPages";
import { Link } from "react-router-dom";

import miniArrowImg from "../../images/icon_mini_arrow.svg";

interface CookiesPage {
  title_en: string;
  title_es: string | null;
  title_ru: string | null;
  text_en: string;
  text_es: string | null;
  text_ru: string | null;

  [key: string]: string | number | null | undefined;

}

const CookiesPage = () => {

  const [cookies, setCookies] = useState<CookiesPage[] | null >(null);
  const { currentLanguage } = useLanguage();

  useEffect (() => {
    const getCookiesPage = async () => {
      const result = await fetchCookiesPage();
      if (result) {
        setCookies(result);
      }
    }

    getCookiesPage();
  }, []);

  return (
    <main>
      { cookies && cookies.length > 0 && 
      <>
        <section className={styles.newsHeader}>
          <Link className={styles.backButton} to="/">
            <img src={miniArrowImg} alt="Back to Main Page" />Back to Main Page
          </Link>
          <h1 className={styles.title}>{getLocalizedContent(cookies[0], 'title', currentLanguage)}</h1>
        </section>
        <h1 className={styles.titleMobile}>{getLocalizedContent(cookies[0], 'title', currentLanguage)}</h1>
        <section className={styles.page__container}>
          <ArticleText articleText={getLocalizedContent(cookies[0], 'text', currentLanguage)} />
        </section>
      </>
      }       
    </main>
  );
};

export default CookiesPage;