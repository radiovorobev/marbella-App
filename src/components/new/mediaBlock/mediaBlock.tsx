import styles from "./mediaBlock.module.css";

interface MediaBlockProps {
  title?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  videoUrl?: string;
}

const MediaBlock = ({ videoUrl, imageUrl, imageAlt, title }: MediaBlockProps) => {
  const formattedTitle = title?.replace(/&nbsp;/g, '\u00A0');

  return (
    <section className={styles.mediaBlock}>
      {videoUrl ? (
        <video autoPlay muted loop playsInline poster={imageUrl || ''} className={styles.backgroundVideo}>
          {videoUrl && <source src={videoUrl} type="video/mp4" />}
        </video>
      ) : (
        imageUrl && <img src={imageUrl} alt={imageAlt || 'Marbella International Football Academy'} className={styles.backgroundImage} />
      )}
      
      {formattedTitle && <h2 className={styles.mediaBlock__text}>{formattedTitle}</h2>}
    </section>
  );
};

export default MediaBlock;
