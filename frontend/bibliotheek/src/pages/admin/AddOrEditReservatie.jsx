import * as API from '../../api';
import AsyncData from '../../components/AsyncData'; 
import useSWRMutation from 'swr/mutation';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { Link } from 'react-router-dom';
import ReservatieForm from '../../components/reservaties/ReservatieForm';

export default function AddOrEditReservaties() {
  const { id } = useParams();

  const {
    data: reservatie,
    error: reservatieError,
    isLoading: reservatieisLoading,
  } = useSWR(id ? `reservaties/${id}` : null, API.getById);

  const { trigger: savereservatie, error: saveError } = useSWRMutation(
    'reservaties',
    API.save,
  );
  return (
    <>
      <Link to={'/dashboard/reservaties'}> <button className='top_left_button' >Terugkeren</button></Link>
      <AsyncData error={saveError|| reservatieError} loading={reservatieisLoading}>
        <ReservatieForm reservatie={reservatie}
          saveReservatie={savereservatie} />  
      </AsyncData>
    </>
  );
}
