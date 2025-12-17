import { useEffect, useRef, useState } from "react";
import styles from "../components/gallery/gallery.module.css";

export type GalleryItem = {
  src: string;
  alt?: string;
};

type GalleryCarouselProps = {
  title?: string;
  ctaUrl?: string;
  ctaIconSrc?: string;
  items: GalleryItem[];
  loopIntervalMs?: number;
};

const GalleryCarousel = ({
  title,
  ctaUrl,
  ctaIconSrc,
  items,
  loopIntervalMs = 0,
}: GalleryCarouselProps) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const updateMaxScroll = () => {
      if (galleryRef.current) {
        const { offsetWidth, scrollWidth } = galleryRef.current;
        setMaxScroll(scrollWidth - offsetWidth);
      }
    };

    updateMaxScroll();
    window.addEventListener("resize", updateMaxScroll);
    return () => window.removeEventListener("resize", updateMaxScroll);
  }, []);

  useEffect(() => {
    if (!loopIntervalMs || loopIntervalMs <= 0) {
      return;
    }

    const interval = setInterval(() => {
      if (!galleryRef.current) return;
      const step = 310; // image width + gap
      const next = Math.min(galleryRef.current.scrollLeft + step, maxScroll);
      galleryRef.current.scrollTo({ left: next, behavior: "smooth" });
    }, loopIntervalMs);

    return () => clearInterval(interval);
  }, [loopIntervalMs, maxScroll]);

  const scrollBy = (delta: number) => {
    if (galleryRef.current) {
      const next = Math.min(
        Math.max(scrollPosition + delta, 0),
        maxScroll || galleryRef.current.scrollWidth,
      );
      galleryRef.current.scrollTo({ left: next, behavior: "smooth" });
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className={styles.section__instagram}>
      <div className={styles.section__instagram_container}>
        {(title || ctaUrl) && (
          <div className={styles.section__header}>
            {title && <h2>{title}</h2>}
            {ctaUrl && (
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                {ctaIconSrc ? (
                  <img
                    src={ctaIconSrc}
                    alt="Gallery CTA"
                    className={styles.section__header_social_icon}
                    loading="lazy"
                  />
                ) : (
                  "View more"
                )}
              </a>
            )}
          </div>
        )}

        <div
          className={styles.section__instagram_block}
          ref={galleryRef}
          onScroll={() =>
            setScrollPosition(galleryRef.current?.scrollLeft || 0)
          }
          onMouseDown={(e) => {
            setIsDragging(true);
            setStartX(e.pageX - (galleryRef.current?.offsetLeft || 0));
            setScrollLeft(galleryRef.current?.scrollLeft || 0);
          }}
          onMouseMove={(e) => {
            if (!isDragging || !galleryRef.current) return;
            e.preventDefault();
            const x = e.pageX - galleryRef.current.offsetLeft;
            const walk = (x - startX) * 2;
            galleryRef.current.scrollLeft = scrollLeft - walk;
          }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={(e) => {
            setIsDragging(true);
            setStartX(e.touches[0].pageX - (galleryRef.current?.offsetLeft || 0));
            setScrollLeft(galleryRef.current?.scrollLeft || 0);
          }}
          onTouchMove={(e) => {
            if (!isDragging || !galleryRef.current) return;
            const x = e.touches[0].pageX - galleryRef.current.offsetLeft;
            const walk = (x - startX) * 2;
            galleryRef.current.scrollLeft = scrollLeft - walk;
          }}
          onTouchEnd={() => setIsDragging(false)}
        >
          {items.map((image, index) => (
            <img
              key={`${image.src}-${index}`}
              className={styles.section__instagram_image}
              src={image.src}
              alt={image.alt || "Gallery item"}
              draggable="false"
              loading="lazy"
            />
          ))}
        </div>

        <button
          className={`${styles.section__instagram_more_button} ${styles.left} ${
            scrollPosition <= 0 ? styles.hidden : ""
          }`}
          onClick={() => scrollBy(-310)}
          aria-label="Scroll left"
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M43 28H10" stroke="currentColor" strokeWidth="2" />
            <path d="M26 15L10 28L26 41" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        <button
          className={`${styles.section__instagram_more_button} ${
            scrollPosition >= maxScroll ? styles.hidden : ""
          }`}
          onClick={() => scrollBy(310)}
          aria-label="Scroll right"
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13 28H46" stroke="currentColor" strokeWidth="2" />
            <path d="M30 41L46 28L30 15" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default GalleryCarousel;
