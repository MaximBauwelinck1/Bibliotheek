import * as API from '../../api';
import AsyncData from '../../components/AsyncData'; 
import useSWRMutation from 'swr/mutation';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PasswordReset from '../../components/gebruikers/passwordReset';

export default function ResetpasswordPage() {
  const navigate = useNavigate();
  const { trigger: savegebruiker, error: saveError } = useSWRMutation(
    'gebruikers/passwordReset',
    API.post,
    {onSuccess:()=>{
      navigate('/login');
      alert('Je wachtwoord is succesvol reset.');
    }},
  );
  console.log(saveError);
  return (
    <>
      <Link to={'/'}> <button className='top_left_button' >Terugkeren</button></Link>
      <AsyncData error={ saveError} loading={false}>
        <PasswordReset
          saveGebruiker={savegebruiker} error={saveError} />  
      </AsyncData>
    </>
  );
}
