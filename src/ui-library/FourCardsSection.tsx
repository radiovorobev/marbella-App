import styles from "../components/fourCards/fourCards.module.css";

export type InfoCard = {
  id: number | string;
  text: string;
  image?: string;
  discount?: string | number;
  headerText?: string;
  backgroundColor?: string;
};

type FourCardsSectionProps = {
  title: string;
  cards: InfoCard[];
};

const FourCardsSection = ({ title, cards }: FourCardsSectionProps) => {
  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={styles.container}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={styles.card}
            style={{ backgroundColor: card.backgroundColor }}
          >
            {card.image && (
              <img
                src={card.image}
                alt={card.headerText || card.text}
                className={styles.image}
                loading="lazy"
              />
            )}

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

            <div
              className={styles.text}
              dangerouslySetInnerHTML={{ __html: card.text }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FourCardsSection;
