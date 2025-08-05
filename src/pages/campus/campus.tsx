import { useEffect, useState } from "react";
import fetchCampusPage from "../../api/fetchCampusPage";
import TextBlock from "../../components/textBlock/textBlock";
import { useLanguage } from "../../context/languageContext";
import getLocalizedContent from "../../utils/getLocalizedContent";
import styles from './Campus.module.css';
import SectionImage from "../../components/sectionImage/sectionImage";
import PriceList from "../../components/priceList/priceList";
import Loader from "../../components/loader/loader";
import FourCards from "../../components/fourCards/fourCards";
import ContentCard from "../../components/contentCard/contentCard";
import GoalsBlock from "../../components/goalsBlock/goalsBlock";
import RoleSelector from "../../components/roleSelector/roleSelector";

interface ExtraItem {
  text: string;
  price: string;
}

// Обновленный интерфейс, где discount может быть числом или строкой
interface DiscountItem {
  text: string;
  discount: number | string;
}

interface ProgramCard {
  id: number;
  title: string;
  tags: string[];
  price: number;
  content: string[];
  note: string | null;
}

interface GoalSubsection {
  title: string;
  items: string[];
}

interface GoalSection {
  sectionTitle: string;
  items?: string[];
  subsections?: GoalSubsection[];
}

interface CampusPage {
  id: number;
  title_en: string;
  title_es: string | null;
  title_ru: string | null;
  intro_en: string;
  intro_es: string | null;
  intro_ru: string | null;
  text_en: string;
  text_es: string | null;
  text_ru: string | null;
  campus_image: string | null;
  extras_en: ExtraItem[];
  extras_es: ExtraItem[] | null;
  extras_ru: ExtraItem[] | null;
  discounts_en: DiscountItem[];
  discounts_es: DiscountItem[] | null;
  discounts_ru: DiscountItem[] | null;
  cards_en: ProgramCard[];
  cards_ru: ProgramCard[] | null;
  cards_es: ProgramCard[] | null;
  goals_en: GoalSection[] | null;
  goals_es: GoalSection[] | null;
  goals_ru: GoalSection[] | null;

  [key: string]: any; // Для динамического доступа через getLocalizedContent
}

const CampusPage = () => {
  const [campus, setCampus] = useState<CampusPage[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const getCampusPage = async () => {
      try {
        setLoading(true);
        const result = await fetchCampusPage();
        if (result && result.length > 0) {
          setCampus(result);
          setError(null);
        } else {
          setError("No campus data available");
        }
      } catch (err) {
        console.error("Error fetching campus data:", err);
        setError("Failed to load campus information");
      } finally {
        setLoading(false);
      }
    };

    getCampusPage();
  }, []);

  // Функция для получения локализованного заголовка для PriceList
  const getExtrasTitle = () => {
    switch (currentLanguage) {
      case 'es':
        return 'Adicionales';
      case 'ru':
        return 'Дополнительные услуги';
      default:
        return 'Extras';
    }
  };
  
  // Функция для получения локализованного заголовка для Discounts
  const getDiscountsTitle = () => {
    switch (currentLanguage) {
      case 'es':
        return 'Descuentos';
      case 'ru':
        return 'Скидки';
      default:
        return 'Discounts';
    }
  };
  
  // Функция для получения локализованного заголовка для Programs
  const getProgramsTitle = () => {
    switch (currentLanguage) {
      case 'es':
        return 'Programas del campamento';
      case 'ru':
        return 'Программы лагеря';
      default:
        return 'Camp programs';
    }
  };

  // Функция для получения массива extras в зависимости от языка
  const getLocalizedExtras = (data: CampusPage): ExtraItem[] | null => {
    const langKey = currentLanguage === 'en' ? 'en' : 
                    currentLanguage === 'es' ? 'es' : 
                    currentLanguage === 'ru' ? 'ru' : 'en';
    
    const extrasKey = `extras_${langKey}` as keyof CampusPage;
    
    // Если данные для текущего языка отсутствуют, используем английские
    return data[extrasKey] as ExtraItem[] || data.extras_en;
  };
  
  // Функция для получения массива discounts в зависимости от языка
  const getLocalizedDiscounts = (data: CampusPage): DiscountItem[] | null => {
    const langKey = currentLanguage === 'en' ? 'en' : 
                    currentLanguage === 'es' ? 'es' : 
                    currentLanguage === 'ru' ? 'ru' : 'en';
    
    const discountsKey = `discounts_${langKey}` as keyof CampusPage;
    
    // Если данные для текущего языка отсутствуют, используем английские
    return data[discountsKey] as DiscountItem[] || data.discounts_en;
  };
  
  // Функция для получения массива cards в зависимости от языка
  const getLocalizedCards = (data: CampusPage): ProgramCard[] | null => {
    const langKey = currentLanguage === 'en' ? 'en' : 
                    currentLanguage === 'es' ? 'es' : 
                    currentLanguage === 'ru' ? 'ru' : 'en';
    
    const cardsKey = `cards_${langKey}` as keyof CampusPage;
    
    // Если данные для текущего языка отсутствуют, используем английские
    return data[cardsKey] as ProgramCard[] || data.cards_en;
  };
  
  // Функция для преобразования скидок в карточки для FourCards
  const prepareDiscountCards = (discounts: DiscountItem[]) => {
    return discounts.map((item, index) => ({
      id: index,
      headerText: `<strong>${item.discount}%</strong>`,
      text: item.text
    }));
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !campus || campus.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error || "No campus information available"}</p>
      </div>
    );
  }

  const campusData = campus[0];
  const extrasData = getLocalizedExtras(campusData);
  const discountsData = getLocalizedDiscounts(campusData);
  const programCards = getLocalizedCards(campusData);

  return (
    <main className={styles.campusPage}>
      {/* Заголовок и первое изображение */}
      <SectionImage 
        title={getLocalizedContent(campusData, 'title', currentLanguage)} 
      />
      
      {/* Вводный текст */}
      <TextBlock 
        text={getLocalizedContent(campusData, 'intro', currentLanguage)} 
      />

      {/* Карточки программ */}
      {programCards && programCards.length > 0 && (
        <section className={styles.sectionCards}>
          <h2 className={styles.cardsTitle}>{getProgramsTitle()}</h2>
          <div className={styles.cardsContainer}>
            {programCards.map((card) => (
              <ContentCard key={card.id} card={card} />
            ))}
          </div>
        </section>
      )}
      
      {/* Основной текст, если он есть */}
      {getLocalizedContent(campusData, 'text', currentLanguage) && (
        <TextBlock 
          text={getLocalizedContent(campusData, 'text', currentLanguage)} 
        />
      )}
      
      {/* Список дополнительных услуг */}
      {extrasData && extrasData.length > 0 && (
        <PriceList 
          extras={extrasData}
          title={getExtrasTitle()}
        />
      )}

      {/* Список скидок */}
      {discountsData && discountsData.length > 0 && (
        <FourCards
          cards={prepareDiscountCards(discountsData)}
          title={campusData.discounts_title || getDiscountsTitle()}
        />
      )}
      
      {/* Изображение кампуса */}
      {campusData.campus_image && (
        <SectionImage 
          imageUrl={campusData.campus_image} 
          imageAlt={'La Academia Campus'} 
        />
      )}

      {campusData.goals_en && (
        <GoalsBlock goals={campusData[`goals_${currentLanguage}`] || campusData.goals_en || []} />
      )}

      <RoleSelector />

    </main>
  );
};

export default CampusPage;
