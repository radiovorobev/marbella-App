import styles from './SectionContacts.module.css';

interface ContactsTextProps {
  text: string;
}

const SectionContacts: React.FC<ContactsTextProps> =  ({text}) => {
  return (
    <section className={styles.section__contacts}>
    <div className={styles.section__contacts_container}>
      <div className={styles.section__contacts_column} dangerouslySetInnerHTML={{ __html: text }}>
     </div>
     <div className={styles.section__contacts_column}>
      <h3>Primary Office</h3>
      <a className={styles.section__contacts_adress} href="https://maps.app.goo.gl/NdZw5XxEAaxvYZSS6" target="_blank">
        La Dama de Noche, Nueva Andalucía, 29660 Marbella, Málaga, Spain
      </a>
      <a className={styles.section__contacts_tel} href="https://wa.me/message/474IL7PF6E25O1" target="_blank">+34 663 131 278</a>
     </div>
    </div>
  </section>
  )
}

export default SectionContacts;