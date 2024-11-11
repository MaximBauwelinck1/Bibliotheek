import * as styles from '../../css/ReservatieDetail.module.css';
import { useNavigate } from 'react-router';
const ReservatieDetailAdmin = ( reservatie ) => {
  const navigate = useNavigate();
  const { gebruiker, boek_kopie, startdatum, einddatum, status } = reservatie;
  const datum_opties2 = { year: 'numeric', month: 'long', day: 'numeric',hour: 'numeric',minute:'numeric' };
 
  const {
    id: gebruikerId,
    voornaam,
    achternaam,
    email,
    rol,
    geboortedatum,
    aangemaakt: gebruikerAangemaakt,
    upgedate: gebruikerUpgedate,
  } = gebruiker;

  const {
    id: boekKopieId,
    boek, 
    status: boekKopieStatus,
    extra_informatie,
    aangemaakt: boekKopieAangemaakt,
    upgedate: boekKopieUpgedate,
  } = boek_kopie;

  const {
    id: boekId,
    ISBN,
    titel:boekTitel,
    genre,
    publicatie_datum: boekGepubliceerd,
    taal:boekTaal,
    paginas:boekPaginas,
    vrije_kopieen: boekAantalVrij,
    totale_kopieen:boekTotaalAantal,
    beschrijving:boekBeschrijving,
    cover_uri:cover,
    aangemaakt: boekAangemaakt,
    upgedate: boekUpgedate,
    auteur,

  } = boek;

  const {
    id:auteurId,
    voornaam:auteurVoornaam,
    achternaam:auteurAchternaam,
    geboortedatum:auteurGeboortedatum,
    nationaliteit:auteurnationaliteit,
    biografie,
    aangemaakt: auteurAangemaakt,
    upgedate: auteurUpgedate,

  } = auteur;

  const tijdverschil =  Math.round((new Date(einddatum).getTime()
   - new Date(startdatum).getTime()) / (1000 * 3600 * 24));

  return (
    <div className={styles.reservatie_container}>
      <h2>Reservatie Details</h2>

      <div className={styles.gebruiker}>
        <h3>Gebruiker</h3>
        <p><strong>ID:</strong> {gebruikerId}</p>
        <p><strong>Naam:</strong> {voornaam} {achternaam}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Rol:</strong> {rol}</p>
        <p><strong>Geboortedatum:</strong> {new Date(geboortedatum).toLocaleDateString()}</p>
        <p><strong>Aangemaakt:</strong>  
          {new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(gebruikerAangemaakt))}
        </p>
        <p><strong>Upgedate:</strong>
          {new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(gebruikerUpgedate))}
        </p>
        <button className={styles.ga_naar_button} 
          onClick={()=>navigate(`/dashboard/gebruikers/${gebruikerId}`)} >
          Ga naar gebruiker
        </button>
      </div>

      <div className={styles.boek_kopie}>
        <h3>Boek</h3>
        <img className={styles.cover_img} src={cover} alt={`cover van ${boekTitel}`} />
        <p><strong>ID:</strong> {boekId}</p>
        <p><strong>Boek ISBN:</strong> {ISBN}</p>
        <p><strong>Boek Titel:</strong> {boekTitel}</p>
        <p><strong>Genre:</strong> {genre}</p>
        <p><strong>Publicatie datum:</strong>{new Date(boekGepubliceerd).toLocaleDateString()}</p>
        <p><strong>Taal:</strong> {boekTaal}</p>
        <p><strong>Aantal bladzijden:</strong> {boekPaginas}</p>
        <p><strong>Aantal vrije kopieën:</strong> {boekAantalVrij} van de {boekTotaalAantal}</p>
        <p><strong>Beschrijving:</strong> {boekBeschrijving}</p>
        <p><strong>Link naar cover:</strong> {cover}</p>
        <p><strong>Aangemaakt:</strong> 
          {new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(boekAangemaakt))}
        </p>
        <p><strong>Upgedate:</strong>
          {new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(boekUpgedate))}
        </p>
        <div className={styles.auteur}>
          <h3>Auteur</h3>
          <p><strong>ID:</strong> {auteurId}</p>
          <p><strong>Voornaam:</strong> {auteurVoornaam}</p>
          <p><strong>Achternaam:</strong> {auteurAchternaam}</p>
          <p><strong>Geboortedatum:</strong>{new Date(auteurGeboortedatum).toLocaleDateString()}</p>
          <p><strong>Nationaliteit:</strong> {auteurnationaliteit}</p>
          <p><strong>Biografie:</strong> {biografie}</p>
          <p><strong>Aangemaakt:</strong> 
            {new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(auteurAangemaakt))}
          </p>
          <p><strong>Upgedate:</strong>
            {new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(auteurUpgedate))}
          </p>
        </div>
        <button className={styles.ga_naar_button} 
          onClick={()=>navigate(`/dashboard/boeken/${boekId}`)} >
          Ga naar boek
        </button>
      </div>

      <div className={styles.boek_kopie}>
        <h3>Boek Kopie</h3>
        <p><strong>ID:</strong> {boekKopieId}</p>
        <p><strong>Boek ID:</strong> {boekId}</p>
        <p><strong>Status:</strong> {boekKopieStatus}</p>
        <p><strong>Extra Informatie:</strong> {extra_informatie}</p>
        <p><strong>Aangemaakt:</strong> 
          {new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(boekKopieAangemaakt))}
        </p>
        <p><strong>Upgedate:</strong>
          {new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(boekKopieUpgedate))}
        </p>
      </div>

      <div className={styles.reservatie_status}>
        <h3>Reservatie</h3>
        <p><strong>Startdatum:</strong>
          {new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(startdatum))}
        </p>
        <p><strong>Einddatum:</strong> {new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(einddatum))}</p>
        <p><strong>Vervalt binnen:</strong>
          {tijdverschil} dagen
        </p>
        <p><strong>Status:</strong> {status}</p>
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.updateButton} >Update</button>
        <button className={styles.deleteButton}>Delete</button>
      </div>
    </div>
  );
};

export default ReservatieDetailAdmin;
