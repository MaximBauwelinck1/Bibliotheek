import { Link } from 'react-router-dom';
import * as styles from '../../css/Navbar.module.css';
import { FaUserEdit, FaSignOutAlt } from 'react-icons/fa';
const DropdownMenu = () => {
  return (
    <div className={styles.dropdown_container}>
      <ul>
        <Link to='/logout' className='link_uitgezet'>
          <li><FaSignOutAlt/> Uitloggen</li>
        </Link>
        <li><FaUserEdit/>Acount bekijken</li>
      </ul>
    </div>
  );
};
  
export default DropdownMenu;