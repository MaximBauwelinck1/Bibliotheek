import { NavLink } from 'react-router-dom';
import styles from '../css/Navbar.module.css';
import { useAuth } from '../contexts/auth';
import { IoMoonSharp, IoSunny } from 'react-icons/io5';
import { useTheme } from '../contexts/theme';
const NavbarAdmin = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className={styles.navbar}>
      <NavLink to="/boeken" className={({ isActive }) => isActive ? styles.actieveLink : styles.link}>Boeken</NavLink>

      { user && user.rol === 'admin' && 
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.actieveLink : styles.link}>
        Dashboard
      </NavLink>}
      <NavLink to="/about" className={({ isActive }) => isActive ? styles.actieveLink : styles.link}>Over ons</NavLink>
      <button style={{marginLeft:'auto'}}
        className='btn btn-secondary'
        type='button'
        onClick={toggleTheme}
      >
        {theme ==='dark' ? <IoMoonSharp /> : <IoSunny />}
      </button>
    </nav>
  );
};
  
export default NavbarAdmin;