import { ReactNode } from "react";
import styles from "../components/sectionImage/sectionImage.module.css";

type HeroMediaProps = {
  title?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  videoUrl?: string;
  posterUrl?: string;
  children?: ReactNode;
};

/**
 * Hero section that mirrors the current SectionImage component, but takes its content via props.
 * Allows embedding either an image or a looping background video and optional title overlay.
 */
const HeroMedia = ({
  title,
  imageUrl,
  imageAlt,
  videoUrl,
  posterUrl,
  children,
}: HeroMediaProps) => {
  const formattedTitle = title?.replace(/&nbsp;/g, "\u00A0");

  return (
    <section className={styles.section__image}>
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={posterUrl || imageUrl || undefined}
          className={styles.backgroundVideo}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        imageUrl && (
          <img
            src={imageUrl}
            alt={imageAlt || formattedTitle || "Hero background"}
            className={styles.backgroundImage}
            loading="lazy"
          />
        )
      )}

      {formattedTitle && (
        <h2 className={styles.section__image_text}>{formattedTitle}</h2>
      )}
      {children}
    </section>
  );
};

export default HeroMedia;
