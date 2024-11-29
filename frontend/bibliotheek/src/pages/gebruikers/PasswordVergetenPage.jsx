import Passwordvergeten from '../../components/gebruikers/passwordVergeten';
import useSWRMutation from 'swr/mutation';
import * as API from '../../api/index';
import AsyncData from '../../components/AsyncData';
import { useNavigate } from 'react-router';

const PasswordVergeten = ()=>{
  const navigate = useNavigate();
  const { trigger: resetmail, error: sendError } = useSWRMutation(
    'gebruikers/passwordForgot',
    API.save,
    {onSuccess:()=>{
      navigate('/boeken');
      alert('Er is een mail verstuurd indien dit acount bestaat');
    }},
  );
  return(
    <AsyncData loading={false} error={sendError}>
      <Passwordvergeten onSubmit={resetmail}/>
    </AsyncData>
   
  );
};
export default PasswordVergeten;