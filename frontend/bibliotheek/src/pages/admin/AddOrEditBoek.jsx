import * as API from '../../api';
import AsyncData from '../../components/AsyncData'; 
import useSWRMutation from 'swr/mutation';
import { useParams } from 'react-router';
import useSWR,{mutate} from 'swr';
import { Link } from 'react-router-dom';
import BoekForm from '../../components/boeken/BoekForm';

export default function AddOrEditBoek() {
  const { id } = useParams();
  const {
    data: boek,
    error: boekError,
    isLoading: boekisLoading,
  } = useSWR(id ? `boeken/${id}` : null, API.getById);
 
  const { trigger: saveboek, error: saveError } = useSWRMutation(
    'boeken',
    API.save,
  );

  const { trigger: saveKopie, error: saveErrorKopie } = useSWRMutation(
    'kopieen',
    API.save,
    {onSuccess:()=>{
      mutate(`boeken/${id}`);
    }},
  );

  const { trigger: deleteKopie, error: deleteErrorKopie } = useSWRMutation(
    'boeken',
    API.deleteRandomBeschikbaarExemplaar,
    {onSuccess:()=>{
      mutate(`boeken/${id}`);
    }},
  );
  return (
    <>
      <Link to={'/dashboard/boeken'}> <button className='top_left_button' >Terugkeren</button></Link>
      <AsyncData error={saveError|| boekError ||saveErrorKopie || deleteErrorKopie} loading={boekisLoading}>
        <BoekForm boek={boek}
          saveBoek={saveboek} saveKopie={saveKopie} DeleteKopie={deleteKopie}/>  
      </AsyncData>
    </>
  );
}
