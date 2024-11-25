import styles from '../css/ToonError.module.css';
const ToonError = ({ isOpen, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.error_container}>
      <div >
        <h3 className={styles.tekst}><b>{title}</b></h3>
        <p className={styles.tekst}>{message}</p>
      </div>
    </div>
  );
};

export default ToonError;
