import Gallery from "../components/gallery/gallery";
import IndexNews from "../components/indexNews/indexNews";
import SectionAbout from "../components/sectionAbout/sectionAbout";
import SectionImage from "../components/sectionImage/sectionImage";

const IndexPage = () => {
  return (
    <main>
    <SectionImage />
    <SectionAbout />
    <IndexNews />
    <Gallery />
  </main>
  );
};

export default IndexPage;