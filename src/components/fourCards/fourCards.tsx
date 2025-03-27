import styles from './fourCards.module.css';

interface Card {
  id: number;
  text: string;
  image: string;
}

interface FourCardsProps {
  cards: Card[];
  title: string;
}

const fourCards: React.FC<FourCardsProps> = ({ cards, title }) => {
  return (
    <section className={styles.section}>
      <div className={styles.titleContainer}>
      <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={styles.container}>
        {cards && cards.length > 0 ? (
          cards.map((card) => (
            <div key={card.id} className={styles.card}>
              {card.image && (
                <img 
                  src={card.image} 
                  alt={card.text} 
                  className={styles.image} 
                />
              )}
              <div 
                className={styles.text} 
                dangerouslySetInnerHTML={{ __html: card.text }}
              />
            </div>
          ))
        ) : (
          <p>No cards available</p>
        )}
      </div>
    </section>
  );
};

export default fourCards;