import { useLanguage } from "../../context/languageContext";
import styles from "./langButton.module.css";

const LangButton = () => {
  const { currentLanguage, setLanguage, languages } = useLanguage();

  return (
    <div className={styles.header__lang}>
      <div className={styles.header__langButton}>
        {currentLanguage.toUpperCase()}
      </div>
      <div className={styles.header__langMenu}>
        {languages.map((lang) => (
          lang.code !== currentLanguage && (
            <div 
              key={lang.code}
              className={styles.header__langOption}
              onClick={() => setLanguage(lang.code)}
            >
              {lang.code.toUpperCase()}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default LangButton;