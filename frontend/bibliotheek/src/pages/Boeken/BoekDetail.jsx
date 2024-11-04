import { useParams } from 'react-router-dom';
import styles from '../../css/BoekDetail.module.css';
import { Link } from 'react-router-dom';
import * as API from '../../api/index';
import Boek from '../../components/boeken/boek';
import AsyncData from '../../components/AsyncData';
import useSWR from 'swr';

const BoekDetail = () => {
  const { id } = useParams();

  const {
    data: boek,
    isLoading,
    error,
  } = useSWR( id?`boeken/${id}`: null, API.getById);
  
  if (!boek) {
    return (
      <>
        <Link to={'/boeken'}> <button className={styles.top_left_button} >Terugkeren</button></Link>  
        <AsyncData loading={isLoading} error={error}>
        </AsyncData>
      </>
    );
  }

  return (
    <>
      <Link to={'/boeken'}> <button className={styles.top_left_button} >Terugkeren</button></Link>     
      <Boek key={id} {...boek}/>
    </>
  );
};

export default BoekDetail;
