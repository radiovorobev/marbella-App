import styles from './textBlock.module.css';

interface textBlockProps {
  text: string;
}

const textBlock: React.FC<textBlockProps> = ({ text }) => {
  return (
      <div className={styles.textBlock} dangerouslySetInnerHTML={{ __html: text }} />
  );
}

export default textBlock;
