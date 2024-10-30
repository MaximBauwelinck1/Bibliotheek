import { Link } from 'react-router-dom';
import styles from '../css/Navbar.module.css';
const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link to="/boeken" className={styles.link}>Boeken</Link>
      <Link to="/about" className={styles.link}>About</Link>
    </nav>
  );
};
  
export default Navbar;