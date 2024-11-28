import { useAuth } from '../contexts/auth';
import * as styles from '../css/BoekDetail.module.css';
import { Link,useLocation } from 'react-router-dom';
import ToonBevestiging from './ToonBevestiging';
import { useState } from 'react';

const MoetIngelogdZijn = ({reserveerTrigger, titelBoek}) =>{
  const [toonBevestiging,setToonBevestiging] = useState(false);
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
      <>
        <p className={styles.reserveer_container}>
          <Link onClick={()=>setToonBevestiging(true)}>
            <button className={styles.reserveer_knop}>
              Reserveer
            </button>
          </Link>      
        </p>
        <ToonBevestiging isOpen={toonBevestiging} onConfirm={()=>{
          reserveerTrigger(user.id);
          setToonBevestiging(false);
        }
        }
        onClose={()=>setToonBevestiging(false)}
        title='Bevestiging reservatie'
        message={`Wilt u zeker het boek: ${titelBoek} reserveren voor 3 weken?`}/>
      </>
    );
  }
};

export default MoetIngelogdZijn;