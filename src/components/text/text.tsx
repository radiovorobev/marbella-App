import styles from './text.module.css';

interface ArticleTextProps {
  articleText: string;
}

const ArticleText: React.FC<ArticleTextProps> = ({ articleText }) => {
  return (
    <section className={styles.news__text}>
      <div dangerouslySetInnerHTML={{ __html: articleText }} />
    </section>
  );
}

export default ArticleText;