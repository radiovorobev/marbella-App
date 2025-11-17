import IndexPage from '../pages';
import AboutPage from '../pages/about/about';
import CoachesPage from '../pages/coaches/coaches';
import VenuesPage from '../pages/venues/venues';
import ProgrammesPage from '../pages/programmes/programmes';
import NewsPage from '../pages/news/news';
import ContactsPage from '../pages/contacts/contacts';
import CampsPage from '../pages/camps/camps';
import CampusPage from '../pages/campus/campus';
import CookiesPage from '../pages/cookies/cookies';
import PrivacyPolicy from '../pages/privacyPolicy/privacyPolicy';
import TenMonthsProgrammPage from '../pages/tenmonths/tenMonths';

export const routeComponentMap: Record<string, React.ComponentType<any>> = {
  index: IndexPage,
  about: AboutPage,
  team: CoachesPage,
  venues: VenuesPage,
  subscriptions: ProgrammesPage,
  news: NewsPage,
  contacts: ContactsPage,
  camps: CampsPage,
  campus: CampusPage,
  tenMonthsProgramm: TenMonthsProgrammPage,
  cookies: CookiesPage,
  privacy: PrivacyPolicy,
};
