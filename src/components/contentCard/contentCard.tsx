import { useLanguage } from "../../context/languageContext";
import getLocalizedContent from "../../utils/getLocalizedContent";
import styles from './contentCard.module.css';

interface ProgramCard {
  id: number;
  title: string;
  tags: string[];
  price: number;
  content: string[];
  note: string | null;
}

interface ContentCardProps {
  card: ProgramCard;
}

const ContentCard: React.FC<ContentCardProps> = ({ card }) => {
  const { currentLanguage } = useLanguage();
  
  // Функция для определения текста кнопки в зависимости от языка
  const getButtonText = () => {
    switch (currentLanguage) {
      case 'es':
        return 'Registrarse';
      case 'ru':
        return 'Записаться';
      default:
        return 'Register';
    }
  };
  
  // Обработчик клика на кнопку
  const handleRegisterClick = () => {
    window.open('https://wa.me/message/474IL7PF6E25O1', '_blank');
  };
  
  return (
      <div className={styles.card}>
        <section className={styles.headerSection}>
          <h3 className={styles.cardTitle}>{card.title}</h3>
          
          {card.tags && card.tags.length > 0 && (
            <div className={styles.tagContainer}>
              {card.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </section>
        
        <section className={styles.priceSection}>
          <div className={styles.priceTag}>
            <h4 className={styles.price}>&euro;{card.price}&nbsp;/&nbsp;week</h4>
          </div>
          
          <section className={styles.contentSection}>
          {card.content && card.content.length > 0 && (
            <ul className={styles.featuresList}>
              {card.content.map((item, index) => (
                <li key={index} className={styles.featureItem}>{item}</li>
              ))}
            </ul>
          )}
        </section>
          
          <button 
            className={styles.joinButton} 
            onClick={handleRegisterClick}
          >
            {getButtonText()}
          </button>
        </section>
        {card.note && (
        <p className={styles.note}>{card.note}</p>
        )}
      </div>

  );
};

export default ContentCard;