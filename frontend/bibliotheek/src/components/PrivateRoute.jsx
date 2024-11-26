import { Navigate, Outlet, useLocation } from 'react-router-dom'; 
import { useAuth } from '../contexts/auth';
import VerbodenToegang from './VerbodenToegang';

export default function PrivateRoute({permissie}) {
  const { ready, isAuthed,user,error } = useAuth();
  const { pathname } = useLocation(); 
  
  if (!ready) {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <h1>Laden...</h1>
            <p>
              Please wait while we are checking your credentials and loading the
              application.
            </p>
          </div>
        </div>
      </div>
    );
  }else{
    
    if(user && user.rol != permissie){
      return(
        <VerbodenToegang/>
      );
    } else if (isAuthed && !error) {
      return <Outlet />;
    }
  }

  return <Navigate replace to={`/login?redirect=${pathname}`} />; 
}
