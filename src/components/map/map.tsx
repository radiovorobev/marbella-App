import styles from './Map.module.css'

const MapSection = () => {
  return (
    <section className={styles.section__map}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7308.302521425314!2d-4.9493272!3d36.4986013!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd732913d1d4c8cb%3A0x704a460580e96f6b!2sLa%20Academia%20-%20Marbella%20International%20Football%20Academy!5e1&hl=en&language=en&region=ES"
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
};

export default MapSection;