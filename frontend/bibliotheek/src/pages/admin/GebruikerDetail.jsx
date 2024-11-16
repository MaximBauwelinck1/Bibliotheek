import GebruikerDetailAdmin from '../../components/gebruikers/gebruikerDetailAdmin';
import AsyncData from '../../components/AsyncData';
import { useParams } from 'react-router';
import * as API from '../../api/index';
import useSWR from 'swr';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import useSWRMutation from 'swr/mutation';
const GebruikerDetail = () =>{
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: user,
    isLoading,
    error,
  } = useSWR(id?`gebruikers/${id}`:null, API.getById);

  const redirectToDashboard = () =>{
    navigate('/dashboard/gebruikers');
  };
  const redirectToEditPage = (id) =>{
    navigate(`/dashboard/gebruikers/edit/${id}`);
  };
  const { trigger: deleteGebruiker, error: deleteError } = useSWRMutation(
    'gebruikers',
    API.deleteById,
    {onSuccess:redirectToDashboard},
  );
  return(
    <>
      <Link to={'/dashboard/gebruikers'}> <button className='top_left_button' >Terugkeren</button></Link>
      <AsyncData loading={isLoading} error={error || deleteError}> 
        <GebruikerDetailAdmin key={id} {...user} onUpdate={redirectToEditPage} onDelete={deleteGebruiker}/>
      </AsyncData>
    </>
  );
};

export default GebruikerDetail;