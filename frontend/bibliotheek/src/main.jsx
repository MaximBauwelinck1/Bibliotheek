import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BoekenList from './pages/Boeken/BoekenList.jsx';
import About from './pages/About/About.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import BoekDetail from './components/boeken/BoekDetail.jsx';
import Layout from './pages/Layout.jsx';
import { Navigate } from 'react-router-dom';
const router = createBrowserRouter([
  {
    element: <Layout />, 
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
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);