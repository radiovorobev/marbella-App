import styles from "../components/textBlock/textBlock.module.css";

type FramedTextSectionProps = {
  html: string;
};

/**
 * Copy of the decorative TextBlock component that simply renders framed HTML content.
 */
const FramedTextSection = ({ html }: FramedTextSectionProps) => {
  return (
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
};

export default FramedTextSection;
