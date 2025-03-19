import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/languageContext';
import fetchNews from '../../api/fetchNews';
import styles from './indexNews.module.css';

import arrowWhiteIcon from '../../images/icon_arrow_white.svg';

type News = {
  id: number;
  created_at: string;
  title_en: string;
  title_es: string | null;
  title_ru: string | null;
  text_en: string;
  text_es: string | null;
  text_ru: string | null;
  preview_image_url: string | null;
  publish_date: string | null;
};

const IndexNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const getNews = async () => {
      try {
        const newsData = await fetchNews();
        setNews(newsData);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    getNews();
  }, []);

  const getLocalizedContent = (item: News, field: 'title' | 'text') => {
    const langField = `${field}_${currentLanguage}` as keyof News;
    return (item[langField] as string) || item[`${field}_en`] as string;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    
    return date.toLocaleDateString('en-US', options);
  };

  if (loading) {
    return <div>Loading news...</div>;
  }

  return (
    <section className={styles.section__news}>
      <div className={styles.section__header}>
        <h2>Latest News</h2>
      </div>
      <div className={styles.section__news_container}>
        {news.length > 0 ? (
          news.map((item) => (
            <a key={item.id} href={`./news/${item.id}`}>
              <article className={styles.section__news_article}>
                <img 
                  src={item.preview_image_url || './images/news/default-news.jpg'} 
                  alt={getLocalizedContent(item, 'title')} 
                  className={styles.section__news_image} 
                />
                <div className={styles.section__news_text_block}>
                  <h3 className={styles.section__news_news_header}>
                    {getLocalizedContent(item, 'title')}
                  </h3>
                  <div className={styles.section__news_lead}>
                    <p className={styles.section__news_news_text}>
                      {getLocalizedContent(item, 'text').substring(0, 150)}
                      {getLocalizedContent(item, 'text').length > 150 ? '...' : ''}
                    </p>
                    <p className={styles.section__news_news_date}>
                      {formatDate(item.publish_date || item.created_at)}
                    </p>
                  </div>
                </div>
              </article>
            </a>
          ))
        ) : (
          <p>No news available at the moment.</p>
        )}
      </div>
      <a href="./news.html" className={styles.section__news_button}>
        <span>More news</span>
        <img src={arrowWhiteIcon} alt="Arrow" />
      </a>
    </section>
  );
};

export default IndexNews;