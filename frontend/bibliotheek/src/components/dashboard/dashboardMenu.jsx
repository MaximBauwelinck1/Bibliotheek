import * as styles from '../../css/AdminNavbar.module.css';
import { useNavigate } from 'react-router';
const  DashboardMenu = ({onAction}) =>{
  const navigate = useNavigate();
  return(
    <div className={styles.button_container}>
      <button className={styles.blue_button} onClick={() => {
        navigate('/dashboard/boeken');onAction('boeken');
      }}>Boeken</button>
      <button className={styles.blue_button} onClick={() =>{
        navigate('/dashboard/gebruikers');onAction('gebruikers');
      }}>Gebruikers</button>
      <button className={styles.blue_button} onClick={() =>{
        navigate('/dashboard/reservaties');onAction('reservaties');
      }}>Reservaties</button>
    </div>
  );
};

export default DashboardMenu;