import React from "react";
import styles from "./sectionOffers.module.css";

interface Bullet {
  header: string;
  text: string; // HTML
  imageUrl?: string; // ссылка на картинку
  alt?: string;
}

interface AboutSectionProps {
  aboutData: {
    header: string;
    bullets: Bullet[];
  } | null;
}

const SectionAbout: React.FC<AboutSectionProps> = ({ aboutData }) => {
  if (!aboutData) return <div>Loading...</div>;
  const { header, bullets } = aboutData;

  if (!bullets || bullets.length === 0) return null;

  return (
    <section className={styles.section__about}>
      <h2 className={styles.section__about_header}>{header}</h2>

      {bullets.map((item, idx) => {
        const reversed = idx % 2 === 1; // чётные индексы (1,3,5...) — картинка слева
        return (
          <div
            key={`${item.header}-${idx}`}
            className={`${styles.section__about_block} ${reversed ? styles.reversed : ""}`}
          >
            {/* Рендерим текст всегда первым в DOM, направление управляет order */}
            <div className={styles.section__about_textBlock}>
              <h3>{item.header}</h3>
              <div
                className={styles.section__about_text}
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </div>

            <img
              src={item.imageUrl}
              alt={item.alt || item.header}
              loading="lazy"
            />
          </div>
        );
      })}
    </section>
  );
};

export default SectionAbout;
