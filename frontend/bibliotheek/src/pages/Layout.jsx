import { Outlet,ScrollRestoration } from 'react-router-dom';
import NavBar from '../components/navBar';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/Theme.contexts';

export default function Layout() {
  const { theme, textTheme } = useContext(ThemeContext);
  return (
    <div  className={`bg-${theme} text-${textTheme}`}>
      <NavBar />
      <Outlet />
      <ScrollRestoration/>
    </div>
  );
}
