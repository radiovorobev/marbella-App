import styles from "../components/indexNews/indexNews.module.css";
import arrowWhiteIcon from "../images/icon_arrow_white.svg";

export type NewsItem = {
  id: number | string;
  title: string;
  text: string;
  imageUrl?: string | null;
  publishDate?: string | null;
  href?: string;
};

type NewsListSectionProps = {
  title?: string;
  news: NewsItem[];
  ctaLabel?: string;
  ctaHref?: string;
};

const NewsListSection = ({
  title = "Latest News",
  news,
  ctaLabel = "More news",
  ctaHref = "/news",
}: NewsListSectionProps) => {
  if (!news || news.length === 0) {
    return null;
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const sanitizeText = (text: string) =>
    text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

  return (
    <section className={styles.section__news}>
      <div className={styles.section__header}>
        <h2>{title}</h2>
      </div>
      <div className={styles.section__news_container}>
        {news.map((item) => (
          <a key={item.id} href={item.href || "#"}>
            <article className={styles.section__news_article}>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className={styles.section__news_image}
                  loading="lazy"
                />
              )}
              <div className={styles.section__news_text_block}>
                <h3 className={styles.section__news_news_header}>
                  {item.title}
                </h3>
                <div className={styles.section__news_lead}>
                  <p className={styles.section__news_news_text}>
                    {sanitizeText(item.text).substring(0, 200)}
                    {sanitizeText(item.text).length > 200 ? "..." : ""}
                  </p>
                  <p className={styles.section__news_news_date}>
                    {formatDate(item.publishDate)}
                  </p>
                </div>
              </div>
            </article>
          </a>
        ))}
      </div>
      {ctaHref && (
        <a href={ctaHref} className={styles.section__news_button}>
          <span>{ctaLabel}</span>
          <img src={arrowWhiteIcon} alt="Arrow" />
        </a>
      )}
    </section>
  );
};

export default NewsListSection;
