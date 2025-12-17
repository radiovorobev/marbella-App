import styles from "../components/textAndImage/textAndImage.module.css";

type TextImageSplitProps = {
  html: string;
  imageUrl: string;
  imageAlt?: string;
  reverse?: boolean;
};

const TextImageSplit = ({
  html,
  imageUrl,
  imageAlt,
  reverse = false,
}: TextImageSplitProps) => {
  return (
    <section className={styles.section}>
      <div
        className={styles.sectionContainer}
        style={reverse ? { flexDirection: "row-reverse" } : undefined}
      >
        <img
          className={styles.image}
          src={imageUrl}
          alt={imageAlt || "Illustration"}
          loading="lazy"
        />
        <div
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
};

export default TextImageSplit;
