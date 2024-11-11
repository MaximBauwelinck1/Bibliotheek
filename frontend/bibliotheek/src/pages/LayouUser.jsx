import { Outlet,ScrollRestoration } from 'react-router-dom';
import NavbarUser from '../components/navbarUser';

export default function LayoutUser() {
  return (
    <div>
      <NavbarUser />
      <Outlet />
      <ScrollRestoration/>
    </div>
  );
}
