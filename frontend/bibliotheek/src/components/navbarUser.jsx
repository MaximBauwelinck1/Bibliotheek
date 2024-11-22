import { NavLink } from 'react-router-dom';
import styles from '../css/Navbar.module.css'; 
import { IoMoonSharp, IoSunny } from 'react-icons/io5';
import { useTheme } from '../contexts/theme';
const NavbarUser = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className={styles.navbar }>
      <NavLink to="/boeken" className={({ isActive }) => isActive ? styles.actieveLink : styles.link}>Boeken</NavLink>
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
  
export default NavbarUser;