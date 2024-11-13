import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BoekenList from './pages/Boeken/BoekenList.jsx';
import About from './pages/About/About.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import BoekDetail from './pages/Boeken/BoekDetail.jsx';
import LayoutUser from './pages/LayouUser.jsx';
import { Navigate } from 'react-router-dom';
import Dashbord from './pages/admin/dashbord.jsx';
import LayoutAdmin from './pages/LayoutAdmin.jsx';
import BoekDetailAdmin from './pages/admin/BoekDetail';
import GebruikerDetail from './pages/admin/GebruikerDetail.jsx';
import ReservatieDetail from './pages/admin/ReservatieDetail.jsx';
import BoekKopieDetailAdmin from './pages/admin/BoekKopieDetail.jsx';
const router = createBrowserRouter([
  {
    element: <LayoutUser />, 
    children: [
      { 
        path: '/',
        element: <Navigate replace to='/boeken' />,
      },
      {
        path: '/boeken',
        children: [
          {
            index: true,
            element: <BoekenList />,
          },
          {
            path: ':id',
            element: <BoekDetail />,
          },
        ],
      },
      { path: 'about', element: <About /> }, 
      { path: '*', element: <NotFound /> },
    ]},
  {
    element: <LayoutAdmin />, 
    children: [
      { 
        path: '/',
        element: <Navigate replace to='/boeken' />,
      },
      { 
        path: '/dashboard',
        children:[
          {
            index:true,
            element: <Dashbord/>,
          },
          {
            path:'gebruikers',
            children: [
              {
                index: true,
                element: <Dashbord init_menu='gebruikers'  />,
              },
              {
                path: ':id',
                element: <GebruikerDetail />,
              },
            ],
          },
          {
            path:'boeken',
            children: [
              {
                index: true,
                element: <Dashbord init_menu='boeken'  />,
              },
              {
                path: ':id',
                element: <BoekDetailAdmin />,
              },
            ],
          },
          {
            path:'reservaties',
            children: [
              {
                index: true,
                element: <Dashbord init_menu='reservaties'  />,
              },
              {
                path: ':id',
                element: <ReservatieDetail />,
              },
            ],
          },
          {
            path:'boekkopieen',
            children: [
              {
                index: true,
                element: <Dashbord init_menu='boekkopieen'  />,
              },
              {
                path: ':boekId/:id',
                element: <BoekKopieDetailAdmin />,
              },
            ],
          },
        ],
      },
      {
        path: '/boeken',
        children: [
          {
            index: true,
            element: <BoekenList />,
          },
          {
            path: ':id',
            element: <BoekDetail />,
          },
        ],
      },
      { path: 'about', element: <About /> }, 
      { path: '*', element: <NotFound /> },
    ]},
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);