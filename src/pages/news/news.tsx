import { useState, useEffect } from 'react';
import fetchAllNews from '../../api/fetchAllNews';
import styles from './news.module.css';
import getLocalizedContent from '../../utils/getLocalizedContent';
import { useLanguage } from '../../context/languageContext';

import iconArrow from '../../images/icon_arrow_white.svg';
import SectionImage from '../../components/sectionImage/sectionImage';
import fetchNewsPage from '../../api/fetchNewsPage';

interface NewsItem {
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
  status: string;
  publish_date: string | null;
}

interface NewsPageData {
  id: number;
  created_at: string;
  title_en: string;
  title_es: string;
  title_ru: string;
  [key: string]: string | number | null | undefined;
}

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsPageData, setNewsPageData] = useState<NewsPageData[] | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { currentLanguage } = useLanguage();
  
  const loadNews = async (currentPage: number) => {
    setLoading(true);
    try {
      const { data, hasMore } = await fetchAllNews(currentPage);
      
      if (currentPage === 0) {
        setNews(data);
      } else {
        setNews(prevNews => [...prevNews, ...data]);
      }
      
      setHasMore(hasMore);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNewsPage = async () => {
    const result = await fetchNewsPage();
    if (result) {
      setNewsPageData(result);
    }
  }
  
  useEffect(() => {
    loadNews(0);
    getNewsPage();
  }, []);
  
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadNews(nextPage);
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
  
  return (
    <>
      {newsPageData && newsPageData.length > 0 ? (
        <SectionImage title={getLocalizedContent(newsPageData[0], 'title', currentLanguage)} />
      ) : (
        <div className={styles.loading}>Loading...</div>
      )}
      <section className={styles.section__news}>
        <div className={styles.section__news_container}>
          {news.map(item => (
              <a key={item.id} href={`./news/${item.id}`}>
              <article className={styles.section__news_article}>
                <img 
                  src={item.preview_image_url || './images/news/default-news.jpg'} 
                  alt={getLocalizedContent(item, 'title', currentLanguage)} 
                  className={styles.section__news_image} 
                />
                <div className={styles.section__news_text_block}>
                  <h3 className={styles.section__news_news_header}>
                    {getLocalizedContent(item, 'title', currentLanguage)}
                  </h3>
                  <div className={styles.section__news_lead}>
                    <p className={styles.section__news_news_text}>
                      {getLocalizedContent(item, 'text', currentLanguage).replace(/<[^>]*>/g, '').substring(0, 200)}
                      {getLocalizedContent(item, 'text', currentLanguage).replace(/<[^>]*>/g, '').length > 200 ? '...' : ''}
                    </p>
                    <p className={styles.section__news_news_date}>
                      {formatDate(item.publish_date || item.created_at)}
                    </p>
                  </div>
                </div>
              </article>
            </a>
          ))}
        </div>
        { hasMore && (
        <button className={styles.section__news_button} onClick={handleLoadMore} disabled={loading}>
          <span>{loading ? 'Loading...' : 'More news'}</span>
          <img src={iconArrow} className="styles.section__news_button_icon" />
        </button>
        )}
      </section>
    </>
  );
};

export default NewsPage;