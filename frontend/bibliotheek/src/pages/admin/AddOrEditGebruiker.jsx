import * as API from '../../api';
import AsyncData from '../../components/AsyncData'; 
import GebruikerForm from '../../components/gebruikers/gebruikerForm';
import useSWRMutation from 'swr/mutation';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { Link } from 'react-router-dom';

export default function AddOrEditGebruiker() {
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
      <Link to={'/dashboard/gebruikers'}> <button className='top_left_button' >Terugkeren</button></Link>
      <AsyncData error={saveError|| gebruikerError} loading={gebruikerLoading}>
        <GebruikerForm gebruiker={gebruiker}
          saveGebruiker={savegebruiker} />  
      </AsyncData>
    </>
  );
}
