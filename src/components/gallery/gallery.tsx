import { useState, useRef, useEffect } from 'react';
import styles from './gallery.module.css';

import Gallery_2 from '../../images/gallery/gallery-2.jpg';
import Gallery_3 from '../../images/gallery/gallery-3.jpg';
import Gallery_4 from '../../images/gallery/gallery-4.jpg';
import Gallery_5 from '../../images/gallery/gallery-5.jpg';
import Gallery_6 from '../../images/gallery/gallery-6.jpg';
import Gallery_7 from '../../images/gallery/gallery-7.jpg';
import Gallery_8 from '../../images/gallery/gallery-8.jpg';

import instagramIcon from '../../images/icon_insta.svg';
import { useLanguage } from '../../context/languageContext';

const Gallery = () => {
  const { currentLanguage } = useLanguage();
  const galleryRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Массив изображений для удобства управления
  const images = [
    { src: Gallery_2, alt: "Gallery image 1" },
    { src: Gallery_3, alt: "Gallery image 2" },
    { src: Gallery_4, alt: "Gallery image 3" },
    { src: Gallery_5, alt: "Gallery image 4" },
    { src: Gallery_6, alt: "Gallery image 5" },
    { src: Gallery_7, alt: "Gallery image 6" },
    { src: Gallery_8, alt: "Gallery image 7" },
  ];

  // Обновление максимальной прокрутки при изменении размера окна
  useEffect(() => {
    const updateMaxScroll = () => {
      if (galleryRef.current) {
        const containerWidth = galleryRef.current.offsetWidth;
        const scrollWidth = galleryRef.current.scrollWidth;
        setMaxScroll(scrollWidth - containerWidth);
      }
    };

    updateMaxScroll();
    window.addEventListener('resize', updateMaxScroll);
    return () => window.removeEventListener('resize', updateMaxScroll);
  }, []);

  // Локализация текста
  function getLang(lang: string) {
    switch(lang) {
      case 'en':
        return "Play with us";
      case 'es':
        return "Juega con nosotros";
      case 'ru':
        return "Играй вместе с нами";
      default:
        return "Play with us";
    }
  }

  // Функция прокрутки влево
  const scrollToLeft = () => {
    if (galleryRef.current) {
      // Прокручиваем на ширину одного изображения + отступ
      const scrollStep = 290 + 20; // ширина изображения + gap
      const newPosition = Math.max(scrollPosition - scrollStep, 0);
      
      galleryRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  // Функция прокрутки вправо
  const scrollToRight = () => {
    if (galleryRef.current) {
      // Прокручиваем на ширину одного изображения + отступ
      const scrollStep = 290 + 20; // ширина изображения + gap
      const newPosition = Math.min(scrollPosition + scrollStep, maxScroll);
      
      galleryRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  // Обработчик скролла
  const handleScroll = () => {
    if (galleryRef.current) {
      setScrollPosition(galleryRef.current.scrollLeft);
    }
  };

  // Обработчики для свайпа
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (galleryRef.current?.offsetLeft || 0));
    setScrollLeft(galleryRef.current?.scrollLeft || 0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (galleryRef.current?.offsetLeft || 0));
    setScrollLeft(galleryRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (galleryRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Скорость свайпа
    if (galleryRef.current) {
      galleryRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (galleryRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Скорость свайпа
    if (galleryRef.current) {
      galleryRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (galleryRef.current) {
      setScrollPosition(galleryRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (galleryRef.current) {
        setScrollPosition(galleryRef.current.scrollLeft);
      }
    }
  };

  return (
    <section className={styles.section__instagram}>
      <div className={styles.section__instagram_container}>
        <div className={styles.section__header}>
          <h2>{getLang(currentLanguage)}</h2>
          <a href="https://www.instagram.com/academymarbella" target="_blank" rel="noopener noreferrer">
            <img src={instagramIcon} alt="Instagram" className={styles.section__header_social_icon} />
          </a>
        </div>
        
        <div 
          className={styles.section__instagram_block}
          ref={galleryRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          style={{ 
            overflow: 'auto',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE и Edge
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          {images.map((image, index) => (
            <img 
              key={index}
              className={styles.section__instagram_image} 
              src={image.src} 
              alt={image.alt}
              draggable="false" // Предотвращаем стандартный drag-and-drop
            />
          ))}
        </div>
        
        <button 
          className={`${styles.section__instagram_more_button} ${styles.left} ${scrollPosition <= 0 ? styles.hidden : ''}`}
          onClick={scrollToLeft}
          aria-label="Scroll left"
        >
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M43 28H10" stroke="currentColor" strokeWidth="2"/>
            <path d="M26 15L10 28L26 41" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        
        <button 
          className={`${styles.section__instagram_more_button} ${scrollPosition >= maxScroll ? styles.hidden : ''}`}
          onClick={scrollToRight}
          aria-label="Scroll right"
        >
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 28H43" stroke="currentColor" strokeWidth="2"/>
            <path d="M30 15L43 28L30 41" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Gallery;