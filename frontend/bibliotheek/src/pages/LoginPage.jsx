import Login from '../components/Login';
import { useAuth } from '../contexts/auth';
import { useNavigate } from 'react-router';
import { useCallback } from 'react';

export default function LoginPage() {
  const { error, loading, login } = useAuth(); 
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async ({ email, password }) => {
      const loggedIn = await login(email, password);
      if (loggedIn) {
        navigate({
          pathname: '/',
          replace: true,
        });
      }
    },
    [login, navigate],
  );
  return (
    <>
      <Login login={handleLogin} error={error} loading={loading}/>
    </>
  );
}
