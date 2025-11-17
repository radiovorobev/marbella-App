import { useEffect, useState } from "react";
import fetchTenMonthsProgrammPage from "../../api/fetchTenMonthsProgrammPage";
import TextBlock from "../../components/textBlock/textBlock";
import { useLanguage } from "../../context/languageContext";
import getLocalizedContent from "../../utils/getLocalizedContent";
import styles from "./camps.module.css";
import SectionImage from "../../components/sectionImage/sectionImage";
import ArticleText from "../../components/articleText/articleText";
import SectionOffers from "../../components/campsOffers/sectionOffers";
import mailIcon from "../../images/buttons/mail.svg";
import whatsAppIcon from "../../images/buttons/whatsapp.svg";

interface TenMonthsProgrammPage {
  intro_en: string;
  intro_es: string | null;
  intro_ru: string | null;

  [key: string]: string | number | null | undefined;
}

const TenMonthsProgrammPage = () => {
  const [camps, setCamps] = useState<TenMonthsProgrammPage[] | null>(null);
  const { currentLanguage } = useLanguage();

  // Обработчик клика на кнопку
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/message/474IL7PF6E25O1", "_blank");
  };

  const handleEmailClick = () => {
    window.open("mailto:sport@academymarbella.com", "_blank");
  };

  useEffect(() => {
    const getProgrammPage = async () => {
      const result = await fetchTenMonthsProgrammPage();
      if (result) {
        setCamps(result);
      }
    };

    getProgrammPage();
  }, []);

  const offersImg_1 =
    "https://ffpddldovvrukcxduqgn.supabase.co/storage/v1/object/public/camps/natural_pitch_594x400.png";
  const offersImg_2 =
    "https://ffpddldovvrukcxduqgn.supabase.co/storage/v1/object/public/camps/Full_Board_594x400.png";
  const offersImg_3 =
    "https://ffpddldovvrukcxduqgn.supabase.co/storage/v1/object/public/camps/Private_transport_594x400.png";
  const offersImg_4 =
    "https://ffpddldovvrukcxduqgn.supabase.co/storage/v1/object/public/camps/Friendly_matches_594x400.png";
  const offersImg_5 =
    "https://ffpddldovvrukcxduqgn.supabase.co/storage/v1/object/public/camps/Facilities_594x400.png";
  const offersImg_6 =
    "https://ffpddldovvrukcxduqgn.supabase.co/storage/v1/object/public/camps/Video__594x400.png";
  const offersImg_7 =
    "https://ffpddldovvrukcxduqgn.supabase.co/storage/v1/object/public/camps/Neuro_594x400.jpg";

  const prepareOffersData = () => {
    if (!camps || camps.length === 0) return null;

    return {
      header: getLocalizedContent(
        camps[0],
        "first_bullets_header",
        currentLanguage,
      ),
      bullets: [
        {
          header: getLocalizedContent(
            camps[0],
            "bullit_one_header",
            currentLanguage,
          ),
          text: getLocalizedContent(
            camps[0],
            "bullit_one_text",
            currentLanguage,
          ),
          imageUrl: offersImg_1,
        },
        {
          header: getLocalizedContent(
            camps[0],
            "bullit_two_header",
            currentLanguage,
          ),
          text: getLocalizedContent(
            camps[0],
            "bullit_two_text",
            currentLanguage,
          ),
          imageUrl: offersImg_2,
        },
        {
          header: getLocalizedContent(
            camps[0],
            "bullit_three_header",
            currentLanguage,
          ),
          text: getLocalizedContent(
            camps[0],
            "bullit_three_text",
            currentLanguage,
          ),
          imageUrl: offersImg_3,
        },
        {
          header: getLocalizedContent(
            camps[0],
            "bullit_four_header",
            currentLanguage,
          ),
          text: getLocalizedContent(
            camps[0],
            "bullit_four_text",
            currentLanguage,
          ),
          imageUrl: offersImg_4,
        },
        {
          header: getLocalizedContent(
            camps[0],
            "bullit_five_header",
            currentLanguage,
          ),
          text: getLocalizedContent(
            camps[0],
            "bullit_five_text",
            currentLanguage,
          ),
          imageUrl: offersImg_5,
        },
      ],
    };
  };

  const offersData = prepareOffersData();

/*   const prepareServicesData = () => {
    if (!camps || camps.length === 0) return null;

    return {
      header: getLocalizedContent(camps[0], "services_header", currentLanguage),
      bullets: [
        {
          header: getLocalizedContent(
            camps[0],
            "bullit_six_header",
            currentLanguage,
          ),
          text: getLocalizedContent(
            camps[0],
            "bullit_six_text",
            currentLanguage,
          ),
          imageUrl: offersImg_6,
        },
        {
          header: getLocalizedContent(
            camps[0],
            "bullit_seven_header",
            currentLanguage,
          ),
          text: getLocalizedContent(
            camps[0],
            "bullit_seven_text",
            currentLanguage,
          ),
          imageUrl: offersImg_7,
        },
      ],
    };
  }; */

/*   const servicesData = prepareServicesData(); */

  const headers = {
    section_header_en: "Live football like a professional",
    section_header_es: "Vive el fútbol como un profesional",
  };

  const headers_two = {
    section_header_en: "Your season starts here!",
    section_header_es: "¡Tu temporada empieza aquí!",
  };

  return (
    <main>
      {camps && camps.length > 0 && (
        <>
          <SectionImage
            title={getLocalizedContent(camps[0], "title", currentLanguage)}
          />
          <TextBlock
            text={getLocalizedContent(camps[0], "intro", currentLanguage)}
          />
          <section className={styles.page__container}>
            <h2 className={styles.section__header}>
              {getLocalizedContent(headers, "section_header", currentLanguage)}
            </h2>
            <ArticleText
              articleText={getLocalizedContent(
                camps[0],
                "text",
                currentLanguage,
              )}
            />
            <SectionOffers aboutData={offersData} />
            {/* <SectionOffers aboutData={servicesData} /> */}
            <h2 className={styles.section__header}>
              {getLocalizedContent(
                headers_two,
                "section_header",
                currentLanguage,
              )}
            </h2>
            <ArticleText
              articleText={getLocalizedContent(
                camps[0],
                "text_contacts",
                currentLanguage,
              )}
            />
            <div className={styles.joinButtons}>
              <button className={styles.joinButton} onClick={handleEmailClick}>
                <img src={mailIcon} alt="sport@academymarbella.com" /> Email
              </button>
              <button
                className={styles.joinButton}
                onClick={handleWhatsAppClick}
              >
                <img src={whatsAppIcon} alt="WhatsApp" />
                WhatsApp
              </button>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default TenMonthsProgrammPage;
