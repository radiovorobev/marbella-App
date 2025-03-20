import styles from './textBlock.module.css';

interface TextBlockProps {
  text: string;
}

const TextBlock: React.FC<TextBlockProps> = ({ text }) => {
  return (
    <section className={styles.section__text}>
      <div className={styles.section__text_container}>
        <div className={styles.section__text_image_background}></div>
        <div className={styles.text_container} dangerouslySetInnerHTML={{ __html: text }} />
        <div className={styles.section__text_image_background}></div>
      </div>
    </section>
  );
}

export default TextBlock;

