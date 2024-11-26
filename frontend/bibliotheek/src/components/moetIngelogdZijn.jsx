import { useAuth } from '../contexts/auth';
import * as styles from '../css/BoekDetail.module.css';
import { Link,useLocation } from 'react-router-dom';

const MoetIngelogdZijn = () =>{
  const {pathname} = useLocation();
  const {user }= useAuth();
  if(!user){
    return(
      <p className={styles.reserveer_container}>
        <Link to={`/login?redirect=${pathname}`}>
          <button className={styles.niet_ingelogd_knop}>
            U moet ingelogd zijn om een boek te kunnen reserveren
          </button>
        </Link>
       
      </p>
    );
  } else{
    return(
      <p className={styles.reserveer_container}>
        <Link to={`/login?redirect=${pathname}`}>
          <button className={styles.reserveer_knop}>
            Reserveer
          </button>
        </Link>
      </p>
    );
  }
};

export default MoetIngelogdZijn;