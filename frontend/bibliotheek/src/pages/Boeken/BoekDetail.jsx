import { useParams } from 'react-router-dom';
import boek_suggesties from '../../css/BoekSuggestie.module.css';
import { Link } from 'react-router-dom';
import * as API from '../../api/index';
import Boek from '../../components/boeken/boek';
import AsyncData from '../../components/AsyncData';
import useSWR from 'swr';
import SuggestionsBar from '../../components/boeken/SuggestionBar';

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
  let suggestions = suggestieboeken || [];
  suggestions = suggestions.filter((a)=>a.titel != boek.titel);
  return (
    <>
      <Link to={'/boeken'}> <button className='top_left_button' >Terugkeren</button></Link>    
      <AsyncData loading={isLoading} error={error}> 
        <Boek key={id} {...boek}/>
        { suggestions.length > 1 && <>  {/* Moet 1 zijn omdat het boek zelf ook een suggestion is.*/}
          <div style={{textAlign:'center'}}>
            <div id={boek_suggesties.suggestie_tekst}>Je zal mischien ook leuk vinden</div>
          </div>
          <AsyncData loading={isLoadingSuges} error={errorSuges}> 
            <SuggestionsBar suggestions={suggestions}/>
          </AsyncData>
        </>}
      </AsyncData>
    </>
  );
};

export default BoekDetail;
