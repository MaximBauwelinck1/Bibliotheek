import { Link } from 'react-router-dom';
import styles from '../../css/Boek.module.css';

const Book = (props) => {
  return (
    <Link className={styles.link_uitgezet} to={props.id}>
      <div className={styles.boek_card}>
        <div className={styles.cover_container}>
          {props.cover_uri ? (
            <img src={props.cover_uri} alt={`${props.titel} cover`} className={styles.cover_img} />
          ) : (
            <div className={styles.placeholder_cover}>Cover Image</div>
          )}
        </div>
        <div className={styles.boek_info}>
          <p className={styles.boek_titel}>{props.titel}</p>
          <p className={styles.boek_auteur}>{props.voornaam} {props.achternaam}</p>
        </div>
      </div>
    </Link>
    
  );
};

export default Book;