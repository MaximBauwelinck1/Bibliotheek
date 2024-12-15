import { useAuth } from '../contexts/auth';
import { useNavigate } from 'react-router';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom'; 
import { Link } from 'react-router-dom';
import Register from '../components/Register';

export default function RegisterPage() {
  const { search } = useLocation();
  const { registerError, loading, register,user } = useAuth(); 
  const navigate = useNavigate();
  if(user){
    navigate('/');
  }
  const handleRegister = useCallback(
    async ({ voornaam,achternaam,geboortedatum,email, password }) => {
      const geregistreerd = await register(voornaam,achternaam,geboortedatum,email, password);
      if (geregistreerd) {
        const params = new URLSearchParams(search);
        navigate({
          pathname: params.get('redirect') || '/',
          replace: true,
        });
      }
    },
    [navigate, register, search],
  );
  return (
    <> 
      <Link to={'/boeken'}> <button className='top_left_button' >Terugkeren</button></Link>    
      <Register registerTrigger={handleRegister} error={registerError} loading={loading}/>
    </>
  );
}
