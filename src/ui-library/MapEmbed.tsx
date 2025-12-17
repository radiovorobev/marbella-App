import styles from "../components/map/Map.module.css";

type MapEmbedProps = {
  embedUrl: string;
  title?: string;
};

const MapEmbed = ({ embedUrl, title }: MapEmbedProps) => {
  return (
    <section className={styles.section__map}>
      <iframe
        src={embedUrl}
        title={title || "Location map"}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
};

export default MapEmbed;
