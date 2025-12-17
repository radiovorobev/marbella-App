import styles from "../components/sectionAbout/sectionAbout.module.css";

export type HighlightItem = {
  header: string;
  html: string;
  imageUrl: string;
  imageAlt?: string;
};

type AboutHighlightsProps = {
  title: string;
  items: HighlightItem[];
};

const AboutHighlights = ({ title, items }: AboutHighlightsProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className={styles.section__about}>
      <h2 className={styles.section__about_header}>{title}</h2>
      {items.map((item, index) => (
        <div
          key={item.header}
          className={styles.section__about_block}
          style={index % 2 === 1 ? { flexDirection: "row-reverse" } : undefined}
        >
          <div className={styles.section__about_textBlock}>
            <h3>{item.header}</h3>
            <div
              className={styles.section__about_text}
              dangerouslySetInnerHTML={{ __html: item.html }}
            />
          </div>
          <img
            src={item.imageUrl}
            alt={item.imageAlt || item.header}
            loading="lazy"
          />
        </div>
      ))}
    </section>
  );
};

export default AboutHighlights;
