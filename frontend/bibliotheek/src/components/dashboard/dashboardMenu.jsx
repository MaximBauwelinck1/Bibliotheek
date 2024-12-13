import * as styles from '../../css/AdminNavbar.module.css';
import { useNavigate } from 'react-router';
const  DashboardMenu = ({onAction}) =>{
  const navigate = useNavigate();
  return(
    <div className={styles.button_container}>
      <button className={styles.blue_button} onClick={() => {
        navigate('/dashboard/boeken');onAction('boeken');
      }}>Boeken</button>
      <button className={styles.blue_button} data-cy='gebruiker_btn' onClick={() =>{
        navigate('/dashboard/gebruikers');onAction('gebruikers');
      }}>Gebruikers</button>
      <button className={styles.blue_button} onClick={() =>{
        navigate('/dashboard/reservaties');onAction('reservaties');
      }}>Reservaties</button>
      <button className={styles.blue_button} onClick={() =>{
        navigate('/dashboard/boekkopieen');onAction('boekkopieen');
      }}>Boek Kopieën</button>
      <button className={styles.blue_button} onClick={() =>{
        navigate('/dashboard/grafieken');onAction('grafieken');
      }}>Grafieken</button>
    </div>
  );
};

export default DashboardMenu;