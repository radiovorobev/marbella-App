import {
  AboutHighlights,
  CoachesGrid,
  ContactsSection,
  FourCardsSection,
  FramedTextSection,
  GalleryCarousel,
  GoalsSection,
  HeroMedia,
  LeadTextBlock,
  LoaderSpinner,
  MapEmbed,
  MediaBlock,
  MediaBulletsSection,
  PriceListSection,
  ProgramHighlight,
  ProgramPricingCard,
  RichTextSection,
  RoleSelectorWidget,
  SimpleTextBlock,
  SubscriptionCardView,
  SubscriptionsSection,
  TextImageSplit,
  NewsListSection,
  PartnersMarquee,
} from "../../ui-library";
import styles from "./uiLibraryDemo.module.css";
import instagramIcon from "../../images/icon_insta.svg";

const UiLibraryDemoPage = () => {
  const mediaBullets = [
    {
      header: "Elite Training",
      html: "<p>Daily sessions on natural grass pitches guided by UEFA licensed coaches.</p>",
      imageUrl: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=900&q=80",
    },
    {
      header: "Performance Analytics",
      html: "<p>Wearable technology and match analysis give players instant feedback.</p>",
      imageUrl: "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const highlightCards = [
    {
      header: "Global Community",
      html: "<p>Players from 25+ countries share the same passion for football.</p>",
      imageUrl: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=900&q=80",
    },
    {
      header: "Academic Support",
      html: "<p>International curriculum with IELTS preparation and tutoring.</p>",
      imageUrl: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80",
    },
    {
      header: "Showcase Matches",
      html: "<p>Friendly games against Spanish academies and scouting events.</p>",
      imageUrl: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const coaches = [
    {
      id: 1,
      name: "Sergio Martínez",
      role: "Head Coach",
      license: "UEFA Pro",
      photoUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=700&q=80",
      bioHtml: "<p>Former La Liga player with experience at elite youth academies.</p>",
    },
    {
      id: 2,
      name: "Ana Sousa",
      role: "Performance Analyst",
      license: "UEFA A",
      photoUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
      bioHtml: "<p>Focuses on biomechanics and injury prevention strategies.</p>",
    },
  ];

  const infoCards = [
    {
      id: 1,
      text: "<p>All inclusive housing and nutrition overseen by club staff.</p>",
      backgroundColor: "#0d1c33",
      headerText: "<strong>Full Board</strong>",
    },
    {
      id: 2,
      text: "<p>10-month technical development pathway with weekly matches.</p>",
      backgroundColor: "#1e344f",
      headerText: "<strong>Season Plan</strong>",
    },
    {
      id: 3,
      text: "<p>Mental coaching and language support included.</p>",
      backgroundColor: "#304c69",
      headerText: "<strong>Support</strong>",
    },
    {
      id: 4,
      text: "<p>Scholarships available for standout performers.</p>",
      backgroundColor: "#446689",
      headerText: "<strong>Scholarships</strong>",
    },
  ];

  const galleryItems = [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=800&q=80",
  ].map((src, index) => ({
    src,
    alt: `Gallery image ${index + 1}`,
  }));

  const goals = [
    {
      sectionTitle: "Technical",
      items: ["First touch", "Ball control", "Finishing"],
    },
    {
      sectionTitle: "Tactical",
      subsections: [
        {
          title: "Team Principles",
          items: ["Pressing triggers", "Build-up structure"],
        },
      ],
    },
  ];

  const newsItems = [
    {
      id: 1,
      title: "Academy signs partnership with local club",
      text: "<p>New collaboration unlocks weekly fixtures and scouting pathways.</p>",
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      publishDate: new Date().toISOString(),
      href: "/news/1",
    },
  ];

  const partnerLogos = [
    { src: "https://dummyimage.com/220x120/1f1f1f/ffffff&text=Puma" },
    { src: "https://dummyimage.com/220x120/1f1f1f/ffffff&text=Barcelo" },
    { src: "https://dummyimage.com/220x120/1f1f1f/ffffff&text=Obal" },
  ];

  const priceItems = [
    { label: "Match analysis pack", value: "150€" },
    { label: "Private goalkeeper clinic", value: "60€" },
  ];

  const contacts = [
    {
      title: "Primary Office",
      address: "La Dama de Noche, Marbella",
      addressUrl: "https://maps.google.com",
      phone: "+34 663 13 12 78",
      phoneUrl: "https://wa.me/34663131278",
    },
    {
      title: "Madrid Scouting Hub",
      address: "Av. América 4, Madrid",
      addressUrl: "https://maps.google.com",
      phone: "+34 600 00 00 00",
      phoneUrl: "tel:+34600000000",
    },
  ];

  const subscriptionPlans = [
    {
      id: 1,
      title: "Full Season",
      description: "Academy access + accommodation.",
      priceLabel: "€2500 / month",
      secondaryPriceLabel: "€120 per session add-on",
    },
    {
      id: 2,
      title: "Monthly Pass",
      description: "Train with the squad for 4 weeks.",
      priceLabel: "€1100 / month",
    },
  ];

  const roleOptions = [
    { id: "player", label: "Player" },
    { id: "goalkeeper", label: "Goalkeeper" },
  ];

  const typeOptions = [
    { id: "internal", label: "Internal" },
    { id: "external", label: "External" },
  ];

  const handleRoleCta = (role: { id: string; label: string }, type: { id: string; label: string }) => {
    console.log("Selected:", role.label, type.label);
  };

  const heroTitle = "Marbella International Football Academy";

  return (
    <main className={styles.page}>
      <HeroMedia
        title={heroTitle}
        imageUrl="https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=1600&q=80"
        imageAlt="Academy hero"
      />

      <LeadTextBlock html="<p>Play, train, and study at the Costa del Sol all year long.</p>" />

      <FramedTextSection html="<p>This framed text section mirrors the intro blocks used on multiple pages.</p>" />

      <RichTextSection
        html="<p><strong>Rich text</strong> supports inline formatting and optional background colors.</p>"
        backgroundColor="#f2f2f7"
      />

      <MediaBlock
        title="Season-long immersion"
        imageUrl="https://images.unsplash.com/photo-1495791094462-46c6b47a4217?auto=format&fit=crop&w=1600&q=80"
      />

      <MediaBulletsSection title="Program pillars" bullets={mediaBullets} />

      <AboutHighlights title="Why Marbella" items={highlightCards} />

      <TextImageSplit
        html="<p>Mix classroom learning and performance labs inside our Marbella campus.</p>"
        imageUrl="https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1000&q=80"
      />

      <CoachesGrid coaches={coaches} />

      <GoalsSection goals={goals} />

      <GalleryCarousel
        title="Play with us"
        ctaUrl="https://www.instagram.com/academymarbella"
        ctaIconSrc={instagramIcon}
        items={galleryItems}
      />

      <FourCardsSection title="Season snapshot" cards={infoCards} />

      <ProgramHighlight
        title="Elite Residence Program"
        level="UEFA Training"
        ageRange="2008-2010"
        descriptionHtml="<p>Weekly matches, position-specific sessions, and academic curriculum included.</p>"
        imageUrl="https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1000&q=80"
      />

      <div className={`${styles.section} ${styles.cardsRow}`}>
        <div className={styles.cardWrapper}>
          <ProgramPricingCard
            program={{
              title: "10-Month Residency",
              tags: ["Full board", "EU passport"],
              priceLabel: "€2500 / week",
              features: ["Accommodation", "Scholar guidance", "Strength & conditioning"],
            }}
            ctaLabel="Join now"
            onCtaClick={() => console.log("CTA clicked")}
          />
        </div>
        <div className={styles.cardWrapper}>
          <ProgramPricingCard
            program={{
              title: "Summer Camp",
              tags: ["Week", "Goalkeepers"],
              priceLabel: "€900 / week",
              features: ["Beach recovery", "2 trainings daily"],
            }}
            ctaLabel="Reserve"
          />
        </div>
      </div>

      <PriceListSection items={priceItems} />

      <NewsListSection news={newsItems} />

      <PartnersMarquee logos={partnerLogos} />

      <ContactsSection
        introHtml="<p>Reach out to our admissions team or visit the academy in Marbella.</p>"
        contacts={contacts}
      />

      <SubscriptionsSection
        title="Subscriptions"
        introHtml="<p>Pick the plan that fits your objectives.</p>"
        plans={subscriptionPlans}
        ctaLabel="Contact us"
        onPlanClick={(plan) => console.log("Plan selected", plan)}
      />

      <div className={styles.section}>
        <SubscriptionCardView
          plan={{
            title: "Morning Skills Pack",
            description: "Small group drills focused on technique.",
            priceLabel: "€45 / session",
          }}
          ctaLabel="Book a slot"
          onCtaClick={(plan) => console.log(plan)}
        />
      </div>

      <div className={styles.roleSection}>
        <RoleSelectorWidget
          title="The next campus starts on June 30"
          primaryLabel="Choose your role"
          secondaryLabel="Choose campus type"
          primaryOptions={roleOptions}
          secondaryOptions={typeOptions}
          ctaLabel="Register"
          onCtaClick={handleRoleCta}
        />
      </div>

      <SimpleTextBlock html="<p>This is a simple text block without surrounding chrome.</p>" />

      <MapEmbed
        embedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7308.302521425314!2d-4.9493272!3d36.4986013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd732913d1d4c8cb%3A0x704a460580e96f6b!2sLa%20Academia%20-%20Marbella%20International%20Football%20Academy!5e0!3m2!1sen!2ses!4v1700000000000"
        title="Academy location"
      />

      <div className={styles.loaderWrapper}>
        <LoaderSpinner size="large" variant="dark" />
      </div>
    </main>
  );
};

export default UiLibraryDemoPage;
