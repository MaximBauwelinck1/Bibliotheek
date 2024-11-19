import { useNavigate } from 'react-router';
import * as styles from '../../css/ReservatieDetail.module.css';
import ToonBevestiging from '../ToonBevestiging';
import { useState } from 'react';
const BoekAdmin = ({onDelete,...boek}) =>{
  const navigate = useNavigate();
  const datum_opties2 = { year: 'numeric', month: 'long', day: 'numeric',hour: 'numeric',minute:'numeric' };
   
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
    actief,
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

  const handelDelete = ()=>{
    onDelete(boekId);
  };
  const [toonBevesteging, setToonBevesteging] = useState(false);
  return(<div style={{marginTop:100}} className={styles.reservatie_container}>
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
    <p><strong>Archivering:</strong> {actief?'Actief':'Gearchiveerd'}</p>
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
    <div className={styles.buttonGroup}>
      <button className={styles.updateButton} onClick={()=>navigate(`/dashboard/boeken/edit/${boekId}`)}>Update</button>
      <button className={styles.deleteButton} onClick={() =>setToonBevesteging(true)}>Delete</button>
    </div>
    <ToonBevestiging
      isOpen={toonBevesteging}
      onClose={() => setToonBevesteging(false)}
      onConfirm={handelDelete}
      title="Bevestig verwijdering"
      message="Wil je zeker dit boek verwijderen?"
    />
  </div>
  );
};

export default BoekAdmin;