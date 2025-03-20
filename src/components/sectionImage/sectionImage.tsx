import styles from "./sectionImage.module.css";

import firstScreenVideo from '../../video/background.mp4';
import backgroundPoster from '../../images/backgroundPoster.jpg';

interface SectionImageProps {
  title: string;
}

const SectionImage = ({ title }: SectionImageProps) => {

  const formattedTitle = title?.replace(/&nbsp;/g, '\u00A0');

  return (
    <section className={styles.section__image}>
      <video autoPlay muted loop playsInline poster={backgroundPoster} className={styles.backgroundVideo}>
        <source src={firstScreenVideo} type="video/mp4" />
      </video>
      <h2 className={styles.section__image_text}>{formattedTitle}</h2>
    </section>
  );
};

export default SectionImage;