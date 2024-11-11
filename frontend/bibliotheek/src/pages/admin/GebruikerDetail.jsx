import GebruikerDetailAdmin from '../../components/gebruikers/gebruikerDetailAdmin';
import AsyncData from '../../components/AsyncData';
import { useParams } from 'react-router';
import * as API from '../../api/index';
import useSWR from 'swr';
import { Link } from 'react-router-dom';
const GebruikerDetail = () =>{
  const { id } = useParams();
  const {
    data: user,
    isLoading,
    error,
  } = useSWR(id?`gebruikers/${id}`:null, API.getById);

  return(
    <>
      <Link to={'/dashboard/gebruikers'}> <button className='top_left_button' >Terugkeren</button></Link>
      <AsyncData loading={isLoading} error={error}> 
        <GebruikerDetailAdmin key={id} {...user}/>
      </AsyncData>
    </>
  );
};

export default GebruikerDetail;