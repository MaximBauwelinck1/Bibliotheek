import * as styles from '../../css/ReservatieDetail.module.css';

const ReservatieDetailAdmin = ( reservatie ) => {
  console.log(reservatie);
  const { gebruiker, boek_kopie, startdatum, einddatum, status } = reservatie;

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
    boek, // boek bevat nog 10 andere velden
    status: boekKopieStatus,
    extra_informatie,
    aangemaakt: boekKopieAangemaakt,
    upgedate: boekKopieUpgedate,
  } = boek_kopie;

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
        <p><strong>Aangemaakt:</strong> {new Date(gebruikerAangemaakt).toLocaleDateString()}</p>
        <p><strong>Upgedate:</strong> {new Date(gebruikerUpgedate).toLocaleDateString()}</p>
      </div>

      <div className={styles.boek_kopie}>
        <h3>Boek Kopie</h3>
        <p><strong>ID:</strong> {boekKopieId}</p>
        <p><strong>Boek:</strong> {/* Voeg hier de boek details toe */}</p>
        {/* Vul de extra boek velden aan, bijvoorbeeld: */}
        <p><strong>Boek Titel:</strong> {boek.titel}</p>
        <p><strong>Boek Auteur:</strong> {boek.auteur.voornaam}</p>
        {/* Voeg hier de overige 8 velden toe */}
        <p><strong>Status:</strong> {boekKopieStatus}</p>
        <p><strong>Extra Informatie:</strong> {extra_informatie}</p>
        <p><strong>Aangemaakt:</strong> {new Date(boekKopieAangemaakt).toLocaleDateString()}</p>
        <p><strong>Upgedate:</strong> {new Date(boekKopieUpgedate).toLocaleDateString()}</p>
      </div>

      <div className={styles.reservatie_status}>
        <h3>Reservatie</h3>
        <p><strong>Startdatum:</strong> {new Date(startdatum).toLocaleDateString()}</p>
        <p><strong>Einddatum:</strong> {new Date(einddatum).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {status}</p>
      </div>
    </div>
  );
};

export default ReservatieDetailAdmin;
