import { useForm } from 'react-hook-form';
import * as styles from '../css/Login.module.css';
import ToonError from './ToonError';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
const validationRules = {
  email: {
    required: 'Email mag niet leeg zijn.',
  },
  password: {
    required: 'Wachtwoord mag niet leeg zijn.',
   
  },
};

export default function Login({ login, error,loading }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const opt_error = searchParams.get('error');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      await login({
        email: values.email,
        password: values.password,
      });
      reset();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const errorBericht = error&& error.response? error.response.data.message:
    error && error.name === 'AxiosError'?error.message:
      opt_error === 'expired'? 'Je bent automatisch weer uitgelogd na een bepaalde periode':''; 
  // om netwerkerror te vermijden indien back end niet werkt, doet pagina crashen omdat error geen response bevat
  return (
    <div className={styles.bibliotheek_login}>
      <div className={styles.login_container}>
        <h2 className={styles.login_titel}>Aanmelden bij bibliotheek Temse</h2>
        <ToonError isOpen={error || opt_error} title='Fout bij aanmelden' message={errorBericht}/>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.login_form}>
          <input
            type='email'
            id='email'
            className={styles.input}
            placeholder='E-mailadres'
            data-cy='email_input'
            {...register('email', validationRules.email)}
          />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          <input
            type='password'
            id='password'
            placeholder='wachtwoord'
            data-cy='password_input'
            className={styles.input}
            {...register('password', validationRules.password)}
          />
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
          <button type="submit" className={styles.login_button} data-cy='submit_btn'>
            { !loading? 'Aanmelden': <div className='spinner-border'></div>}
          </button>
        </form>

        <div className={styles.login_links}>
          <Link to='/wachtwoord_vergeten' className={styles.vergeten_link}>  
            Wachtwoord vergeten
          </Link>
          <span className={styles.dot_divider}>·</span>
          <Link to='/register' className={styles.register_link}>
            Registreren
          </Link>

        </div>
      </div>
    </div>
  );
}
