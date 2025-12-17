import { useEffect, useRef } from "react";
import styles from "../components/partners/partners.module.css";

export type PartnerLogo = {
  src: string;
  alt?: string;
};

type PartnersMarqueeProps = {
  title?: string;
  logos: PartnerLogo[];
  scrollSpeed?: number;
};

const PartnersMarquee = ({
  title = "Partners",
  logos,
  scrollSpeed = 1,
}: PartnersMarqueeProps) => {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = galleryRef.current;
    if (!el || scrollSpeed <= 0) return;

    const interval = setInterval(() => {
      if (!el) return;
      el.scrollLeft += scrollSpeed;
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }
    }, 16);

    return () => clearInterval(interval);
  }, [scrollSpeed]);

  if (!logos || logos.length === 0) {
    return null;
  }

  const allLogos = [...logos, ...logos];

  return (
    <section className={styles.section__instagram}>
      <div className={styles.section__instagram_container}>
        {title && (
          <div className={styles.section__header}>
            <h2>{title}</h2>
          </div>
        )}
        <div
          className={styles.section__instagram_block}
          ref={galleryRef}
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            whiteSpace: "nowrap",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {allLogos.map((logo, index) => (
            <img
              key={`${logo.src}-${index}`}
              className={styles.section__instagram_image}
              src={logo.src}
              alt={logo.alt || "Partner"}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersMarquee;
