import AsyncData from '../../components/AsyncData';
import { useParams } from 'react-router';
import * as API from '../../api/index';
import useSWR from 'swr';
import { Link } from 'react-router-dom';
import BoekKopieAdmin from '../../components/boek_kopie/BoekKopieAdmin';
const BoekKopieDetailAdmin = () =>{
  const { boekId:boekKopieId } = useParams();
  const { id } = useParams();
  const {
    data: boek,
    isLoading,
    error,
  } = useSWR(id&&boekKopieId?`boeken/${boekKopieId}/kopieen/${id}`:null, API.getById);

  return(
    <>
      <Link to={'/dashboard/boeken'}> <button className='top_left_button' >Terugkeren</button></Link>
      <AsyncData loading={isLoading} error={error}> 
        <BoekKopieAdmin key={id} {...boek}/>
      </AsyncData>
    </>
  );
};

export default BoekKopieDetailAdmin;