import styles from "../components/programm/programm.module.css";

export type ProgramHighlightProps = {
  title: string;
  level?: string;
  ageRange?: string | null;
  descriptionHtml: string;
  imageUrl?: string | null;
  imageAlt?: string;
};

const ProgramHighlight = ({
  title,
  level,
  ageRange,
  descriptionHtml,
  imageUrl,
  imageAlt,
}: ProgramHighlightProps) => {
  return (
    <div className={styles.section__programms_programm}>
      <div className={styles.section__programms_programm_container}>
        <div className={styles.section__programms_programm_description}>
          <h2 className={styles.section__programms_programm_title}>{title}</h2>
          <div className={styles.section__programms_programm_specs}>
            {level && (
              <span className={styles.section__programms_programm_specs_level}>
                {level}
              </span>
            )}
            {ageRange && (
              <span className={styles.section__programms_programm_specs_age}>
                {ageRange}
              </span>
            )}
          </div>
          <p
            className={styles.section__programms_programm_text}
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          ></p>
        </div>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className={styles.section__programms_programm_image}
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
};

export default ProgramHighlight;
