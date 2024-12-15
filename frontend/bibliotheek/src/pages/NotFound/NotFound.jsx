import { useLocation,Link } from 'react-router-dom';
import styles from '../../css/Notfound.module.css';

const NotFound = () => {
  const { pathname } = useLocation();
  return (
    <>
      <Link to={'/boeken'}> <button className='top_left_button' >Terugkeren</button></Link> 
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Pagina niet gevonden(404)</h1>
          <p className={styles.message}>
            De pagina <b>({pathname}) </b>die je probeerde te bezoeken bestaat niet.
          </p>
          <Link to="/" className={styles.homeButton}>Home Page</Link>
        </div>
      </div>
    </>
   
  );
};
  
export default NotFound;
  