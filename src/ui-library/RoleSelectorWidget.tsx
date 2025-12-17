import { useState } from "react";
import styles from "../components/roleSelector/RoleSelector.module.css";

export type SelectorOption = {
  id: string;
  label: string;
};

type RoleSelectorWidgetProps = {
  title?: string;
  primaryLabel: string;
  secondaryLabel: string;
  primaryOptions: SelectorOption[];
  secondaryOptions: SelectorOption[];
  ctaLabel: string;
  onCtaClick?: (selectedRole: SelectorOption, selectedType: SelectorOption) => void;
};

const RoleSelectorWidget = ({
  title,
  primaryLabel,
  secondaryLabel,
  primaryOptions,
  secondaryOptions,
  ctaLabel,
  onCtaClick,
}: RoleSelectorWidgetProps) => {
  const [selectedRole, setSelectedRole] = useState(
    primaryOptions[0] ?? { id: "", label: "" },
  );
  const [selectedType, setSelectedType] = useState(
    secondaryOptions[0] ?? { id: "", label: "" },
  );

  if (!primaryOptions.length || !secondaryOptions.length) {
    return null;
  }

  return (
    <section className={styles.wrapper}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.group}>
        <p className={styles.label}>{primaryLabel}</p>
        <div className={styles.options}>
          {primaryOptions.map((option) => (
            <button
              key={option.id}
              className={`${styles.option} ${
                option.id === selectedRole.id ? styles.active : ""
              }`}
              onClick={() => setSelectedRole(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <p className={styles.label}>{secondaryLabel}</p>
        <div className={styles.options}>
          {secondaryOptions.map((option) => (
            <button
              key={option.id}
              className={`${styles.option} ${
                option.id === selectedType.id ? styles.active : ""
              }`}
              onClick={() => setSelectedType(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <button
        className={styles.registerButton}
        onClick={() => onCtaClick?.(selectedRole, selectedType)}
      >
        {ctaLabel}
      </button>
    </section>
  );
};

export default RoleSelectorWidget;
