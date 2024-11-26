import Login from '../components/Login';
import { useAuth } from '../contexts/auth';
import { useNavigate } from 'react-router';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom'; 
import { Link } from 'react-router-dom';
export default function LoginPage() {
  const { search } = useLocation();
  const { error, loading, login } = useAuth(); 
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async ({ email, password }) => {
      const loggedIn = await login(email, password);
      if (loggedIn) {
        const params = new URLSearchParams(search);
        navigate({
          pathname: params.get('redirect') || '/',
          replace: true,
        });
      }
    },
    [login, navigate, search],
  );
  return (
    <> 
      <Link to={'/boeken'}> <button className='top_left_button' >Terugkeren</button></Link>    
      <Login login={handleLogin} error={error} loading={loading}/>
    </>
  );
}
