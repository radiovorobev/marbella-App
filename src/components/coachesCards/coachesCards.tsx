import { useEffect, useState } from 'react';
import styles from './CoachesCards.module.css';
import fetchCoaches from '../../api/fetchCoaches';
import { useLanguage } from '../../context/languageContext';
import getLocalizedContent from '../../utils/getLocalizedContent';

interface Coach {
  id: number;
  name: string;
  role: string;
  license: string;
  photo_url: string;  
}

const CoachesCards = () => {
  const [coaches, setCoaches] = useState<Coach[] | null>(null);
  const [loading, setLoading] = useState(true);

  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const getCoaches = async () => {
      try {
        const coachesData = await fetchCoaches();
        setCoaches(coachesData);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    getCoaches();
  }, []);

  return (
    <section className={styles.section__coaches}>
      <h2 className={styles.section__coaches_header}>Coaching staff</h2>
    <div className={styles.section__coaches_cards}>
    {coaches && coaches.map((coach) => (
      <div key={coach.id} className={styles.section__coaches_card}>
        <img src={coach.photo_url} alt={coach.name} className={styles.section__coaches_image} />
        <div className={styles.section__coach_card_textBlock}>
          <h3 className={styles.section__coach_card_name}>{getLocalizedContent(coach, 'name', currentLanguage)}</h3>
          <p className={styles.section__coach_card_role}>{getLocalizedContent(coach, 'role', currentLanguage)}</p>
          <p className={styles.section__coach_card_license}>{coach.license}</p>
          <div className={styles.section__coach_card_text} dangerouslySetInnerHTML={{ __html: getLocalizedContent(coach, 'bio', currentLanguage) }} />
        </div>
      </div>
    
    )) 
    }
    </div>
    </section> 
  )
}

export default CoachesCards;