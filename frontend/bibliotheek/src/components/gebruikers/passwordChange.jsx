import * as styles from '../../css/Login.module.css';
import { useForm } from 'react-hook-form';
import {  useNavigate } from 'react-router';
import { useMemo } from 'react';
import ToonError from '../ToonError';
import PasswordStrength from '../PasswordStrength';

let errorStack ='';
export default function PasswordChange({gebruiker,saveGebruiker,error,loading}) {
  const navigate = useNavigate();
  const { register, handleSubmit,formState: {isValid,errors }, reset,getValues,watch } = useForm({
    mode: 'onBlur',
    defaultValues:{
      password: '',
    },
  });
  const validationRules = useMemo(()=> ({
    password: {
      required: 'Wachtwoord mag niet leeg zijn.',  
      minLength: {
        value: 8,  
        message: 'Wachtwoord moet minimaal 8 tekens lang zijn.' ,
      },
    },
    confirmPassword:{
      required: 'Bevestig wachtwoord is verplicht',
      validate: (value) =>{
        const password = getValues('password');
        return value === password || 'Wachtwoorden komen niet overeen';
      },
    },
        
  }),[getValues]);

  const onSubmit = async (values) => {
    console.log(gebruiker?.id);
    if (!isValid) return;
    await saveGebruiker({
      id: gebruiker?.id,
      values:{
        password:values.password,
      }}, {
      throwOnError: false,
      onSuccess: () =>{
        reset();
        navigate(`/gebruikers/${gebruiker.id}`);
      },
    });
  };
  if(error){
    Object.values(error.response.data.details.body).map((val)=>{
      val.map((val2)=>{
        errorStack += `${val2.message} \n`;
      });
    });
  }

  const errorBericht = error? errorStack:'';
  return (
    <div className={styles.bibliotheek_login}>
      <div className={styles.login_container} style={{width:'500px'}}>
        <h2 className={styles.login_titel}>Wachtwoord veranderen</h2>
        <ToonError isOpen={error} title='Fout bij wachtwoord veranderen' message={errorBericht}/>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.login_form}>
          <div className={styles.field}>
            <input
              type='password'
              id='password'
              placeholder='wachtwoord'
              required
              className={styles.input}
              {...register('password', validationRules.password)}
            />
            {errors.password && <p className={styles.error}>{errors.password.message}</p>}
          </div>

          <div className={styles.field}>
            <input
              type='password'
              id='confirmPassword'
              placeholder='Bevestig wachtwoord'
              className={styles.input}
              required
              {...register('confirmPassword',validationRules.confirmPassword)}
            />
            {errors.confirmPassword && (
              <p className={styles.error}>{errors.confirmPassword.message}</p>
            )}
            <PasswordStrength pwd={watch('password')}/>
          </div>
          <button type="submit" className={styles.login_button}>
            { !loading? 'Aanpassen': <div className='spinner-border'></div>}
          </button>
        </form>
      </div>
    </div>
  );
}
