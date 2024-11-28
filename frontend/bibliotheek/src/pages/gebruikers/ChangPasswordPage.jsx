import * as API from '../../api';
import AsyncData from '../../components/AsyncData'; 
import useSWRMutation from 'swr/mutation';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { Link } from 'react-router-dom';
import PasswordChange from '../../components/gebruikers/passwordChange';

export default function ChangepasswordPage() {
  const { id } = useParams();

  const {
    data: gebruiker,
    error: gebruikerError,
    isLoading: gebruikerLoading,
  } = useSWR(id ? `gebruikers/${id}` : null, API.getById);

  const { trigger: savegebruiker, error: saveError } = useSWRMutation(
    'gebruikers',
    API.save,
  );
  return (
    <>
      <Link to={`/gebruikers/${id}`}> <button className='top_left_button' >Terugkeren</button></Link>
      <AsyncData error={ gebruikerError} loading={gebruikerLoading}>
        <PasswordChange gebruiker={gebruiker}
          saveGebruiker={savegebruiker} error={saveError} />  
      </AsyncData>
    </>
  );
}
