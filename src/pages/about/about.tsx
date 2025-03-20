import { useEffect, useState } from "react";
import fetchAboutPage from "../../api/fetchAboutPage";
import SectionImage from "../../components/sectionImage/sectionImage";
import { useLanguage } from "../../context/languageContext";
import getLocalizedContent from "../../utils/getLocalizedContent";
import TextBlock from "../../components/textBlock/textBlock";

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

  return (
    <main>
      {aboutPageData && aboutPageData.length > 0 ? (
      <>
        <SectionImage title={getLocalizedContent(aboutPageData[0], 'pageTitle', currentLanguage)} />
        <TextBlock text={getLocalizedContent(aboutPageData[0], 'about_text', currentLanguage)} />
      </>
      
      ) : (
        <div>Loading...</div>
      )}

      {/*
      <section className="section__about">
      <h2 class="section__about_header"></h2>
      <div class="section__about_block">
        <div class="section__about_textBlock">
          <h3>Who we are</h3>
          <p class="section__about_text">
            At Marbella International Football Academy, football is more than just a game. It is a way of life. We are committed to developing young players through top-tier training, expert coaching, and a strong winning mentality.
          </p>
          <p class="section__about_text">
            Our philosophy is built on discipline, perseverance, and passion. We don’t just train footballers. We shape future leaders, preparing them for success both on and off the pitch.
          </p>
        </div>
        <img src="./images/about/Who_We_Are.jpg" alt="Who we are">
      </div>
      <div class="section__about_block">
        <img src="./images/about/Natural_Grass_Pitches.jpg" alt="Natural Grass Pitches">
        <div class="section__about_textBlock">
          <h3>Natural Grass Pitches</h3>
          <p class="section__about_text">
            Top-level training demands top-level facilities, which is why we offer the only natural grass pitches in Marbella. Our two professional-grade fields, maintained to elite standards, provide young players with the optimal surface for skill development, ball control, and injury prevention.
          </p>
        </div>
      </div>
      <div class="section__about_block">
        <div class="section__about_textBlock">
          <h3>Management</h3>
          <p class="section__about_text">
            Our academy is proud to have a team of certified coaches with extensive experience in both youth development and professional football. They ensure that our training programs foster talent, discipline, and high performance.
          </p>
          <p class="section__about_text">
            With years of expertise, our coaches implement structured programs designed to shape future athletes. Their dedication creates an elite training environment where players grow both in their sporting and personal development.
          </p>
        </div>
        <img src="./images/about/Management.jpg" alt="Management">
      </div>
      </section>
      <section className="section__image">
      <img src="./images/about/about.jpg" alt="Marbella International Football Academy">
      </section>
      <section className="section__text">
      <div class="section__text_container">
        <div class="section__text_image-bacground"></div>
        <p>
          Marbella, located on Spain’s Costa del Sol, provides the perfect setting for football training. With its mild Mediterranean climate and year-round sunshine, players can hone their skills in optimal conditions.
        </p>
        <p>
          Easily accessible from Malaga International Airport, Marbella offers a safe and welcoming environment, along with high-quality accommodations. It’s an ideal destination for young athletes to train, develop, and recover in a world-class environment.
        </p>
        <div class="section__text_image-bacground"></div>
      </div>
    
      </section>
       */}
    </main>
  );
};

export default AboutPage;