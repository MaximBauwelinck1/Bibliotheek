import AsyncData from '../../components/AsyncData';
import { useParams } from 'react-router';
import * as API from '../../api/index';
import useSWR from 'swr';
import { Link } from 'react-router-dom';
import BoekAdmin from '../../components/boeken/boekAdmin';
const BoekDetailAdmin = () =>{
  const { id } = useParams();
  const {
    data: boek,
    isLoading,
    error,
  } = useSWR(id?`boeken/${id}`:null, API.getById);

  return(
    <>
      <Link to={'/dashboard/boeken'}> <button className='top_left_button' >Terugkeren</button></Link>
      <AsyncData loading={isLoading} error={error}> 
        <BoekAdmin key={id} {...boek}/>
      </AsyncData>
    </>
  );
};

export default BoekDetailAdmin;