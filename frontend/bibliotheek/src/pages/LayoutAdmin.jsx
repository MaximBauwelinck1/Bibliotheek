import { Outlet,ScrollRestoration } from 'react-router-dom';
import NavbarAdmin from '../components/navbarAdmin';

export default function LayoutAdmin() {
  return (
    <div>
      <NavbarAdmin />
      <Outlet />
      <ScrollRestoration/>
    </div>
  );
}
