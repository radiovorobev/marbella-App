import { useEffect, useState } from "react";
import fetchAboutPage from "../../api/fetchAboutPage";
import SectionImage from "../../components/sectionImage/sectionImage";
import { useLanguage } from "../../context/languageContext";
import getLocalizedContent from "../../utils/getLocalizedContent";
import TextBlock from "../../components/textBlock/textBlock";
import SectionAbout from "../../components/sectionAbout/sectionAbout";

interface AboutPage {
  id: number;
  created_at: string;
  
  pageTitle_en: string | null;
  pageTitle_es: string | null;
  pageTitle_ru: string | null;
  
  bullit_one_header_en: string | null;
  bullit_one_header_es: string | null;
  bullit_one_header_ru: string | null;
  bullit_one_text_en: string | null;
  bullit_one_text_es: string | null;
  bullit_one_text_ru: string | null;
  
  bullit_two_header_en: string | null;
  bullit_two_header_es: string | null;
  bullit_two_header_ru: string | null;
  bullit_two_text_en: string | null;
  bullit_two_text_es: string | null;
  bullit_two_text_ru: string | null;
  
  bullit_three_header_en: string | null;
  bullit_three_header_es: string | null;
  bullit_three_header_ru: string | null;
  bullit_three_text_en: string | null;
  bullit_three_text_es: string | null;
  bullit_three_text_ru: string | null;
  
  about_image: string | null;
  about_text_en: string | null;
  about_text_es: string | null;
  about_text_ru: string | null;
  
  [key: string]: string | number | null | undefined;
}

const AboutPage = () => {

  const [aboutPageData, setAboutPageData] = useState<AboutPage[] | null>(null);

  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const getAboutPage = async () => {
      const result = await fetchAboutPage();
      if (result) {
        setAboutPageData(result);
      }
    };
    
    getAboutPage();
  }, []);

  const prepareAboutData = () => {
    if (!aboutPageData || aboutPageData.length === 0) return null;
    
    return {
      header: getLocalizedContent(aboutPageData[0], 'about_header', currentLanguage),
      bullets: [
        {
          header: getLocalizedContent(aboutPageData[0], 'bullit_one_header', currentLanguage),
          text: getLocalizedContent(aboutPageData[0], 'bullit_one_text', currentLanguage)
        },
        {
          header: getLocalizedContent(aboutPageData[0], 'bullit_two_header', currentLanguage),
          text: getLocalizedContent(aboutPageData[0], 'bullit_two_text', currentLanguage)
        },
        {
          header: getLocalizedContent(aboutPageData[0], 'bullit_three_header', currentLanguage),
          text: getLocalizedContent(aboutPageData[0], 'bullit_three_text', currentLanguage)
        }
      ]
    };
  };

  const aboutData = prepareAboutData();

  return (
    <main>
      {aboutPageData && aboutPageData.length > 0 ? (
      <>
        <SectionImage title={getLocalizedContent(aboutPageData[0], 'pageTitle', currentLanguage)} />
        <SectionAbout aboutData={aboutData} />
        <SectionImage imageUrl={aboutPageData[0].about_image} imageAlt={'La Academia'}/>
        <TextBlock text={getLocalizedContent(aboutPageData[0], 'about_text', currentLanguage)} />
      </>

      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
};

export default AboutPage;