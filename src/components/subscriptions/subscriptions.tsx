import { useEffect, useState } from "react";
import fetchSubscriptions from "../../api/fetchSubscriptions";
import SubscriptionCard from "../subscriptionCard/subscriptionCard";

import styles from './subscriptions.module.css';

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

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSubscriptions = async () => {
      try {
        const result = await fetchSubscriptions();
        if (result) {
          setSubscriptions(result);
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getSubscriptions();
  }, []);

  if (isLoading) {
    return <div>Loading subscriptions...</div>;
  }

  if (!subscriptions || subscriptions.length === 0) {
    return <div>No subscriptions available</div>;
  }

  return (
    <div className={styles.subscriptionsContainer}>
      {subscriptions.map((subscription) => (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      ))}
    </div>
  );
};

export default Subscriptions;