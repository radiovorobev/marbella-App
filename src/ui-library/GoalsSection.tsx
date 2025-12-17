import styles from "../components/goalsBlock/GoalsBlock.module.css";

export type GoalSubsection = {
  title: string;
  items: string[];
};

export type GoalSection = {
  sectionTitle: string;
  items?: string[];
  subsections?: GoalSubsection[];
};

type GoalsSectionProps = {
  title?: string;
  goals: GoalSection[];
};

const GoalsSection = ({ title = "Objectives", goals }: GoalsSectionProps) => {
  if (!goals || goals.length === 0) {
    return null;
  }

  return (
    <section className={styles.goalsSection}>
      {title && (
        <div className={styles.titleContainer}>
          <h2 className={styles.goalsTitle}>{title}</h2>
        </div>
      )}
      <div className={styles.goalsGrid}>
        {goals.map((section, index) => (
          <div key={section.sectionTitle} className={styles.goalBox}>
            <h3 className={styles.sectionTitle}>{section.sectionTitle}</h3>

            {section.items && (
              <ul
                className={`${styles.goalList} ${
                  index > 0 ? styles.multiColumn : ""
                }`}
              >
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            {section.subsections?.map((subsection) => (
              <div key={subsection.title}>
                <h4 className={styles.subsectionTitle}>{subsection.title}</h4>
                <ul className={`${styles.goalList} ${styles.multiColumn}`}>
                  {subsection.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default GoalsSection;
