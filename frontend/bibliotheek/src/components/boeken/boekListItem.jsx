import { Link } from 'react-router-dom';
import styles from '../../css/Boek.module.css';

const BoekListItem = (props) => {
  if(props.titel.length>=20){
    const verkorte_titel = props.titel.substring(0, 20);;
    console.log(verkorte_titel);
  }
  return (
    <Link className={styles.link_uitgezet} to={`/boeken/${props.id}`}>
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
          <p className={styles.boek_auteur}>{props.auteur.voornaam} {props.auteur.achternaam}</p>
        </div>
      </div>
    </Link>
    
  );
};

export default BoekListItem;