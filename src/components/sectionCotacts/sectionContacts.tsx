import { useEffect, useState } from 'react';
import styles from './SectionContacts.module.css';
import { useLanguage } from '../../context/languageContext';
import fetchContactsData from '../../api/fetchContactsData';
import getLocalizedContent from '../../utils/getLocalizedContent';

interface ContactsTextProps {
  text: string;
}

interface ContactsData {
  address_en: string;
  address_es: string | null;
  address_ru: string | null;
  phone_number: string | null;
  whatsapp_link: string | undefined;
  address_url: string | undefined;
  [key: string]: string | number | boolean | string[] | null | undefined;
}

const SectionContacts: React.FC<ContactsTextProps> =  ({text}) => {

  const [contactsData, setContactsData] = useState<ContactsData[] | null>(null);
  const { currentLanguage } = useLanguage();

  const primaryOffice = {
    primaryOffice_ru: 'Главный офис',
    primaryOffice_en: 'Primary Office',
    primaryOffice_es: 'Oficina principal'
  }

  useEffect (() => {
    const getContactsData = async () => {
      const result = await fetchContactsData();
      if (result) {
        setContactsData(result);
      }
    }

    getContactsData();
  }, []);

  return (
    <section className={styles.section__contacts}>
    <div className={styles.section__contacts_container}>
      <div className={styles.section__contacts_column} dangerouslySetInnerHTML={{ __html: text }}>
     </div>
     { contactsData && contactsData.length > 0 && (
     <div className={styles.section__contacts_column}>
      <h3>{getLocalizedContent(primaryOffice, 'primaryOffice', currentLanguage)}</h3>
      <a className={styles.section__contacts_address} href={contactsData[0].address_url} target="_blank">
      {getLocalizedContent(contactsData[0], 'address', currentLanguage)}
      </a>
      <a className={styles.section__contacts_tel} href={contactsData[0].whatsapp_link} target="_blank">{contactsData[0].phone_number}</a>
     </div>
     )}
    </div>
  </section>
  )
}

export default SectionContacts;