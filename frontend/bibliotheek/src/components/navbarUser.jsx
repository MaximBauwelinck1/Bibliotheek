import { NavLink } from 'react-router-dom';
import styles from '../css/Navbar.module.css';
const NavbarUser = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/boeken" className={({ isActive }) => isActive ? styles.actieveLink : styles.link}>Boeken</NavLink>
      <NavLink to="/about" className={({ isActive }) => isActive ? styles.actieveLink : styles.link}>Over ons</NavLink>
    </nav>
  );
};
  
export default NavbarUser;