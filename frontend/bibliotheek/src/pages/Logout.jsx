import { useAuth } from '../contexts/auth';
import { useEffect } from 'react';
import * as styles from '../css/Logout.module.css';
import { Link } from 'react-router-dom';
const Logout = () => {
  const { isAuthed, logout } = useAuth(); 
   
  useEffect(() => {
    logout();
  }, [logout]);
  return (
    <>
      <Link to={'/boeken'}> <button className='top_left_button' >Terugkeren</button></Link> 
      <div className={styles.container}>
        <div className={styles.messageBox}>
          <h1 className={styles.message}>
            {isAuthed ? 'Aan het uit loggen...' : 'U bent succesvol uitgelogd'}
          </h1>
        </div>
      </div>
    </>
  );
};
  
export default Logout;