import { useState } from 'react';
import styles from './RoleSelector.module.css';
import { useLanguage } from '../../context/languageContext';

const RoleSelector = () => {
  const [role, setRole] = useState<'PLAYER' | 'GOALKEEPER'>('PLAYER');
  const [type, setType] = useState<'INTERNAL' | 'EXTERNAL'>('INTERNAL');
  const { currentLanguage } = useLanguage();

  const whatsappNumber = '34612345678'; // Замените на актуальный

  const labels = {
    en: {
      chooseRole: 'CHOOSE YOUR ROLE',
      chooseType: 'CHOOSE CAMPUS TYPE',
      player: 'PLAYER',
      goalkeeper: 'GOALKEEPER',
      internal: 'INTERNAL',
      external: 'EXTERNAL',
      register: 'REGISTER',
      message: (r: string, t: string) => `Hello! I would like to register as a ${r.toLowerCase()} for the ${t.toLowerCase()} campus.`
    },
    es: {
      chooseRole: 'ELIGE TU ROL',
      chooseType: 'ELIGE TIPO DE CAMPUS',
      player: 'JUGADOR',
      goalkeeper: 'PORTERO',
      internal: 'INTERNO',
      external: 'EXTERNO',
      register: 'INSCRIBIRSE',
      message: (r: string, t: string) => `¡Hola! Me gustaría registrarme como ${r.toLowerCase()} para el campus ${t.toLowerCase()}.`
    },
    ru: {
      chooseRole: 'ВЫБЕРИТЕ РОЛЬ',
      chooseType: 'ВЫБЕРИТЕ ТИП ЛАГЕРЯ',
      player: 'ИГРОК',
      goalkeeper: 'ВРАТАРЬ',
      internal: 'С ПРОЖИВАНИЕМ',
      external: 'БЕЗ ПРОЖИВАНИЯ',
      register: 'ЗАПИСАТЬСЯ',
      message: (r: string, t: string) => `Здравствуйте! Хочу записаться как ${r.toLowerCase()} на ${t.toLowerCase()} лагерь.`
    }
  };

  const l = labels[currentLanguage as 'en' | 'es' | 'ru'] || labels.en;

  const handleClick = () => {
    const message = l.message(l[role.toLowerCase() as 'player' | 'goalkeeper'], l[type.toLowerCase() as 'internal' | 'external']);
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>The next campus starts on June 30</h2>
      <div className={styles.group}>
        <p className={styles.label}>{l.chooseRole}</p>
        <div className={styles.options}>
          <button
            className={`${styles.option} ${role === 'PLAYER' ? styles.active : ''}`}
            onClick={() => setRole('PLAYER')}
          >
            {l.player}
          </button>
          <button
            className={`${styles.option} ${role === 'GOALKEEPER' ? styles.active : ''}`}
            onClick={() => setRole('GOALKEEPER')}
          >
            {l.goalkeeper}
          </button>
        </div>
      </div>

      <div className={styles.group}>
        <p className={styles.label}>{l.chooseType}</p>
        <div className={styles.options}>
          <button
            className={`${styles.option} ${type === 'INTERNAL' ? styles.active : ''}`}
            onClick={() => setType('INTERNAL')}
          >
            {l.internal}
          </button>
          <button
            className={`${styles.option} ${type === 'EXTERNAL' ? styles.active : ''}`}
            onClick={() => setType('EXTERNAL')}
          >
            {l.external}
          </button>
        </div>
      </div>

      <button className={styles.registerButton} onClick={handleClick}>
        {l.register}
      </button>
    </section>
  );
};

export default RoleSelector;
