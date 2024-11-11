import AsyncData from '../../components/AsyncData';
import { useParams } from 'react-router';
import * as API from '../../api/index';
import useSWR from 'swr';
import { Link } from 'react-router-dom';
import ReservatieDetailAdmin from '../../components/reservaties/reservatieDetailAdmin';
const ReservatieDetail = () =>{
  const { id } = useParams();
  const {
    data: reservatie,
    isLoading,
    error,
  } = useSWR(id?`reservaties/${id}`:null, API.getById);

  return(
    <>
      <Link to={'/dashboard/reservaties'}> <button className='top_left_button' >Terugkeren</button></Link>
      <AsyncData loading={isLoading} error={error}> 
        <ReservatieDetailAdmin key={id} {...reservatie}/>
      </AsyncData>
    </>
  );
};

export default ReservatieDetail;