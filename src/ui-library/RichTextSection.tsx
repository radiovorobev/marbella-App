import styles from "../components/articleText/articleText.module.css";

type RichTextSectionProps = {
  html: string;
  backgroundColor?: string;
};

/**
 * Rich text block identical to ArticleText but accepts background color via props.
 */
const RichTextSection = ({ html, backgroundColor }: RichTextSectionProps) => {
  return (
    <div
      className={styles.articleText}
      style={backgroundColor ? { backgroundColor } : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichTextSection;
