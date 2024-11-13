import AsyncData from '../../components/AsyncData';
import { useParams } from 'react-router';
import * as API from '../../api/index';
import useSWR from 'swr';
import { Link } from 'react-router-dom';
import BoekAdmin from '../../components/boeken/boekAdmin';
import useSWRMutation from 'swr/mutation';
import { useNavigate } from 'react-router';
const BoekDetailAdmin = () =>{
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: boek,
    isLoading,
    error,
  } = useSWR(id?`boeken/${id}`:null, API.getById);
  const redirectToDashboard = () =>{
    navigate('/dashboard/boeken');
  };
  const { trigger: deleteBoek, error: deleteError } = useSWRMutation(
    'boeken',
    API.deleteById,
    {onSuccess:redirectToDashboard},
  );

  return(
    <>
      <Link to={'/dashboard/boeken'}> <button className='top_left_button' >Terugkeren</button></Link>
      <AsyncData loading={isLoading} error={error || deleteError}> 
        <BoekAdmin  key={id} onDelete={deleteBoek} {...boek}/>
      </AsyncData>
    </>
  );
};

export default BoekDetailAdmin;