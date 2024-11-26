import { useParams } from 'react-router-dom';
import boek_suggesties from '../../css/BoekSuggestie.module.css';
import { Link } from 'react-router-dom';
import * as API from '../../api/index';
import Boek from '../../components/boeken/boek';
import AsyncData from '../../components/AsyncData';
import useSWR from 'swr';
import SuggestionsBar from '../../components/boeken/SuggestionBar';
import { useTheme } from '../../contexts/theme';
import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';

const BoekDetail = () => {
  const { theme } = useTheme();
  const className = theme === 'light' ? 'bg-light text-dark' : 'bg-dark text-light';
  const { id } = useParams();
  const {
    data: boek,
    isLoading,
    error,
  } = useSWR( id?`boeken/${id}`: null, API.getById);

  const { trigger: saveReservatie, error: saveErrorReservatie } = useSWRMutation(
    'reservaties',
    API.save,
    {onSuccess:()=>{
      mutate(`boeken/${id}`);
    }},
  );

  const {
    data: suggestieboeken,
    isLoadingSuges,
    errorSuges,
  }  = useSWR(() => (boek ? `boeken?genre=${boek.genre}` : null), API.getAll);
  let suggestions = suggestieboeken || [];
  suggestions = suggestions.filter((a)=>a.titel != boek.titel&& a.actief);
  return (
    <div className={className}>
      <Link to={'/boeken'}> <button className='top_left_button' >Terugkeren</button></Link>    
      <AsyncData loading={isLoading} error={error || saveErrorReservatie}> 
        <div style={{paddingTop:100}}>
          <Boek key={id} {...boek} />
          { suggestions.length > 1 && <>  {/* Moet 1 zijn omdat het boek zelf ook een suggestion is.*/}
            <div style={{textAlign:'center'}}>
              <div id={boek_suggesties.suggestie_tekst}>Je zal mischien ook leuk vinden</div>
            </div>
            <AsyncData loading={isLoadingSuges} error={errorSuges}> 
              <SuggestionsBar suggestions={suggestions}/>
            </AsyncData>
          </>}
        </div>
      </AsyncData>
    </div>
  );
};

export default BoekDetail;
