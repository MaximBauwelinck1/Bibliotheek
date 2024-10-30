import { useLocation,Link } from 'react-router-dom';
import styles from './../../css/Notfound.module.css';
const NotFound = () => {
  const { pathname } = useLocation();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>De pagina({pathname}) die je probeerde te bezoeken bestaat niet.</p>
      <Link to="/" className={styles.homeButton}>Home Page</Link>
    </div>
  );
};
  
export default NotFound;
  