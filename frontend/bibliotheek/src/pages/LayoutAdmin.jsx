import { Outlet,ScrollRestoration } from 'react-router-dom';
import NavbarAdmin from '../components/navbarAdmin';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/Theme.contexts';

export default function LayoutAdmin() {
  const { theme, textTheme } = useContext(ThemeContext);
  return (
    <div  className={`bg-${theme} text-${textTheme}`}>
      <NavbarAdmin />
      <Outlet />
      <ScrollRestoration/>
    </div>
  );
}
