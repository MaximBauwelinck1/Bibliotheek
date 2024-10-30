import { NavLink } from 'react-router-dom';
import styles from '../css/Navbar.module.css';
const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/boeken" className={({ isActive }) => isActive ? styles.actieveLink : styles.link}>Boeken</NavLink>
      <NavLink to="/about" className={({ isActive }) => isActive ? styles.actieveLink : styles.link}>About</NavLink>
    </nav>
  );
};
  
export default Navbar;