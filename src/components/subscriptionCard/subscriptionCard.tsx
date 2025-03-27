import { useLanguage } from "../../context/languageContext";
import getLocalizedContent from "../../utils/getLocalizedContent";

import styles from './SubscriptionCard.module.css';

interface Subscription {
  id: number;
  created_at: string;
  title_en: string | null;
  title_es: string | null;
  title_ru: string | null;
  price: number | null;
  is_mountly: boolean;
  is_hourly: boolean;
  price_per_session: string | null;
  description_en: string | null;
  description_es: string | null;
  description_ru: string | null;
  sort_order: number | null;
  [key: string]: string | number | boolean | string[] | null | undefined;
}

interface SubscriptionCardProps {
  subscription: Subscription;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> =  ({subscription}) => {

const { currentLanguage } = useLanguage();
  return (
    <div className={styles.card}>
      <section className={styles.descriptionSection}>
        <h3>{getLocalizedContent(subscription, 'title', currentLanguage)}</h3>
        <p>{getLocalizedContent(subscription, 'description', currentLanguage)}</p>
      </section>
      <section className={styles.priceSection}>
      <div className={styles.priceTag}>
        <h4>
          &euro;{subscription.price}
          {subscription.is_mountly && currentLanguage == 'en' && ' / month'}
          {subscription.is_mountly && currentLanguage == 'es' && ' al mes'}
          {subscription.is_hourly && currentLanguage == 'en' && ' / hour'}
          {subscription.is_hourly && currentLanguage == 'es' && ' / hora'}
        </h4>
      </div>
        
          { subscription.price_per_session ? (
            <p className={styles.pricePerSession}>
              &euro;{subscription.price_per_session}
              {currentLanguage == 'en' && ' per session'}
              {currentLanguage == 'es' && ' por clase'}
            </p>
          ) : (
            <p className={styles.pricePerSession}>
              &nbsp;
            </p>
          )}
        
      </section>

    </div>
  )
}

export default SubscriptionCard;