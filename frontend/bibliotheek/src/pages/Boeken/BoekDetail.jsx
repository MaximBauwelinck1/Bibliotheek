import { useParams } from 'react-router-dom';
import styles from '../../css/BoekDetail.module.css';
import boek_grid from '../../css/Boek.module.css';
import { Link } from 'react-router-dom';
import * as API from '../../api/index';
import Boek from '../../components/boeken/boek';
import AsyncData from '../../components/AsyncData';
import useSWR from 'swr';
import BoekListItem from '../../components/boeken/boekListItem';

const BoekDetail = () => {
  const { id } = useParams();

  const {
    data: boek,
    isLoading,
    error,
  } = useSWR( id?`boeken/${id}`: null, API.getById);

  const {
    data: suggestieboeken,
    isLoadingSuges,
    errorSuges,
  }  = useSWR(() => (boek ? `boeken?genre=${boek.genre}` : null), API.getAll);
  const suggestions = suggestieboeken || [];
  console.log(suggestieboeken);
  return (
    <>
      <Link to={'/boeken'}> <button className={styles.top_left_button} >Terugkeren</button></Link>    
      <AsyncData loading={isLoading} error={error}> 
        <Boek key={id} {...boek}/>
        <div style={{textAlign:'center'}}><div id={styles.suggestie_tekst}>Je zal mischien ook leuk vinden</div></div>
        <AsyncData loading={isLoadingSuges} error={errorSuges}> 
          <div className={boek_grid.boek_grid}>
            {suggestions
              .sort((a, b) =>
                a.titel.toUpperCase().localeCompare(b.titel.toUpperCase()),
              ).filter((a)=> a.titel != boek.titel)
              .map((p) => (       
                <BoekListItem key={p.id}  {...p} />
              ))}
          </div>
        </AsyncData>
      </AsyncData>
    </>
  );
};

export default BoekDetail;
