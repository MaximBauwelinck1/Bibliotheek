import AsyncData from '../../components/AsyncData';
import { useNavigate, useParams } from 'react-router';
import * as API from '../../api/index';
import useSWR from 'swr';
import { Link } from 'react-router-dom';
import BoekKopieAdmin from '../../components/boek_kopie/BoekKopieAdmin';
import useSWRMutation from 'swr/mutation';
const BoekKopieDetailAdmin = () =>{
  const navigate = useNavigate();
  const { boekId:boekKopieId } = useParams();
  const { id } = useParams();
  const {
    data: boek,
    isLoading,
    error,
  } = useSWR(id&&boekKopieId?`boeken/${boekKopieId}/kopieen/${id}`:null, API.getById);
  const redirectToDashboard = () =>{
    navigate('/dashboard/boekkopieen');
  };
  const { trigger: deleteKopie, error: deleteError } = useSWRMutation(
    'kopieen',
    API.deleteById,
    {onSuccess:redirectToDashboard},
  );
  return(
    <>
      <Link to={'/dashboard/boeken'}> <button className='top_left_button' >Terugkeren</button></Link>
      <AsyncData loading={isLoading} error={error || deleteError}> 
        <BoekKopieAdmin key={id} onDelete={deleteKopie} {...boek}/>
      </AsyncData>
    </>
  );
};

export default BoekKopieDetailAdmin;