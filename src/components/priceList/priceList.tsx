import React from 'react';
import styles from './priceList.module.css';

// Определяем интерфейс для элемента extras
interface ExtraItem {
  text: string;
  price: string;
}

interface PriceListProps {
  extras: ExtraItem[] | null;
  title?: string; // Опциональный заголовок, по умолчанию "Extras"
  currency?: string; // Опциональный символ валюты
}

const PriceList: React.FC<PriceListProps> = ({ 
  extras, 
  title = "Extras",
  currency = "€" 
}) => {
  // Если extras отсутствует или пустой массив, ничего не отображаем
  if (!extras || extras.length === 0) {
    return null;
  }

  return (
    <section className={styles.section__priceList}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <ul className={styles.priceList}>
        {extras.map((extra, index) => (
          <li key={index} className={styles.priceList__item}>
            <span className={styles.priceList__itemDescription}>{extra.text}</span>
            <span className={styles.priceList__itemPrice}>
              {extra.price}{currency}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PriceList;