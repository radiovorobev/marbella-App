import React from 'react';
import styles from './fourCards.module.css';

interface Card {
  id: number;
  text: string;
  image?: string;
  discount?: string | number;
  headerText?: string; // Добавляем поддержку headerText
  backgroundColor?: string;
}

interface FourCardsProps {
  cards: Card[];
  title: string;
}

const FourCards: React.FC<FourCardsProps> = ({ cards, title }) => {
  return (
    <section className={styles.section}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={styles.container}>
        {cards && cards.length > 0 ? (
          cards.map((card) => (
            <div 
              key={card.id} 
              className={styles.card}
              style={{ backgroundColor: card.backgroundColor }}
            >
              {/* Отображаем изображение при наличии */}
              {card.image && (
                <img 
                  src={card.image} 
                  alt={card.text} 
                  className={styles.image} 
                />
              )}
              
              {/* Приоритет: headerText, затем discount */}
              {card.headerText && (
                <div className={styles.headerContainer}>
                  <div 
                    className={styles.headerText}
                    dangerouslySetInnerHTML={{ __html: card.headerText }}
                  />
                </div>
              )}
              {!card.headerText && card.discount && (
                <div className={styles.headerContainer}>
                  <h3 className={styles.headerText}>{card.discount}%</h3>
                </div>
              )}
              
              {/* Текст карточки */}
              <div 
                className={styles.text} 
                dangerouslySetInnerHTML={{ __html: card.text }}
              />
            </div>
          ))
        ) : (
          <p className={styles.noCards}>No cards available</p>
        )}
      </div>
    </section>
  );
};

export default FourCards;