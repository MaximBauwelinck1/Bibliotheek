import { NavLink } from 'react-router-dom';
import styles from '../css/Navbar.module.css';
import { useAuth } from '../contexts/auth';
import { IoMoonSharp, IoSunny } from 'react-icons/io5';
import { useTheme } from '../contexts/theme';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { useState } from 'react';
import DropdownMenu from './gebruikers/gebruikerDropDownMenu';

const NavBar = () => {
  const { user,isAuthed } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  return (
    <nav className={styles.navbar}>
      <NavLink to="/boeken" className={({ isActive }) => isActive ? styles.actieveLink : styles.link}>Boeken</NavLink>

      { user && user.rol === 'admin' && 
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.actieveLink : styles.link}
        data-cy='dashboard'>
        Dashboard
      </NavLink>}
      <NavLink to="/about" className={({ isActive }) => isActive ? styles.actieveLink : styles.link}>
        Over de Bib
      </NavLink>
      <p style={{marginLeft:'auto',color:'#b30009'}}>
        Dit is een fictieve website gemaakt voor educatieve doeleinden als onderdeel
        van een schoolproject. Deze site is niet verbonden aan een bestaande bibliotheek.</p>
      {
        isAuthed && user ? (
      
          <div  style={{marginLeft:'auto'}}  onClick={()=>setDropdownVisible(!isDropdownVisible)} 
            className={styles.gebruiker_container}> 
            <FaUser data-cy='profiel' className={styles.gebruiker_icon}/>
            {isDropdownVisible && <DropdownMenu />}
          </div>
        ) : (
        
          <div  style={{marginLeft:'auto'}}  className={styles.gebruiker_container}>
            <Link className='nav-link' to='/login'>
              <FaUser data-cy='profiel' className={styles.gebruiker_icon}/>
            </Link>
          </div>
        )
      }
      <button
        className='btn btn-secondary'
        type='button'
        onClick={toggleTheme}
      >
        {theme ==='dark' ? <IoMoonSharp /> : <IoSunny />}
      </button>
    </nav>
  );
};
  
export default NavBar;