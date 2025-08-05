// src/utils/routeComponentMap.ts
import IndexPage from '../pages';
import AboutPage from '../pages/about/about';
import CoachesPage from '../pages/coaches/coaches';
import VenuesPage from '../pages/venues/venues';
import ProgrammesPage from '../pages/programmes/programmes';
import NewsPage from '../pages/news/news';
import ArticlePage from '../pages/article/article';
import ContactsPage from '../pages/contacts/contacts';
import CampsPage from '../pages/camps/camps';
import CampusPage from '../pages/campus/campus';
import CookiesPage from '../pages/cookies/cookies';
import PrivacyPolicy from '../pages/privacyPolicy/privacyPolicy';

export const routeComponentMap: Record<string, React.ComponentType<any>> = {
  '/': IndexPage,
  '/about': AboutPage,
  '/coaches': CoachesPage,
  '/venues': VenuesPage,
  '/subscriptions': ProgrammesPage,
  '/news': NewsPage,
  '/news/:id': ArticlePage,
  '/contacts': ContactsPage,
  '/training-camps': CampsPage,
  '/campus': CampusPage,
  '/cookies': CookiesPage,
  '/privacy-policy': PrivacyPolicy,
};
