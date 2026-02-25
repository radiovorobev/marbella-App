import { useEffect, useState } from "react";
import TextBlock from "../../components/textBlock/textBlock";
import { useLanguage } from "../../context/languageContext";
import getLocalizedContent from "../../utils/getLocalizedContent";
import SectionImage from "../../components/sectionImage/sectionImage";
import ArticleText from "../../components/articleText/articleText";

import styles from "./opportunities.module.css";
import fetchOpportunitiesPage from "../../api/fetchOpportunitiesPage";
import fetchPlayers from "../../api/fetchPlayers";

interface OpportunitiesPage {
  intro_en: string;
  intro_es: string | null;
  intro_ru: string | null;

  [key: string]: string | number | null | undefined;
}

interface Players {
  name: string;
  photo: string;
  status_en: string;
  status_es?: string | null;
  status_ru?: string | null;

  [key: string]: string | number | null | undefined;
}

const OpportunitiesPage = () => {
  const [content, setContent] = useState<OpportunitiesPage[] | null>(null);
  const [players, setPlayers] = useState<Players[] | null>(null);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const getPageContent = async () => {
      const result = await fetchOpportunitiesPage();
      if (result) {
        setContent(result);
      }
    };

    const getPlayers= async () => {
      const result = await fetchPlayers();
      if (result) {
        setPlayers(result);
      }
    };

    getPageContent();
    getPlayers();
  }, []);

  const headers = {
    section_header_en: "Our players step up",
    section_header_es: "Nuestros jugadores dan el paso",
  };

  const secondHeaders = {
    secondSection_header_en: "Start your season",
    secondSection_header_es: "Empieza tu temporada",
  };

  const buttonText = {
    text_en: "View subscription plans",
    text_es: "Ver planes de inscriptión",
  };

  return (
    <main>
      {content && content.length > 0 && (
        <>
          <SectionImage
            title={getLocalizedContent(content[0], "title", currentLanguage)}
          />
          <TextBlock
            text={getLocalizedContent(content[0], "intro", currentLanguage)}
          />
          <section className={styles.page__container}>
            <h2 className={styles.section__header}>
              {getLocalizedContent(headers, "section_header", currentLanguage)}
            </h2>
            <ArticleText
              articleText={getLocalizedContent(
                content[0],
                "text",
                currentLanguage,
              )}
            />
          </section>
        </>
      )}
      {players && players.length > 0 && (
        <section className={styles.page__container}>
          <ul className={styles.playersContainer}>
            {players.map((player) => (
              <li className={styles.playerContainer} key={player.name}>
                <div className={styles.playerBadge}>
                  {getLocalizedContent(player, "status", currentLanguage)}
                </div>
                <img
                  src={player.photo}
                  alt={player.name}
                  className={styles.playerPhoto}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
      {content && content.length > 0 && (
      <section className={styles.page__container}>
        <h2 className={styles.section__header}>
          {getLocalizedContent(secondHeaders, "secondSection_header", currentLanguage)}
        </h2>       
        <ArticleText
          articleText={getLocalizedContent(
          content[0],
          "ctaText",
          currentLanguage,
          )}
        /> 
        <div className={styles.joinButtons}>
          <a className={styles.joinButton} href="https://academymarbella.com/subscriptions">
            {getLocalizedContent(buttonText, "text", currentLanguage)}
          </a>
        </div>
      </section>
              )}
    </main> 
  );
};

export default OpportunitiesPage;
