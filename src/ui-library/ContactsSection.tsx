import styles from "../components/sectionCotacts/SectionContacts.module.css";

export type ContactInfo = {
  title: string;
  address?: string;
  addressUrl?: string;
  phone?: string;
  phoneUrl?: string;
};

type ContactsSectionProps = {
  introHtml: string;
  contacts: ContactInfo[];
};

const ContactsSection = ({ introHtml, contacts }: ContactsSectionProps) => {
  if (!contacts || contacts.length === 0) {
    return null;
  }

  return (
    <section className={styles.section__contacts}>
      <div className={styles.section__contacts_container}>
        <div
          className={styles.section__contacts_column}
          dangerouslySetInnerHTML={{ __html: introHtml }}
        ></div>

        {contacts.map((contact) => (
          <div key={contact.title} className={styles.section__contacts_column}>
            <h3>{contact.title}</h3>
            {contact.address && (
              <a
                className={styles.section__contacts_address}
                href={contact.addressUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contact.address}
              </a>
            )}
            {contact.phone && (
              <a
                className={styles.section__contacts_tel}
                href={contact.phoneUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contact.phone}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContactsSection;
