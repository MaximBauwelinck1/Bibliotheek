import styles from '../css/ToonBestiging.module.css';
const ToonBevestiging = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className={styles.actions}>
          <button onClick={onConfirm}>Bevestig</button>
          <button  onClick={onClose}>Annuleer</button>
        </div>
      </div>
    </div>
  );
};

export default ToonBevestiging;
