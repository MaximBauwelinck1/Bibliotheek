import { useParams } from 'react-router-dom';
import { BOEKEN_DATA } from '../../api/mock_data';
import '../../css/BoekDetail.css';
import { Link } from 'react-router-dom';

const BoekDetail = () => {
  const { id } = useParams();
  const idAsNumber = id;

  const boek = BOEKEN_DATA.find((p) => p.id === idAsNumber);

  if (!boek) {
    return (
      <div>
        <h1 className='text-center' style={{ paddingTop: '10em'}}>Boek niet gevonden.</h1>
        <p className='text-center'>Boek met id:{id} bestaat niet.</p>
      </div>
    );
  }

  return (
    <>
      <Link to={'/boeken'}> <button className="top-left-button" >Terugkeren</button></Link>
      <div className="boek_detail_container">
        <div className="cover_container">
          <img src={boek.cover_uri} alt={boek.titel} className="cover_img" />
        </div>
        <div className="book_info">
          <h1>{boek.titel}</h1>
          <p><strong>Auteur:</strong> {boek.voornaam} {boek.achternaam}</p>
          <p><strong>Genre:</strong> {boek.genre}</p>
          <p><strong>Publicatiedatum:</strong> {boek.publicatie_datum}</p>
          <p><strong>Taal:</strong> {boek.taal}</p>
          <p><strong>Pagina&apos;s:</strong> {boek.paginas}</p>
          <p><strong>Beschikbare Kopieën:</strong> {boek.vrije_kopieën} / {boek.totale_kopieën}</p>
          <h3>Beschrijving</h3>
          <p>{boek.beschrijving}</p>
          <h3>Auteursinformatie</h3>
          <p><strong>Nationaliteit:</strong> {boek.nationaliteit}</p>
          <p><strong>Biografie:</strong> {boek.biografie}</p>
        </div>
      </div>
      /</>
  );
};

export default BoekDetail;
