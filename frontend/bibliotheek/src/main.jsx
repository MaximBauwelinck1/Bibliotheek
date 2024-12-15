import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BoekenList from './pages/Boeken/BoekenList.jsx';
import About from './pages/About/About.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import BoekDetail from './pages/Boeken/BoekDetail.jsx';
import { Navigate } from 'react-router-dom';
import Dashbord from './pages/admin/dashbord.jsx';
import Layout from './pages/Layout.jsx';
import BoekDetailAdmin from './pages/admin/BoekDetail';
import GebruikerDetail from './pages/admin/GebruikerDetail.jsx';
import ReservatieDetail from './pages/admin/ReservatieDetail.jsx';
import BoekKopieDetailAdmin from './pages/admin/BoekKopieDetail.jsx';
import AddOrEditGebruiker from './pages/admin/AddOrEditGebruiker.jsx';
import AddOrEditBoek from './pages/admin/AddOrEditBoek.jsx';
import AddOrEditReservaties from './pages/admin/AddOrEditReservatie.jsx';
import AddOrEditBoekKopie from './pages/admin/AddOrEditBoekKopie.jsx';
import { ThemeProvider } from './contexts/Theme.contexts.jsx';
import { AuthProvider } from './contexts/Auth.context';
import LoginPage from './pages/LoginPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Logout from './pages/Logout.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfielPagina from './pages/gebruikers/ProfielPagina.jsx';
import EditGebruikerPage from './pages/gebruikers/EditGebruikerPage.jsx';
import ChangepasswordPage from './pages/gebruikers/ChangPasswordPage.jsx';
import PasswordVergeten from './pages/gebruikers/PasswordVergetenPage.jsx';
import ResetpasswordPage from './pages/gebruikers/ResetPasswordPage.jsx';
import ServerError from './components/ServerError.jsx';
const router = createBrowserRouter([
  {
    element: <Layout />, 
    errorElement: <ServerError/>,
    children: [
      { 
        path: '/',
        element: <Navigate replace to='/boeken' />,
      },
      {
        path: '/login',
        element: <LoginPage/>,
      },
      {
        path: '/wachtwoord_vergeten',
        element: <PasswordVergeten/>,
      },
      {
        path: '/reset-password',
        element: <ResetpasswordPage/>,
      },
      {
        path: '/logout',
        element: <Logout />,
      },
      {
        path:'/register',
        element:<RegisterPage/>,
      },
      {
        element: <PrivateRoute permissie='user' moetZelfdeUserZijn={true}/>,
        path: '/gebruikers',
        children:[
          {
            path: ':id',
            element: <ProfielPagina />,
          },
          {
            path:':id/edit',
            element:<EditGebruikerPage/>,
          },
          {
            path:':id/passwordChange',
            element:<ChangepasswordPage/>,
          },
          { index:true, element: <NotFound /> },
          
        ],
      },
      { element: <PrivateRoute permissie='admin'/>,
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
              {
                path: 'add',
                element: <AddOrEditGebruiker />,
              },
              {
                path: 'edit/:id',
                element: <AddOrEditGebruiker />,
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
              {
                path: 'add',
                element: <AddOrEditBoek />,
              },
              {
                path: 'edit/:id',
                element: <AddOrEditBoek />,
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
              {
                path: 'add',
                element: <AddOrEditReservaties />,
              },
              {
                path: 'edit/:id',
                element: <AddOrEditReservaties />,
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
              {
                path: 'add',
                element: <AddOrEditBoekKopie />,
              },
              {
                path: 'edit/:id',
                element: <AddOrEditBoekKopie />,
              },
            ],
          },
          {
            path:'grafieken',
            children: [
              {
                index: true,
                element: <Dashbord init_menu='grafieken'  />,
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
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router}/>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);