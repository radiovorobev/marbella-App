import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../../context/languageContext";

import fetchArticle from "../../api/fetchArticle";
import ArticleText from "../../components/articleText/articleText";

import styles from "./article.module.css";

import miniArrowImg from "../../images/icon_mini_arrow.svg";
import getLocalizedContent from "../../utils/getLocalizedContent";

type PostStatus = 'Draft' | 'Published' | 'Archived';

interface Article {
  id: number;
  created_at: string;
  updated_at: string;
  author_id: number;
  title_en: string;
  text_en: string;
  title_es: string | null;
  text_es: string | null;
  title_ru: string | null;
  text_ru: string | null;
  preview_image_url: string | null;
  status: PostStatus;
  publish_date: string | null;
}

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentLanguage } = useLanguage();

  const getArticle = async () => {
    try {
      if (id) {
        const articleData = await fetchArticle(Number(id));
        setArticle(articleData);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getArticle();
  }, [id]);

  const formatPublishDate = (): string => {
    if (!article || !article[0].publish_date) return '';
    
    const date = new Date(article[0].publish_date);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    
    const localeMap: Record<string, string> = {
      'en': 'en-US',
      'es': 'es-ES',
      'ru': 'ru-RU'
    };
    
    return date.toLocaleDateString(localeMap[currentLanguage] || 'en-US', options);
  };

  const getImageUrl = (): string => {
    if (!article || !article[0].preview_image_url) {
      return '/images/default-image.jpg'; // Заглушка, заменить на реальный путь к дефолтному изображению
    }
    return article[0].preview_image_url;
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!article || article.length === 0) return <div className={styles.notFound}>Article not found</div>;

  return (
    <section className={styles.newsPageContainer}>
      <article>
        <section className={styles.newsHeader}>
          <Link className={styles.backButton} to="/news">
            <img src={miniArrowImg} alt="View All News" />View All News
          </Link>
          <h1 className={styles.title}>{getLocalizedContent(article[0], 'title', currentLanguage)}</h1>
          <span className={styles.date}>{formatPublishDate()}</span>
        </section>
        <h1 className={styles.titleMobile}>{getLocalizedContent(article[0], 'title', currentLanguage)}</h1>
        <section>
          <img 
            className={styles.headerImage}
            src={getImageUrl()} 
            alt={getLocalizedContent(article[0], 'title', currentLanguage)}
          />
        </section>
        <ArticleText articleText={getLocalizedContent(article[0], 'text', currentLanguage)} />
        <Link className={styles.forwardButton} to="/news">
          Next Article
          <img className={styles.forwardButtonIcon} src={miniArrowImg} alt="Next Article" />
        </Link>
      </article>
    </section>
  );
}

export default ArticlePage;