import { useEffect, useState } from "react";
import fetchContactsPage from "../../api/fetchContactsPage";
import getLocalizedContent from "../../utils/getLocalizedContent";
import { useLanguage } from "../../context/languageContext";
import SectionImage from "../../components/sectionImage/sectionImage";
import SectionContacts from "../../components/sectionCotacts/sectionContacts";

interface ContactsPage {
  id: number;
  created_at: string;
  updated_at: string;
  
  // Title fields
  title_en: string;
  title_es: string | null;
  title_ru: string | null;

  text_en: string;
  text_es: string | null;
  text_ru: string | null; 
}

const ContactsPage = () => {

  const [contactsPageData, setContactsPageData] = useState<ContactsPage[] | null>(null);
  const { currentLanguage } = useLanguage();

  useEffect (() => {
    const getContactsPage = async () => {
      const result = await fetchContactsPage();
      if (result) {
        setContactsPageData(result);
      }
    }

    getContactsPage();
  }, []);

  return (
    <main>
        {contactsPageData && contactsPageData.length > 0 ? (
        <>
          <SectionImage title={getLocalizedContent(contactsPageData[0], 'title', currentLanguage)} />
          <SectionContacts text={getLocalizedContent(contactsPageData[0], 'text', currentLanguage)} />
        </>
        ) : (
        <></>
        )}
    </main>
  );
}

export default ContactsPage;