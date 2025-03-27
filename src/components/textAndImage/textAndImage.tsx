import React from 'react';
import styles from './textAndImage.module.css';

interface TextAndImageProps {
  text: string;
  image: string;
}

const TextAndImage: React.FC<TextAndImageProps> = ({ text, image }) => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionContainer}>
        <img 
          className={styles.image} 
          src={image} 
          alt="Programme illustration"
        />
        <div 
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
    </section>
  );
}

export default TextAndImage;