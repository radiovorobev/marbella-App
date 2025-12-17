import styles from "../components/new/textBlock/textBlock.module.css";

type SimpleTextBlockProps = {
  html: string;
};

const SimpleTextBlock = ({ html }: SimpleTextBlockProps) => (
  <div
    className={styles.textBlock}
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

export default SimpleTextBlock;
