import styles from '../../css/BoekDetail.module.css';
import { useTheme } from '../../contexts/theme';
const Boek = (props) => {
  const { theme } = useTheme();
  const className = theme === 'light' ? 'bg-light text-dark' : 'bg-dark text-light';
  return(
    <div className={styles.boek_detail_container +' ' +className}>
       
      <img src={props.cover_uri} alt={props.titel} className={styles.cover_img} />

      <div className={styles.boek_info}>
        <h1 className={styles.boek_titel}>{props.titel}</h1>
        <p><strong>Auteur:</strong> {props.auteur.voornaam} {props.auteur.achternaam}</p>
        <p><strong>Genre:</strong> {props.genre}</p>
        <p><strong>Publicatiedatum:</strong> {new Date(props.publicatie_datum).
          toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric'})}</p>
        <p><strong>Taal:</strong> {props.taal}</p>
        <p><strong>Pagina&apos;s:</strong> {props.paginas}</p>
        <p><strong>Beschikbare Kopieën:</strong> {props.vrije_kopieen} / {props.totale_kopieen}</p>
        <h3>Beschrijving</h3>
        <p>{props.beschrijving}</p>
        <h3>Auteursinformatie</h3>
        <p><strong>Nationaliteit:</strong> {props.auteur.nationaliteit}</p>
        <p><strong>Biografie:</strong> {props.auteur.biografie}</p>
      </div>
    </div>
  );
};

export default Boek;