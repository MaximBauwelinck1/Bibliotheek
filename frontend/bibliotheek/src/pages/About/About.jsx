import aboutImage from '../../assets/about.jpg';
import * as styles from '../../css/About.module.css';

const About = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img
          src={aboutImage}
          alt="foto van bib Temse"
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Over ons</h1>
        <p className={styles.text}>
          Welkom bij <strong>Bibliotheek Boekenland</strong>, een toevluchtsoord voor lezers,
          leerlingen en ontdekkingsreizigers. Onze bibliotheek is de thuisbasis van een uitgebreide collectie boeken,
          digitale bronnen en gemeenschapsevenementen ontworpen om nieuwsgierigheid en levenslang leren te stimuleren.
          Of je hier nu bent voor onderzoek, rustige studie of het plezier van het ontdekken van je volgende favoriete
          verhaal we zijn er om je van dienst te zijn.
        </p>
      </div>

      <div className={styles.infoContainer}>
        <div className={styles.infoBox}>
          <h2>📍 Adres</h2>
          <p>Overpoortstraat 90, 9000 Gent</p>
        </div>

        <div className={styles.infoBox}>
          <h2>📞 Contacteer ons</h2>
          <p>Tele: 037777777</p>
          <p>Email: boekenland@example.com</p>
        </div>

        <div className={styles.infoBox}>
          <h2>🕒 openingsuren</h2>
          <p>Maandag - Vrijdag: 09:00 - 18:00</p>
          <p>Zaterdag: 10:00 - 16:00</p>
          <p>Zondag: Gesloten</p>
        </div>
      </div>
    </div>
  );
};

export default About;
