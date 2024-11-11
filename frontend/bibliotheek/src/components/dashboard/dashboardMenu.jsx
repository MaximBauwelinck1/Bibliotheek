import * as styles from '../../css/AdminNavbar.module.css';
const  DashboardMenu = ({onAction}) =>{
  return(
    <div className={styles.button_container}>
      <button className={styles.blue_button} onClick={() =>onAction('boeken')}>Boeken</button>
      <button className={styles.blue_button} onClick={() =>onAction('gebruikers')}>Gebruikers</button>
      <button className={styles.blue_button} onClick={() =>onAction('reservaties')}>Reservaties</button>
    </div>
  );
};

export default DashboardMenu;