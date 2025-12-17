import styles from "../components/subscriptionCard/SubscriptionCard.module.css";

export type SubscriptionPlan = {
  id?: number | string;
  title: string;
  description?: string;
  priceLabel: string;
  secondaryPriceLabel?: string;
  badge?: string;
};

type SubscriptionCardViewProps = {
  plan: SubscriptionPlan;
  ctaLabel?: string;
  onCtaClick?: (plan: SubscriptionPlan) => void;
};

const SubscriptionCardView = ({
  plan,
  ctaLabel = "Register",
  onCtaClick,
}: SubscriptionCardViewProps) => {
  return (
    <div className={styles.card}>
      <section className={styles.descriptionSection}>
        <h3>{plan.title}</h3>
        {plan.description && <p>{plan.description}</p>}
      </section>
      <section className={styles.priceSection}>
        <div className={styles.priceTag}>
          <h4>{plan.priceLabel}</h4>
        </div>

        <p className={styles.pricePerSession}>
          {plan.secondaryPriceLabel || "\u00A0"}
        </p>

        <button
          className={styles.joinButton}
          onClick={() => onCtaClick?.(plan)}
        >
          {ctaLabel}
        </button>
      </section>
    </div>
  );
};

export default SubscriptionCardView;
