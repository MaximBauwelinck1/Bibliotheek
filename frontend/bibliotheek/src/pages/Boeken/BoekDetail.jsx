import { useParams } from 'react-router-dom';
import styles from '../../css/BoekDetail.module.css';
import { Link } from 'react-router-dom';
import * as API from '../../api/index';
import Boek from '../../components/boeken/boek';
import AsyncData from '../../components/AsyncData';
import useSWR from 'swr';

const BoekDetail = () => {
  const { id } = useParams();

  const {
    data: boek,
    isLoading,
    error,
  } = useSWR( id?`boeken/${id}`: null, API.getById);
  
  if (!boek) {
    return (
      <AsyncData loading={isLoading} error={error}>
      </AsyncData>
    );
  }

  return (
    <>
      <Link to={'/boeken'}> <button className={styles.top_left_button} >Terugkeren</button></Link>
      
      <div className={styles.boek_detail_container}>
       
        <img src={boek.cover_uri} alt={boek.titel} className={styles.cover_img} />
 
        <div className={styles.boek_info}>
          <h1 className={styles.boek_titel}>{boek.titel}</h1>
          <p><strong>Auteur:</strong> {boek.auteur.voornaam} {boek.auteur.achternaam}</p>
          <p><strong>Genre:</strong> {boek.genre}</p>
          <p><strong>Publicatiedatum:</strong> {new Date(boek.publicatie_datum).
            toLocaleDateString('nl-BE', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Taal:</strong> {boek.taal}</p>
          <p><strong>Pagina&apos;s:</strong> {boek.paginas}</p>
          <p><strong>Beschikbare Kopieën:</strong> {boek.vrije_kopieen} / {boek.totale_kopieen}</p>
          <h3>Beschrijving</h3>
          <p>{boek.beschrijving}</p>
          <h3>Auteursinformatie</h3>
          <p><strong>Nationaliteit:</strong> {boek.auteur.nationaliteit}</p>
          <p><strong>Biografie:</strong> {boek.auteur.biografie}</p>
        </div>
      </div>
      
    </>
  );
};

export default BoekDetail;
