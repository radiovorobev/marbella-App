import styles from './GoalsBlock.module.css';

interface GoalSubsection {
  title: string;
  items: string[];
}

interface GoalSection {
  sectionTitle: string;
  items?: string[];
  subsections?: GoalSubsection[];
}

interface GoalsBlockProps {
  goals: GoalSection[];
}

const GoalsBlock = ({ goals }: GoalsBlockProps) => {
  return (
    <section className={styles.goalsSection}>
      <div className={styles.titleContainer}>
        <h2 className={styles.goalsTitle}>Objectives</h2>
      </div>
      <div className={styles.goalsGrid}>
        {goals.map((section, index) => (
          <div key={index} className={styles.goalBox}>
            <h3 className={styles.sectionTitle}>{section.sectionTitle}</h3>

            {section.items && (
              <ul className={`${styles.goalList} ${index > 0 ? styles.multiColumn : ''}`}>
                {section.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}

            {section.subsections && section.subsections.map((sub, subIdx) => (
              <div key={subIdx}>
                <h4 className={styles.subsectionTitle}>{sub.title}</h4>
                <ul className={`${styles.goalList} ${styles.multiColumn}`}>
                  {sub.items.map((item, i) => (
                    <li key={i}>{item}</li>
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

export default GoalsBlock;
