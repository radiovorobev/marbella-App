import { useEffect, useState } from "react";
import fetchProgrammesPage from "../../api/fetchProgrammesPage";
import { useLanguage } from "../../context/languageContext";
import TextBlock from "../../components/textBlock/textBlock";
import getLocalizedContent from "../../utils/getLocalizedContent";

interface ProgrammesPage {
  id: number;
  created_at: string;
  text_en: string;
  text_es: string;
  text_ru: string;
  title_en: string;
  title_es: string;
  title_ru: string;

  [key: string]: string | number | null | undefined;
}

const ProgrammesPage = () => {

  const [programmesPageData, setProgrammesPageData] = useState<ProgrammesPage[] | null>(null);

  const { currentLanguage } = useLanguage();

  useEffect (() => {
    const getProgrammesPage = async () => {
      const result = await fetchProgrammesPage();
      if (result) {
        setProgrammesPageData(result);
      }
    }
    getProgrammesPage();
  }, []);

  return (
    <main>
      {programmesPageData && programmesPageData.length > 0 ? (
        <TextBlock text={getLocalizedContent(programmesPageData[0], 'text', currentLanguage)} />
        ) : (
        <></>
        )
      } 
    </main>
  )
}

export default ProgrammesPage;