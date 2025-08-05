import styles from './leadText.module.css';

interface leadTextProps {
  text: string;
}

const leadText: React.FC<leadTextProps> = ({ text }) => {
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

export default leadText;
