import { useEffect, useState } from "react";
import fetchTenMonthsProgrammPage from "../../api/fetchTenMonthsProgrammPage";
import TextBlock from "../../components/textBlock/textBlock";
import { useLanguage } from "../../context/languageContext";
import getLocalizedContent from "../../utils/getLocalizedContent";
import styles from "./tenMonths.module.css";
import SectionImage from "../../components/sectionImage/sectionImage";
import ArticleText from "../../components/articleText/articleText";
import SectionOffers from "../../components/campsOffers/sectionOffers";
import mailIcon from "../../images/buttons/email_icon.svg";
import whatsAppIcon from "../../images/buttons/whatsapp_icon.svg";
import downloadIcon from "../../images/buttons/download_icon.svg";
import durationBackground from "../../images/tenMonth/program_duration_background.jpeg";
import packageImg_1 from "../../images/tenMonth/package_img_1.jpg";
import highSchoolImg_1 from "../../images/tenMonth/VisualCognitiveTr.jpg";
import gapImg_1 from "../../images/tenMonth/gapYear_1.jpg";
import gapImg_2 from "../../images/tenMonth/gapYear_2.jpg";
import fieldImg from "../../images/tenMonth/field.jpg";
import residenceBackground from "../../images/tenMonth/10-Months Dossier_USA_Inturjoven_page0_imagevfcv 1.jpg";
import packageImg_2 from "../../images/tenMonth/package_img_2.jpg";
import packageImg_3 from "../../images/tenMonth/package_img_3.jpg";
import acScholarshipsLogo from "../../images/tenMonth/AC_SA.png";
import keiserUniversityLogo from "../../images/tenMonth/Keiser_Univ.png";
import americanCollegeLogo from "../../images/tenMonth/TheAmericanCollege.png";
import carlosCasquero from "../../images/tenMonth/carlos_casquero.jpeg";
import maksKalin from "../../images/tenMonth/maksim_kalinichenko.jpeg";
import germanRuiz from "../../images/tenMonth/german_ruiz.jpeg";
import tacticalIcon from "../../images/tenMonth/tactical_icon.svg";
import technicalIcon from "../../images/tenMonth/technical_icon.svg";
import conditioningIcon from "../../images/tenMonth/conditioning_icon.svg";
import mentalIcon from "../../images/tenMonth/mental_icon.svg";
import torremolinosLogo from "../../images/tenMonth/Torremolinos.png";
import ceutaLogo from "../../images/tenMonth/Ceuta.png";
import granadaLogo from "../../images/tenMonth/Granada.png";
import malagaLogo from "../../images/tenMonth/Malaga.png";
import realBetisLogo from "../../images/tenMonth/Real.png";
import cadizLogo from "../../images/tenMonth/Cadiz.png";

interface TenMonthsProgrammPage {
  intro_en: string;
  intro_es: string | null;
  intro_ru: string | null;

  [key: string]: string | number | null | undefined;
}

const PROGRAM_PDF_URL =
  "https://ffpddldovvrukcxduqgn.supabase.co/storage/v1/object/public/10months/10-months-progam-Academy-Marbella.pdf";
const TRAIN_VIDEO_EMBED_URL =
  "https://www.youtube-nocookie.com/embed/dfRFUv4QlZw?rel=0";

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

  const handleDownloadClick = () => {
    const link = document.createElement("a");
    link.href = PROGRAM_PDF_URL;
    link.download = "10-months-progam-Academy-Marbella.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    "https://ffpddldovvrukcxduqgn.supabase.co/storage/v1/object/public/10months/train_549x400.jpg";
  const offersImg_2 =
    "https://ffpddldovvrukcxduqgn.supabase.co/storage/v1/object/public/10months/competition_549x400.jpg";
  const offersImg_3 =
    "https://ffpddldovvrukcxduqgn.supabase.co/storage/v1/object/public/10months/developement_549x400.jpg";
  const offersImg_4 =
    "https://ffpddldovvrukcxduqgn.supabase.co/storage/v1/object/public/10months/hotel_549x400.jpg";
  const offersImg_5 =
    "https://ffpddldovvrukcxduqgn.supabase.co/storage/v1/object/public/10months/scholarship_549x400.jpg";

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
    section_header_en: "Download our program here",
    section_header_es: "Descarga el programa aquí",
  };

  const headers_three = {
    section_subheader_en: "Program Start",
    section_subheader_es: "Inicio del programa",
  };

  const playerPackageCards = [
    {
      title: "Academic & training",
      bullets: [
        "Daily academic support (depending on selected program)",
        "Daily training sessions at the academy focused on individual improvement, led by UEFA-licensed coaches and former professional players",
        "Contract with a local team to compete in Spanish leagues",
      ],
    },
    {
      title: "Residential & support",
      bullets: [
        "10-month stay at Inturjoven Marbella with full board",
        "Individual room accommodation",
        "Supervised residential environment",
        "Common study and leisure areas",
        "Dedicated on-site coordinator",
      ],
    },
    {
      title: "Logistics & administration",
      bullets: [
        "Management of residency paperwork for Spain",
        "Airport transfer on arrival",
        "Daily transportation to training sessions",
      ],
    },
    {
      title: "Health & security",
      bullets: ["Health insurance included"],
    },
  ];

  const playerPackagePrices = [
    {
      price: "€29.900",
      description: "With English & Spanish Language Studies",
      highlighted: false,
      badge: "",
    },
    {
      price: "€39.900",
      description: "With Keiser University/American College",
      highlighted: true,
      badge: "PRO PATH",
    },
  ];

  const exposureClubs = [
    {
      key: "torremolinos",
      logoSrc: torremolinosLogo,
      nameLines: ["Torremolinos CF"],
    },
    {
      key: "ceuta",
      logoSrc: ceutaLogo,
      nameLines: ["Ceuta CF"],
    },
    {
      key: "granada",
      logoSrc: granadaLogo,
      nameLines: ["Granada CF"],
    },
    {
      key: "malaga",
      logoSrc: malagaLogo,
      nameLines: ["Malaga CF"],
    },
    {
      key: "betis",
      logoSrc: realBetisLogo,
      nameLines: ["Real Betis", "Balompie"],
    },
    {
      key: "cadiz",
      logoSrc: cadizLogo,
      nameLines: ["Cadiz CF"],
    },
  ];

  const exposureCtas = [
    {
      title: "See trainings",
      buttonText: "View video",
      href: "https://www.instagram.com/reel/DL6i-Ujp0LP/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA%3D%3D",
    },
    {
      title: "See match ups",
      buttonText: "View video",
      href: "https://www.instagram.com/reel/DQ4w1rSEahZ/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA%3D%3D",
    },
  ];

  const exposureOverviewCards = [
    {
      title: "Season structure",
      text: "Throughout the season, players are fully integrated into the Spanish football ecosystem, combining league competition, showcase matches, and continuous trials in professional environments.",
    },
    {
      title: "Club placement",
      text: "Players are assigned to regional clubs to compete in official Spanish leagues, while also participating in friendly matches and evaluation sessions organized with professional academies and clubs.",
    },
    {
      title: "Consistent exposure",
      text: "This structure applies to both High School and Gap Year players, ensuring consistent exposure based on each player's profile, age, and performance level.",
    },
  ];

  const gapYearCards = [
    {
      title: "Football-focused development",
      text: "A football-focused development year designed for players seeking professional or semi-professional progression.",
      bullets: [],
      fullWidth: false,
    },
    {
      title: "Training & academic support",
      text: "",
      bullets: [
        "Spanish language academic program",
        "Daily high-performance training with La Academia",
      ],
      fullWidth: false,
    },
    {
      title: "Professional club integration",
      text: "Integration into professional or semi-professional clubs competing in 3a RFEF or 2a RFEF, depending on player profile and performance",
      bullets: [],
      fullWidth: true,
    },
  ];

  const gapYearPrices = [
    {
      price: "€29.900",
      description: "With English & Spanish Language Studies",
      highlighted: false,
      badge: "",
    },
    {
      price: "€39.900",
      description: "With Keiser University",
      highlighted: true,
      badge: "PRO PATH",
    },
  ];

  const highSchoolCards = [
    {
      title: "Academic pathway",
      text: "",
      bullets: [
        "Players continue their High School education while living and training in Spain for 10 months.",
        "High School studies with American credits fully transferable to their home country",
      ],
    },
    {
      title: "Football development",
      text: "",
      bullets: [
        "Daily training with La Academia on natural grass, led by professional coaches",
        "Integration into a Spanish club to compete in official leagues",
      ],
    },
    {
      title: "Full boarding",
      text: "",
      bullets: ["Full-board accommodation with individual room"],
    },
    {
      title: "U.S. College scholarship guarantee",
      text: "At the end of the program, if players do not continue professionally in Spain, we secure a U.S. college scholarship, significantly reducing the cost of their American college career",
      bullets: [],
    },
  ];

  const highSchoolPrices = [
    {
      price: "€29.900",
      description: "With English & Spanish Language Studies",
      highlighted: false,
      badge: "",
    },
    {
      price: "€39.900",
      description: "With American College",
      highlighted: true,
      badge: "PRO PATH",
    },
  ];

  const methodologyPeople = [
    {
      name: "CARLOS CASQUERO",
      imageSrc: carlosCasquero,
      imageAlt: "CARLOS CASQUERO",
    },
    {
      name: "MAKSÍM KALINICHENKO",
      imageSrc: maksKalin,
      imageAlt: "MAKSÍM KALINICHENKO",
    },
    {
      name: "GERMÁN RUIZ",
      imageSrc: germanRuiz,
      imageAlt: "GERMÁN RUIZ",
    },
  ];

  const methodologyCards = [
    {
      title: "Leadership",
      subtitle: "UEFA-Certified Coaching Team",
      text: "Our academy is led by a team of highly qualified, UEFA-certified coaches and former professional players, who bring their expertise in both youth development and competitive football.",
    },
    {
      title: "Daily training model",
      subtitle: "Technical Development System",
      text: "Each day, players engage in technical training sessions designed to improve individual skills with the ball through high-intensity drills, strategic exercises, and game-like simulations that foster mastery and confidence on the pitch.",
    },
  ];

  const philosophyCards = [
    {
      iconSrc: tacticalIcon,
      title: "Tactical training",
      text: "Game intelligence, transitions, defensive/offensive systems",
    },
    {
      iconSrc: technicalIcon,
      title: "Technical drills:",
      text: "Control, passing, finishing, 1v1, aerial duels",
    },
    {
      iconSrc: conditioningIcon,
      title: "Conditioning:",
      text: "Agility, strength, mobility, endurance",
    },
    {
      iconSrc: mentalIcon,
      title: "Mental performance:",
      text: "Resilience, decision-making, leadership",
    },
  ];

  const collaborationPartners = [
    {
      key: "american_college",
      title: "The American College in Spain",
      imageSrc: americanCollegeLogo,
      imageAlt: "The American College in Spain",
    },
    {
      key: "ac_scholarships",
      title: "AC Scholarships Agency",
      imageSrc: acScholarshipsLogo,
      imageAlt: "AC Scholarships Agency",
    },
    {
      key: "keiser",
      title: "Keiser University",
      imageSrc: keiserUniversityLogo,
      imageAlt: "Keiser University",
    },
  ];

  const durationPrograms = [
    {
      title: "10 months",
      subtitle: "football program",
      pricePrefix: "",
      price: "2990€",
      priceSuffix: "month",
      badgeTitle: "ACADEMIC PATHWAY",
      badgeText: "3990€ per month",
      summary: `Total:
29.900€ per season
39.900€ Academic Path included`,
      details:
        "Complete development pathway Full season most popular program All-inclusive: training, accommodation & full support",
    },
    {
      title: "6 months",
      subtitle: "football program",
      pricePrefix: "",
      price: "3000€",
      priceSuffix: "month",
      badgeTitle: "Total:",
      badgeText: "18.000€ per 6 months",
      summary: "",
      details:
        "Mid-term performance pathway All-inclusive: training, accommodation & full support",
    },
    {
      title: "2 months",
      subtitle: "football program",
      pricePrefix: "starting from",
      price: "3400€",
      priceSuffix: "month",
      badgeTitle: "",
      badgeText:
        "Final price may vary depending on the selected dates and accommodation availability",
      summary: "",
      details:
        "Build consistency & confidence All-inclusive: training, accommodation & full support",
    },
    {
      title: "1 month",
      subtitle: "football program",
      pricePrefix: "starting from",
      price: "3500€",
      priceSuffix: "month",
      badgeTitle: "",
      badgeText:
        "Final price may vary depending on the selected dates and accommodation availability",
      summary: "",
      details:
        "Short-term intensive experience All-inclusive: training, accommodation & full support",
    },
  ];

  return (
    <main>
      {camps && camps.length > 0 && (
        <>
          <SectionImage
            title={getLocalizedContent(camps[0], "title", currentLanguage)}
          />
        {/*
          <TextBlock
            text={getLocalizedContent(camps[0], "intro", currentLanguage)}
          />

*/}
{/*           <section className={styles.page__container}>
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
        <SectionOffers aboutData={servicesData} /> 
            <h2 className={`${styles.section__header} ${styles.section__header_center}`}>
              <a href="https://ffpddldovvrukcxduqgn.supabase.co/storage/v1/object/public/10months/10-months-progam-Academy-Marbella.pdf
" target="_blank" rel="noopener noreferrer">
              {getLocalizedContent(
                headers_two,
                "section_header",
                currentLanguage,
              )}
                </a>
            </h2>
          
              <h3 className={styles.section__subheader}>
                {getLocalizedContent(
                  headers_three,
                  "section_subheader",
                  currentLanguage,
                )}
              </h3>
            
            <ArticleText
              articleText={getLocalizedContent(
                camps[0],
                "text_contacts",
                currentLanguage,
              )}
              backgroundColor="#f2f2f7"
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
          </section> */}
   
          {/* Train live and compete & video*/}
          <section className={styles.trainVideoSection}>
            <div className={styles.trainVideoInner}>
              <h2 className={styles.trainVideoTitle}>
                <span className={styles.trainVideoTitleRed}>Train.</span> live.
                <br />
                compete.
              </h2>
              <div className={styles.trainVideoCard}>
                <iframe
                  className={styles.trainVideoFrame}
                  src={TRAIN_VIDEO_EMBED_URL}
                  title="Academy Marbella training video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </section>
          {/* Methodlogy & goals */}
          <section className={styles.methodologySection}>
            <div className={styles.methodologyInner}>
              <h2 className={styles.methodologyTitle}>Methodology & goals</h2>
              <div className={styles.methodologyPeopleGrid}>
                {methodologyPeople.map((person) => (
                  <article key={person.name} className={styles.methodologyPerson}>
                    <img
                      className={styles.methodologyPersonImage}
                      src={person.imageSrc}
                      alt={person.imageAlt}
                    />
                    <div className={styles.methodologyPersonName}>
                      {person.name}
                    </div>
                  </article>
                ))}
              </div>
              <div className={styles.methodologyPattern} aria-hidden="true" />
              <div className={styles.methodologyCards}>
                {methodologyCards.map((card) => (
                  <article key={card.title} className={styles.methodologyCard}>
                    <h3 className={styles.methodologyCardTitle}>{card.title}</h3>
                    <p className={styles.methodologyCardSubtitle}>
                      {card.subtitle}
                    </p>
                    <p className={styles.methodologyCardText}>{card.text}</p>
                  </article>
                ))}
              </div>
              <div
                className={`${styles.methodologyPattern} ${styles.methodologyPatternBottom}`}
                aria-hidden="true"
              />
            </div>
          </section>
          {/* La Academia philosophy */}
          <section className={styles.philosophySection}>
            <div className={styles.philosophyInner}>
              <p className={styles.philosophyMission}>
                Our mission is to develop <strong>well-rounded players</strong>{" "}
                through a methodology that integrates:{" "}
                <strong>technical precision</strong> •{" "}
                <strong>tactical understanding</strong> •{" "}
                <strong>physical performance</strong> •{" "}
                <strong>mental resilience</strong>.
              </p>
              <h2 className={styles.philosophyTitle}>La Academia philosophy</h2>
              <div className={styles.philosophyGrid}>
                {philosophyCards.map((card) => (
                  <article key={card.title} className={styles.philosophyCard}>
                    <div className={styles.philosophyCardHeader}>
                      <span className={styles.philosophyIcon}>
                        <img src={card.iconSrc} alt="" aria-hidden="true" />
                      </span>
                      <h3 className={styles.philosophyCardTitle}>{card.title}</h3>
                    </div>
                    <p className={styles.philosophyCardText}>{card.text}</p>
                  </article>
                ))}
              </div>
              <p className={styles.philosophyFooter}>
                <span>
                  We foster values like teamwork, discipline, effort, respect, and
                  autonomy
                </span>{" "}
                the cornerstones of both football and life.
              </p>
            </div>
          </section>
          {/* Collaboration section */}
          <section className={styles.collaborationSection}>
            <div className={styles.collaborationInner}>
              <h2 className={styles.collaborationTitle}>Collaboration</h2>
              <h3 className={styles.collaborationSubtitle}>
                University education
              </h3>
              <p className={styles.collaborationText}>
                Supporting High School education, U.S. credit transfer, and
                college progression pathways.
                <br />
                In collaboration with:
              </p>
              <div className={styles.collaborationPanel}>
                {collaborationPartners.map((partner) => (
                  <article
                    key={partner.key}
                    className={styles.collaborationPartner}
                  >
                    <img
                      className={styles.collaborationPartnerImage}
                      src={partner.imageSrc}
                      alt={partner.imageAlt}
                    />
                  </article>
                ))}
              </div>
            </div>
          </section>
          {/* High school program */}
          <section className={styles.schoolSection}>
            <div className={styles.schoolInner}>
              <div className={styles.schoolHero}>
                <div className={styles.schoolHeroContent}>
                  <h2 className={styles.schoolTitle}>High school program</h2>
                  <div className={styles.schoolBadgeRow}>
                    <span className={styles.schoolBadge}>10 months</span>
                    <span className={styles.schoolAge}>(Ages 16-18)</span>
                  </div>
                </div>
                <div className={styles.schoolHeroImages}>
                  <div className={styles.schoolWideImage}>
                    <img
                      src={packageImg_3}
                      alt="Student accommodation room"
                    />
                  </div>
                  <div className={styles.schoolTallImage}>
                    <img
                      src={highSchoolImg_1}
                      alt="High school football player training"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.schoolDivider} />
              <div className={styles.schoolCards}>
                {highSchoolCards.map((card) => (
                  <article key={card.title} className={styles.schoolCard}>
                    <div className={styles.schoolCardHeader}>
                      <span className={styles.schoolCardAccent} />
                      <h3 className={styles.schoolCardTitle}>{card.title}</h3>
                    </div>
                    {card.text && (
                      <p className={styles.schoolCardText}>{card.text}</p>
                    )}
                    {card.bullets.length > 0 && (
                      <ul className={styles.schoolCardList}>
                        {card.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
              <div className={styles.schoolPrices}>
                {highSchoolPrices.map((item) => (
                  <article
                    key={item.price}
                    className={`${styles.schoolPriceCard} ${
                      item.highlighted ? styles.schoolPriceCardHighlighted : ""
                    }`}
                  >
                    {item.badge && (
                      <span className={styles.schoolPriceBadge}>{item.badge}</span>
                    )}
                    <p className={styles.schoolPriceValue}>{item.price}</p>
                    <p className={styles.schoolPriceDescription}>
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
          {/* Gap year program or university degree*/}
          <section className={styles.gapSection}>
            <div className={styles.gapInner}>
              <div className={styles.gapHero}>
                <div className={styles.gapHeroContent}>
                  <h2 className={styles.gapTitle}>
                    Gap year program or university degree
                  </h2>
                  <div className={styles.gapBadgeRow}>
                    <span className={styles.gapBadge}>10 months</span>
                    <span className={styles.gapAge}>(Age 18+)</span>
                  </div>
                </div>
                <div className={styles.gapHeroImages}>
                  <div className={styles.gapWideImage}>
                    <img
                      src={gapImg_2}
                      alt="Training session on the football field"
                    />
                  </div>
                  <div className={styles.gapTallImage}>
                    <img
                      src={gapImg_1}
                      alt="Player development session"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.gapDivider} />
              <div className={styles.gapCards}>
                {gapYearCards.map((card) => (
                  <article
                    key={card.title}
                    className={`${styles.gapCard} ${
                      card.fullWidth ? styles.gapCardFull : ""
                    }`}
                  >
                    <div className={styles.gapCardHeader}>
                      <span className={styles.gapCardAccent} />
                      <h3 className={styles.gapCardTitle}>{card.title}</h3>
                    </div>
                    {card.text && <p className={styles.gapCardText}>{card.text}</p>}
                    {card.bullets.length > 0 && (
                      <ul className={styles.gapCardList}>
                        {card.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
              <div className={styles.gapPrices}>
                {gapYearPrices.map((item) => (
                  <article
                    key={item.price}
                    className={`${styles.gapPriceCard} ${
                      item.highlighted ? styles.gapPriceCardHighlighted : ""
                    }`}
                  >
                    {item.badge && (
                      <span className={styles.gapPriceBadge}>{item.badge}</span>
                    )}
                    <p className={styles.gapPriceValue}>{item.price}</p>
                    <p className={styles.gapPriceDescription}>
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
          {/* Professional exposure & club integration */}
          <section className={styles.exposureSection}>
            <div className={styles.exposureInner}>
              <div className={styles.exposureOverview}>
                <h2 className={styles.exposureTitle}>
                  Professional exposure & club integration
                </h2>
                <div className={styles.exposureOverviewCards}>
                  {exposureOverviewCards.map((card) => (
                    <article
                      key={card.title}
                      className={styles.exposureOverviewCard}
                    >
                      <div className={styles.exposureOverviewHeader}>
                        <span className={styles.exposureOverviewAccent} />
                        <h3 className={styles.exposureOverviewTitle}>
                          {card.title}
                        </h3>
                      </div>
                      <p className={styles.exposureOverviewText}>{card.text}</p>
                    </article>
                  ))}
                </div>
                <div className={styles.exposureOverviewImageWrap}>
                  <img
                    className={styles.exposureOverviewImage}
                    src={fieldImg}
                    alt="Football training field"
                  />
                </div>
              </div>
              <h2 className={styles.exposureLead}>
                Professional exposure includes opportunities with clubs such as:
              </h2>
              <div className={styles.exposureGrid}>
                {exposureClubs.map((club) => (
                  <article key={club.key} className={styles.exposureClub}>
                    <div className={styles.exposureLogoWrap}>
                      <img
                        className={styles.exposureLogo}
                        src={club.logoSrc}
                        alt={`${club.nameLines.join(" ")} logo`}
                      />
                    </div>
                    <div className={styles.exposureNameCard}>
                      {club.nameLines.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <div className={styles.exposureActions}>
                {exposureCtas.map((cta) => (
                  <div key={cta.title} className={styles.exposureAction}>
                    <p className={styles.exposureActionTitle}>{cta.title}</p>
                    <a
                      className={styles.exposureActionButton}
                      href={cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {cta.buttonText}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* Inturjoven Marbella residence */}
          <section className={styles.residenceSection}>
            <div
              className={styles.residenceHero}
              style={{ backgroundImage: `url(${residenceBackground})` }}
            >
              <div
                className={styles.residenceHeroOverlay}
                aria-hidden="true"
              />
              <div className={styles.residenceCopy}>
                <h2 className={styles.residenceTitle}>
                  Inturjoven Marbella Residence
                </h2>
                <p className={styles.residenceText}>
                  Inturjoven Marbella offers a safe, comfortable, and
                  well-structured residential environment designed specifically
                  for <strong>young students and athletes.</strong>
                  <br />
                  Located in Marbella, the residence provides full-board
                  accommodation in individual rooms, shared common areas, and{" "}
                  <strong>supervised facilities</strong> that support both daily
                  routines and personal development.
                </p>
              </div>
            </div>
          </section>
          {/* Player package offer includes */}
          <section className={styles.packageSection}>
            <div className={styles.packageInner}>
              <div className={styles.packageGallery}>
                <h2 className={`${styles.section__header} ${styles.packageTitle}`}>
                  Player package offer includes
                </h2>
                <div className={styles.packageGalleryWide}>
                  <img src={packageImg_2} alt="Academy facilities" />
                </div>
                <div className={styles.packageGalleryTall}>
                  <img src={packageImg_1} alt="Football training session" />
                </div>
                <div className={styles.packageGalleryRoom}>
                  <img src={packageImg_3} alt="Residential accommodation" />
                </div>
              </div>
              <div className={styles.packageDivider} />
              <div className={styles.packageCards}>
                {playerPackageCards.map((card) => (
                  <article key={card.title} className={styles.packageCard}>
                    <div className={styles.packageCardHeader}>
                      <span className={styles.packageCardAccent} />
                      <h3 className={styles.packageCardTitle}>{card.title}</h3>
                    </div>
                    <ul className={styles.packageCardList}>
                      {card.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
              <div className={styles.packagePrices}>
                {playerPackagePrices.map((item) => (
                  <article
                    key={item.price}
                    className={`${styles.packagePriceCard} ${
                      item.highlighted ? styles.packagePriceCardHighlighted : ""
                    }`}
                  >
                    {item.badge && (
                      <span className={styles.packagePriceBadge}>{item.badge}</span>
                    )}
                    <p className={styles.packagePriceValue}>{item.price}</p>
                    <p className={styles.packagePriceDescription}>
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
          {/* Choose your program duration */}

          <section className={styles.durationSection}>
            <div className={styles.durationBackgroundSticky} aria-hidden="true">
              <div
                className={styles.durationBackground}
                style={{ backgroundImage: `url(${durationBackground})` }}
              />
            </div>
            <div className={styles.durationContent}>
              <div className={styles.durationInner}>
                <h2
                  className={`${styles.section__header} ${styles.section__header_center} ${styles.durationTitle}`}
                >
                  Choose your program duration
                </h2>
                <div className={styles.durationGrid}>
                  {durationPrograms.map((program) => (
                    <article key={program.title} className={styles.durationCard}>
                      <div className={styles.durationCardTop}>
                        <h3 className={styles.durationCardTitle}>{program.title}</h3>
                        <p className={styles.durationCardSubtitle}>
                          {program.subtitle}
                        </p>
                      </div>
                      <div className={styles.durationPrice}>
                        {program.pricePrefix && (
                          <span className={styles.durationPricePrefix}>
                            {program.pricePrefix}
                          </span>
                        )}
                        <span className={styles.durationPriceValue}>
                          {program.price}
                        </span>
                        <span className={styles.durationPriceSuffix}>
                          {program.priceSuffix}
                        </span>
                      </div>
                      <div className={styles.durationBadge}>
                        {program.badgeTitle && (
                          <span className={styles.durationBadgeTitle}>
                            {program.badgeTitle}
                          </span>
                        )}
                        <span className={styles.durationBadgeText}>
                          {program.badgeText}
                        </span>
                      </div>
                      {program.summary && (
                        <p className={styles.durationSummary}>{program.summary}</p>
                      )}
                      <p className={styles.durationDetails}>{program.details}</p>
                    </article>
                  ))}
                </div>
              </div>
              <div className={styles.redLine}>
                <span>
                  From short-term training experiences to a full-season development pathway, choose the program that best fits your goals.
                </span>
              </div>
            </div>
          </section>
          {/* Program start */}
          <section className={styles.page__container}>
              <div className={styles.buttons}>
                <button className={styles.button} onClick={handleDownloadClick}>
                  <img src={downloadIcon} alt="Download program" /> Download program
                </button>
            </div>
            <h2 className={`${styles.section__header} ${styles.section__header_center} ${styles.section__header_center_red}`}>
              Program start
            </h2>
            <div className={styles.text_container}>
              <p>
                The program starts every September and runs for 10 months (September – June).
              </p>
              <p>
                Limited spots are available to ensure personalized attention.
              </p>
            </div>
              <div className={styles.buttons}>
                <button className={`${styles.button} ${styles.button_red}`} onClick={handleEmailClick}>
                  <img src={mailIcon} alt="sport@academymarbella.com" /> Email
                </button>
                <button
                  className={`${styles.button} ${styles.button_red}`}
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
