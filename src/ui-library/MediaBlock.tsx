import styles from "../components/new/mediaBlock/mediaBlock.module.css";

type MediaBlockProps = {
  title?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  videoUrl?: string;
};

const MediaBlock = ({ title, imageUrl, imageAlt, videoUrl }: MediaBlockProps) => {
  const formattedTitle = title?.replace(/&nbsp;/g, "\u00A0");

  return (
    <section className={styles.mediaBlock}>
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={imageUrl || undefined}
          className={styles.backgroundVideo}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        imageUrl && (
          <img
            src={imageUrl}
            alt={imageAlt || formattedTitle || "Media block"}
            className={styles.backgroundImage}
            loading="lazy"
          />
        )
      )}

      {formattedTitle && (
        <h2 className={styles.mediaBlock__text}>{formattedTitle}</h2>
      )}
    </section>
  );
};

export default MediaBlock;
