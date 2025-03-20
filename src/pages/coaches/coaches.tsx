import { useEffect, useState } from "react";
import SectionImage from "../../components/sectionImage/sectionImage";
import { useLanguage } from "../../context/languageContext";
import getLocalizedContent from "../../utils/getLocalizedContent";
import TextBlock from "../../components/textBlock/textBlock";
import fetchCoachesPage from "../../api/fetchCoachesPage";

interface CoachesPage {
  id: number;
  created_at: string;
  
  title_en: string | null;
  title_es: string | null;
  title_ru: string | null;
  
  text_en: string | null;
  text_es: string | null;
  text_ru: string | null;
  
  [key: string]: string | number | null | undefined;
}

const CoachesPage = () => {

  const [coachesPageData, setCoachesPageData] = useState<CoachesPage[] | null>(null);

  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const getCoachesPage = async () => {
      const result = await fetchCoachesPage();
      if (result) {
        setCoachesPageData(result);
      }
    };
    
    getCoachesPage();
  }, []);

  return (
    <main>
      {coachesPageData && coachesPageData.length > 0 ? (
      <>
        <SectionImage title={getLocalizedContent(coachesPageData[0], 'title', currentLanguage)} />
        <TextBlock text={getLocalizedContent(coachesPageData[0], 'text', currentLanguage)} />
      </>
      
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
};

export default CoachesPage;