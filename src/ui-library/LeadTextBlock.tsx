import styles from "../components/new/leadText/leadText.module.css";

type LeadTextBlockProps = {
  html: string;
};

const LeadTextBlock = ({ html }: LeadTextBlockProps) => (
  <section className={styles.section__text}>
    <div className={styles.section__text_container}>
      <div className={styles.section__text_image_background}></div>
      <div
        className={styles.text_container}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className={styles.section__text_image_background}></div>
    </div>
  </section>
);

export default LeadTextBlock;
