import { Outlet,ScrollRestoration } from 'react-router-dom';
import NavbarAdmin from '../components/navbarAdmin';

export default function LayoutUser() {
  return (
    <div>
      <NavbarAdmin />
      <Outlet />
      <ScrollRestoration/>
    </div>
  );
}
