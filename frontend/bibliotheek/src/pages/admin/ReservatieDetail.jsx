import AsyncData from '../../components/AsyncData';
import { useParams } from 'react-router';
import * as API from '../../api/index';
import useSWR from 'swr';
import { Link } from 'react-router-dom';
import ReservatieDetailAdmin from '../../components/reservaties/reservatieDetailAdmin';
import { useNavigate } from 'react-router';
import useSWRMutation from 'swr/mutation';
const ReservatieDetail = () =>{
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: reservatie,
    isLoading,
    error,
  } = useSWR(id?`reservaties/${id}`:null, API.getById);
  const redirectToDashboard = () =>{
    navigate('/dashboard/reservaties');
  };
  const { trigger: deleteReservatie, error: deleteError } = useSWRMutation(
    'reservaties',
    API.deleteById,
    {onSuccess:redirectToDashboard},
  );
  return(
    <>
      <Link to={'/dashboard/reservaties'}> <button className='top_left_button' >Terugkeren</button></Link>
      <AsyncData loading={isLoading} error={error || deleteError}> 
        <ReservatieDetailAdmin key={id} {...reservatie} onDelete={deleteReservatie}/>
      </AsyncData>
    </>
  );
};

export default ReservatieDetail;