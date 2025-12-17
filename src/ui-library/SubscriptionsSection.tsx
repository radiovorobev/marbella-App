import styles from "../components/subscriptions/subscriptions.module.css";
import SubscriptionCardView, {
  SubscriptionPlan,
} from "./SubscriptionCardView";

type SubscriptionsSectionProps = {
  title: string;
  introHtml: string;
  plans: SubscriptionPlan[];
  ctaLabel?: string;
  onPlanClick?: (plan: SubscriptionPlan) => void;
};

const SubscriptionsSection = ({
  title,
  introHtml,
  plans,
  ctaLabel,
  onPlanClick,
}: SubscriptionsSectionProps) => {
  if (!plans || plans.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <div
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: introHtml }}
      />

      <div className={styles.subscriptionsContainer}>
        {plans.map((plan) => (
          <SubscriptionCardView
            key={plan.id || plan.title}
            plan={plan}
            ctaLabel={ctaLabel}
            onCtaClick={onPlanClick}
          />
        ))}
      </div>
    </section>
  );
};

export default SubscriptionsSection;
