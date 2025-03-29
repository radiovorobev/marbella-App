import styles from './articleText.module.css';

interface ArticleTextProps {
  articleText: string;
}

const ArticleText: React.FC<ArticleTextProps> = ({ articleText }) => {
  return (
      <div dangerouslySetInnerHTML={{ __html: articleText }} />
  );
}

export default ArticleText;