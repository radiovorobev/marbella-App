import styles from "../components/priceList/priceList.module.css";

export type PriceListItem = {
  label: string;
  value: string;
};

type PriceListSectionProps = {
  title?: string;
  currencySuffix?: string;
  items: PriceListItem[];
};

const PriceListSection = ({
  title = "Extras",
  currencySuffix = "",
  items,
}: PriceListSectionProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className={styles.section__priceList}>
      {title && (
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{title}</h2>
        </div>
      )}
      <ul className={styles.priceList}>
        {items.map((item) => (
          <li key={item.label} className={styles.priceList__item}>
            <span className={styles.priceList__itemDescription}>
              {item.label}
            </span>
            <span className={styles.priceList__itemPrice}>
              {item.value}
              {currencySuffix}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PriceListSection;
