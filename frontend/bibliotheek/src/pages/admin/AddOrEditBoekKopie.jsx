import * as API from '../../api';
import AsyncData from '../../components/AsyncData'; 
import useSWRMutation from 'swr/mutation';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { Link } from 'react-router-dom';
import BoekKopieForm from '../../components/boek_kopie/BoekKopieForm';

export default function AddOrEditBoekKopie() {
  const { id } = useParams();

  const {
    data: kopie,
    error: kopieError,
    isLoading: kopieisLoading,
  } = useSWR(id ? `kopieen/${id}` : null, API.getById);

  const { trigger: savekopie, error: saveError } = useSWRMutation(
    'kopieen',
    API.save,
  );
  return (
    <>
      <Link to={'/dashboard/boekkopieen'}> <button className='top_left_button' >Terugkeren</button></Link>
      <AsyncData error={saveError|| kopieError} loading={kopieisLoading}>
        <BoekKopieForm kopie={kopie}
          saveKopie={savekopie} />  
      </AsyncData>
    </>
  );
}
