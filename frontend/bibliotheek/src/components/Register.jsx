import { useForm } from 'react-hook-form';
import styles from '../css/Register.module.css';
import { useMemo } from 'react';
import ToonError from './ToonError';
  
export default function Register({ registerTrigger, error,loading }) {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const validationRules = useMemo(()=> ({
    email: {
      required: 'Email mag niet leeg zijn.',
    },
    password: {
      required: 'Wachtwoord mag niet leeg zijn.',  
    },
    voornaam:{ required: 'Voornaam is verplicht' },
    achternaam:{ required: 'Achternaam is verplicht' },
    geboortedatum: { required: 'Geboortedatum is verplicht' },
    confirmPassword:{
      required: 'Bevestig wachtwoord is verplicht',
      validate: (value) =>{
        const password = getValues('password');
        return value === password || 'Wachtwoorden komen niet overeen';
      },
    },
        
  }),[getValues]);

  const onSubmit = async (values) => {
    try {
      await registerTrigger({
        voornaam: values.voornaam,
        achternaam: values.achternaam,
        geboortedatum: values.geboortedatum,
        email: values.email,
        password: values.password,
      });
      reset();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
 
  let errorStack ='';
  if(error){
    Object.values(error.response.data.details.body).map((val)=>{
      val.map((val2)=>{
        errorStack += `${val2.message} \n`;
      });
    });
  }

  const errorBericht = error? errorStack:'';
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.title}>Registreren bij bibliotheek Temse</h1>
        <ToonError isOpen={error} title='Fout bij registreren' message={errorBericht}/>
        <div className={styles.field}>
          <label htmlFor="voornaam" className={styles.label}>Voornaam</label>
          <input
            id="voornaam"
            type="text"
            {...register('voornaam' ,validationRules.voornaam)}
            className={styles.input}
          />
          {errors.voornaam && <p className={styles.error}>{errors.voornaam.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="achternaam" className={styles.label}>Achternaam</label>
          <input
            id="achternaam"
            type="text"
            {...register('achternaam',validationRules.achternaam )}
            className={styles.input}
          />
          {errors.achternaam && <p className={styles.error}>{errors.achternaam.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="geboortedatum" className={styles.label}>Geboortedatum</label>
          <input
            id="geboortedatum"
            type="date"
            {...register('geboortedatum',validationRules.geboortedatum )}
            className={styles.input}
          />
          {errors.geboortedatum && <p className={styles.error}>{errors.geboortedatum.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            {...register('email',validationRules.email )}
            className={styles.input}
          />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            {...register('password', validationRules.password)}
            className={styles.input}
          />
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword',validationRules.confirmPassword )}
            className={styles.input}
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" className={styles.submitButton}>
          { !loading? 'Registreren': <div className='spinner-border'></div>}
        </button>
      </form>
    </div>
  );
}
