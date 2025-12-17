import styles from "../components/campsOffers/sectionOffers.module.css";

export type MediaBullet = {
  header: string;
  html: string;
  imageUrl?: string;
  imageAlt?: string;
};

type MediaBulletsSectionProps = {
  title?: string;
  bullets: MediaBullet[];
  alternateLayout?: boolean;
};

/**
 * Alternating media/text section copied from SectionOffers but driven entirely by props.
 */
const MediaBulletsSection = ({
  title,
  bullets,
  alternateLayout = true,
}: MediaBulletsSectionProps) => {
  if (!bullets || bullets.length === 0) {
    return null;
  }

  return (
    <section className={styles.section__about}>
      {title && <h2 className={styles.section__about_header}>{title}</h2>}

      {bullets.map((item, idx) => {
        const reversed = alternateLayout ? idx % 2 === 1 : false;
        return (
          <div
            key={`${item.header}-${idx}`}
            className={`${styles.section__about_block} ${
              reversed ? styles.reversed : ""
            }`}
          >
            <div className={styles.section__about_textBlock}>
              <h3>{item.header}</h3>
              <div
                className={styles.section__about_text}
                dangerouslySetInnerHTML={{ __html: item.html }}
              />
            </div>

            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.imageAlt || item.header}
                loading="lazy"
              />
            )}
          </div>
        );
      })}
    </section>
  );
};

export default MediaBulletsSection;
