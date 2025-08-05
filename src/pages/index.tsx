import { useEffect, useState } from "react";
import Gallery from "../components/gallery/gallery";
import IndexNews from "../components/indexNews/indexNews";
import SectionAbout from "../components/sectionAbout/sectionAbout";
import SectionImage from "../components/sectionImage/sectionImage";
import { useLanguage } from "../context/languageContext";
import fetchIndexPage from "../api/fetchIndexPage";
import getLocalizedContent from "../utils/getLocalizedContent";
import Partners from "../components/partners/partners"; 

interface IndexPage {
  id: number;
  created_at: string;
  
  // Page title
  page_title_en: string | null;
  page_title_es: string | null;
  page_title_ru: string | null;
  
  // About section
  about_header_en: string | null;
  about_header_es: string | null;
  about_header_ru: string | null;
  
  // Bullet one
  bullit_one_header_en: string | null;
  bullit_one_header_es: string | null;
  bullit_one_header_ru: string | null;
  bullit_one_text_en: string | null;
  bullit_one_text_es: string | null;
  bullit_one_text_ru: string | null;
  
  // News section
  news_header_en: string | null;
  news_header_es: string | null;
  news_header_ru: string | null;
  
  // Gallery section
  gallery_header_en: string | null;
  gallery_header_es: string | null;
  gallery_header_ru: string | null;
  
  // Bullet two
  bullit_two_header_en: string | null;
  bullit_two_header_es: string | null;
  bullit_two_header_ru: string | null;
  bullit_two_text_en: string | null;
  bullit_two_text_es: string | null;
  bullit_two_text_ru: string | null;
  
  // Bullet three
  bullit_three_header_en: string | null;
  bullit_three_header_es: string | null;
  bullit_three_header_ru: string | null;
  bullit_three_text_en: string | null;
  bullit_three_text_es: string | null;
  bullit_three_text_ru: string | null;
  
  // Add index signature for getLocalizedContent compatibility
  [key: string]: string | number | null | undefined;
 }

const IndexPage = () => {

  const [indexPageData, setindexPageData] = useState<IndexPage[] | null>(null);

  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const getIndexPage = async () => {
      const result = await fetchIndexPage();
      if (result) {
        setindexPageData(result);
      }
    };
    
    getIndexPage();
  }, []);

  const prepareAboutData = () => {
    if (!indexPageData || indexPageData.length === 0) return null;
    
    return {
      header: getLocalizedContent(indexPageData[0], 'about_header', currentLanguage),
      bullets: [
        {
          header: getLocalizedContent(indexPageData[0], 'bullit_one_header', currentLanguage),
          text: getLocalizedContent(indexPageData[0], 'bullit_one_text', currentLanguage)
        },
        {
          header: getLocalizedContent(indexPageData[0], 'bullit_two_header', currentLanguage),
          text: getLocalizedContent(indexPageData[0], 'bullit_two_text', currentLanguage)
        },
        {
          header: getLocalizedContent(indexPageData[0], 'bullit_three_header', currentLanguage),
          text: getLocalizedContent(indexPageData[0], 'bullit_three_text', currentLanguage)
        }
      ]
    };
  };

  const aboutData = prepareAboutData();

  return (
    <main>
      {indexPageData && indexPageData.length > 0 ? (
      <>
        <SectionImage title={getLocalizedContent(indexPageData[0], 'page_title', currentLanguage)} />
        <SectionAbout aboutData={aboutData} />
        <IndexNews />
        <Partners />
        <Gallery />
      </>
      
      ) : (
        <div>Loading...</div>
      )}

  </main>
  );
};

export default IndexPage;