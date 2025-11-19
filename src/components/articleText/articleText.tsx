import styles from './articleText.module.css';

interface ArticleTextProps {
  articleText: string;
  backgroundColor?: string;
}

const ArticleText: React.FC<ArticleTextProps> = ({
  articleText,
  backgroundColor,
}) => {
  return (
    <div
      className={styles.articleText}
      style={backgroundColor ? { backgroundColor } : undefined}
      dangerouslySetInnerHTML={{ __html: articleText }}
    />
  );
};

export default ArticleText;
