import styles from "../components/coachesCards/CoachesCards.module.css";

export type CoachCard = {
  id?: number | string;
  name: string;
  role: string;
  license?: string;
  photoUrl: string;
  bioHtml?: string;
};

type CoachesGridProps = {
  title?: string;
  coaches: CoachCard[];
};

/**
 * Grid of coach cards without any fetching logic. Consumers pass already localized content.
 */
const CoachesGrid = ({ title = "Coaching staff", coaches }: CoachesGridProps) => {
  if (!coaches || coaches.length === 0) {
    return null;
  }

  return (
    <section className={styles.section__coaches}>
      {title && <h2 className={styles.section__coaches_header}>{title}</h2>}
      <div className={styles.section__coaches_cards}>
        {coaches.map((coach) => (
          <div
            key={coach.id || coach.name}
            className={styles.section__coaches_card}
          >
            <img
              src={coach.photoUrl}
              alt={coach.name}
              className={styles.section__coaches_image}
              loading="lazy"
            />
            <div className={styles.section__coach_card_textBlock}>
              <div className={styles.section__card_header}>
                <h3 className={styles.section__coach_card_name}>
                  {coach.name}
                </h3>
                <p className={styles.section__coach_card_role}>{coach.role}</p>
                {coach.license && (
                  <p className={styles.section__coach_card_license}>
                    {coach.license}
                  </p>
                )}
              </div>
              {coach.bioHtml && (
                <div
                  className={styles.section__coach_card_text}
                  dangerouslySetInnerHTML={{ __html: coach.bioHtml }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoachesGrid;
