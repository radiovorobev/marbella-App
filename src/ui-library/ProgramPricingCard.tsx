import styles from "../components/contentCard/contentCard.module.css";

export type ProgramPricing = {
  title: string;
  tags?: string[];
  priceLabel: string;
  features?: string[];
  note?: string | null;
};

type ProgramPricingCardProps = {
  program: ProgramPricing;
  ctaLabel?: string;
  onCtaClick?: () => void;
};

/**
 * Program pricing card based on the existing ContentCard component but driven entirely by props.
 */
const ProgramPricingCard = ({
  program,
  ctaLabel = "Register",
  onCtaClick,
}: ProgramPricingCardProps) => {
  return (
    <div className={styles.card}>
      <section className={styles.headerSection}>
        <h3 className={styles.cardTitle}>{program.title}</h3>

        {program.tags && program.tags.length > 0 && (
          <div className={styles.tagContainer}>
            {program.tags.map((tag, index) => (
              <span key={`${tag}-${index}`} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className={styles.priceSection}>
        <div className={styles.priceTag}>
          <h4 className={styles.price}>{program.priceLabel}</h4>
        </div>

        {program.features && program.features.length > 0 && (
          <section className={styles.contentSection}>
            <ul className={styles.featuresList}>
              {program.features.map((item, index) => (
                <li key={`${item}-${index}`} className={styles.featureItem}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        <button className={styles.joinButton} onClick={onCtaClick}>
          {ctaLabel}
        </button>
      </section>

      {program.note && <p className={styles.note}>{program.note}</p>}
    </div>
  );
};

export default ProgramPricingCard;
