import styles from '../../css/BoekDetail.module.css';
const Boek = (props) => {
  console.log(props.achternaam);
  return(
    <div className={styles.boek_detail_container}>
       
      <img src={props.cover_uri} alt={props.titel} className={styles.cover_img} />

      <div className={styles.boek_info}>
        <h1 className={styles.boek_titel}>{props.titel}</h1>
        <p><strong>Auteur:</strong> {props.voornaam} {props.achternaam}</p>
        <p><strong>Genre:</strong> {props.genre}</p>
        <p><strong>Publicatiedatum:</strong> {props.publicatie_datum}</p>
        <p><strong>Taal:</strong> {props.taal}</p>
        <p><strong>Pagina&apos;s:</strong> {props.paginas}</p>
        <p><strong>Beschikbare Kopieën:</strong> {props.vrije_kopieën} / {props.totale_kopieën}</p>
        <h3>Beschrijving</h3>
        <p>{props.beschrijving}</p>
        <h3>Auteursinformatie</h3>
        <p><strong>Nationaliteit:</strong> {props.nationaliteit}</p>
        <p><strong>Biografie:</strong> {props.biografie}</p>
      </div>
    </div>
  );
};

export default Boek;