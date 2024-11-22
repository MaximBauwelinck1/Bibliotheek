import { Outlet,ScrollRestoration } from 'react-router-dom';
import NavbarUser from '../components/navbarUser';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/Theme.contexts';

export default function LayoutUser() {
  const { theme, textTheme } = useContext(ThemeContext);
  return (
    <div className={`bg-${theme} text-${textTheme}`}>   
      <NavbarUser />
      <Outlet />
      <ScrollRestoration/>
    </div>
  );
}
