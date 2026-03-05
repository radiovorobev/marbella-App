import { useRef, useEffect } from "react";
import styles from "./partners.module.css";

import Gallery_2 from "../../images/partners/Barcelo.svg";
import Gallery_3 from "../../images/partners/Obal.svg";
import Gallery_4 from "../../images/partners/Occidental.svg";
import Gallery_5 from "../../images/partners/Ona.svg";
import Gallery_6 from "../../images/partners/Puma.svg";
import Gallery_7 from "../../images/partners/ACScholarshipsAgency.svg";
import Gallery_8 from "../../images/partners/SaonaTalentfut.svg";

import { useLanguage } from "../../context/languageContext";

const Partners = () => {
  const { currentLanguage } = useLanguage();
  const galleryRef = useRef<HTMLDivElement>(null);

  const images = [
    { src: Gallery_2, alt: "Barceló Hotels & Resorts" },
    { src: Gallery_3, alt: "Óbal Urban Hotel" },
    { src: Gallery_4, alt: "Occidental Hotels & Resorts" },
    { src: Gallery_5, alt: "Ona Valle Romano Golf & Resort" },
    { src: Gallery_6, alt: "Puma" },
    { src: Gallery_7, alt: "AC Scholarships Agency" },
    { src: Gallery_8, alt: "Saona Talentfut" },
  ];

  // 🔁 Клонируем изображения для бесконечного скролла
  const allImages = [...images, ...images];

  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;

    const scrollSpeed = 1; // px/frame
    const interval = 16; // ~60fps

    const scroll = () => {
      if (!el) return;

      el.scrollLeft += scrollSpeed;

      // Когда прокрутка доходит до конца оригинального списка, возвращаемся к началу
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }
    };

    const intervalId = setInterval(scroll, interval);
    return () => clearInterval(intervalId);
  }, []);

  const getLang = (lang: string) => {
    switch (lang) {
      case "en":
        return "Collaborators";
      case "es":
        return "Colaboradores";
      case "ru":
        return "Партнеры";
      default:
        return "Partners";
    }
  };

  return (
    <section className={styles.section__instagram}>
      <div className={styles.section__instagram_container}>
        <div className={styles.section__header}>
          <h2>{getLang(currentLanguage)}</h2>
        </div>

        <div
          className={styles.section__instagram_block}
          ref={galleryRef}
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            whiteSpace: "nowrap",
            cursor: "default",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {allImages.map((image, index) => (
            <img
              key={index}
              className={styles.section__instagram_image}
              src={image.src}
              alt={image.alt}
              draggable="false"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
