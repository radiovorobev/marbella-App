import styles from "./sectionImage.module.css";

import firstScreenVideo from '../../video/background.mp4';
import backgroundPoster from '../../images/backgroundPoster.jpg';

interface SectionImageProps {
  title?: string;
  imageUrl?: string | null;
  imageAlt?: string;
}

const SectionImage = ({ title, imageUrl, imageAlt }: SectionImageProps) => {
  const formattedTitle = title?.replace(/&nbsp;/g, '\u00A0');

  return (
    <section className={styles.section__image}>
      {imageUrl ? (
        // Отображаем изображение, если передан imageUrl
        <img 
          src={imageUrl} 
          alt={imageAlt || "Marbella International Football Academy"} 
          className={styles.backgroundImage}
        />
      ) : (
        // Иначе отображаем видео
        <video autoPlay muted loop playsInline poster={backgroundPoster} className={styles.backgroundVideo}>
          <source src={firstScreenVideo} type="video/mp4" />
        </video>
      )}
      
      {/* Отображаем заголовок, только если он передан */}
      {formattedTitle && (
        <h2 className={styles.section__image_text}>{formattedTitle}</h2>
      )}
    </section>
  );
};

export default SectionImage;