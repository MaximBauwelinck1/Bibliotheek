import Profiel from '../components/gebruikers/profiel';
import { useParams } from 'react-router';
import AsyncData from '../components/AsyncData';
import { Link } from 'react-router-dom';
import* as API from '../api/index';
import useSWR from 'swr';
import { useAuth } from '../contexts/auth';
import VerbodenToegang from '../components/VerbodenToegang';
import ReservatieLijst from '../components/reservaties/reservatieLijst';
import * as dashboard from './../css/Dashboard.module.css';

const ProfielPagina =()=>{
  const {user} = useAuth();
  const { id } = useParams();
  const {
    data: gebruiker,
    isLoading,
    error,
  } = useSWR( id?`gebruikers/${id}`: null, API.getById);

  const {
    data: reservaties,
    isLoading: isLoadingRes,
    error:errorRes,
  } = useSWR( id?`gebruikers/${id}/reservaties`: null, API.getAll);

  if(user && user.id  !=id){ // admins mogen alle gebruikers wel bekijken via het dashboard maar niet via hier
    return( // allen de gebruiker waarvan het profiel behoort mag deze pagina zien
      <VerbodenToegang/>
    );
  }
  return(
    <AsyncData loading={isLoading || isLoadingRes} error={error || errorRes}>
      <Link to={'/boeken'}> <button className='top_left_button' >Terugkeren</button></Link> 
      <Profiel user={gebruiker}/>
      <div className={dashboard.reservatie_container_user}>
        <ReservatieLijst reservaties={reservaties} actieve={true} isLoading={isLoadingRes} error={errorRes}/>
        <ReservatieLijst reservaties={reservaties} actieve={false} isLoading={isLoadingRes} error={errorRes}/>
      </div>
    </AsyncData>
   
  );  
};

export default ProfielPagina;