import { Link } from 'react-router-dom';
import * as styles from '../../css/Navbar.module.css';
import { FaUserEdit, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/auth';
const DropdownMenu = () => {
  const {user} = useAuth();
  return (
    <div className={styles.dropdown_container}>
      <ul>
        <Link to='/logout' className='link_uitgezet'>
          <li data-cy='logout'><FaSignOutAlt/> Uitloggen</li>
        </Link>
        <Link to={`/gebruikers/${user.id}`} className='link_uitgezet'>
          <li><FaUserEdit/>Acount bekijken</li>
        </Link>
      </ul>
    </div>
  );
};
  
export default DropdownMenu;