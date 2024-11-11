import { NavLink } from 'react-router-dom';
import styles from '../css/Navbar.module.css';
const NavbarAdmin = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/boeken" className={({ isActive }) => isActive ? styles.actieveLink : styles.link}>Boeken</NavLink>
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.actieveLink : styles.link}>
        Dashboard
      </NavLink>
      <NavLink to="/about" className={({ isActive }) => isActive ? styles.actieveLink : styles.link}>Over ons</NavLink>
    </nav>
  );
};
  
export default NavbarAdmin;