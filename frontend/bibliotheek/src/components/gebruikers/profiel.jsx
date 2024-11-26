import * as styles from '../../css/Profiel.module.css';

const Profiel = ({user}) => {
  return (
    <div className={styles.profiel_pagina}>
      <h1 className={styles.profiel_titel}>Profiel</h1>
      <div className={styles.profiel_container}>
        <div className={styles.profiel_item}>
          <span className={styles.profiel_label}>Voornaam:</span>
          <span className={styles.profiel_value}>{user.voornaam}</span>
        </div>
        <div className={styles.profiel_item}>
          <span className={styles.profiel_label}>Achternaam:</span>
          <span className={styles.profiel_value}>{user.achternaam}</span>
        </div>
        <div className={styles.profiel_item}>
          <span className={styles.profiel_label}>Geboortedatum:</span>
          <span className={styles.profiel_value}>{new Date(user.geboortedatum).toLocaleDateString('NL-be',{
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}</span>
        </div>
        <div className={styles.profiel_item}>
          <span className={styles.profiel_label}>Email:</span>
          <span className={styles.profiel_value}>{user.email}</span>
        </div>
        <div className={styles.profiel_item}>
          <span className={styles.profiel_label}>Account Aangemaakt:</span>
          <span className={styles.profiel_value}>{new Date(user.aangemaakt).toLocaleDateString('NL-be',{
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}</span>
        </div>
      </div>
    </div>
  );
};

export default Profiel;
