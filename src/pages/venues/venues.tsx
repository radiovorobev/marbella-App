import { useEffect, useState } from "react";
import SectionImage from "../../components/sectionImage/sectionImage";
import { useLanguage } from "../../context/languageContext";
import getLocalizedContent from "../../utils/getLocalizedContent";
import TextBlock from "../../components/textBlock/textBlock";
import fetchVenuesPage from "../../api/fetchVenuesPage";

interface VenuesPage {
  id: number;
  created_at: string;
  
  // Venues text sections
  venues_text_one_en: string | null;
  venues_text_one_es: string | null;
  venues_text_one_ru: string | null;
  venues_text_two_en: string | null;
  venues_text_two_es: string | null;
  venues_text_two_ru: string | null;
  
  // Image
  venues_image: string | null;
  
  // Page title
  page_title_en: string | null;
  page_title_es: string | null;
  page_title_ru: string | null;
  
  // Add index signature for getLocalizedContent compatibility
  [key: string]: string | number | null | undefined;
 }

const VenuesPage = () => {

  const [venuesPageData, setVenuesPageData] = useState<VenuesPage[] | null>(null);

  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const getVenuesPage = async () => {
      const result = await fetchVenuesPage();
      if (result) {
        setVenuesPageData(result);
      }
    };
    
    getVenuesPage();
  }, []);

  return (
    <main>
      {venuesPageData && venuesPageData.length > 0 ? (
      <>
        <SectionImage title={getLocalizedContent(venuesPageData[0], 'page_title', currentLanguage)} />
        <TextBlock text={getLocalizedContent(venuesPageData[0], 'venues_text_one', currentLanguage)} />
        <SectionImage imageUrl={venuesPageData[0].venues_image} imageAlt={'La Academia'}/>
        <TextBlock text={getLocalizedContent(venuesPageData[0], 'venues_text_two', currentLanguage)} />
      </>

      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
};

export default VenuesPage;