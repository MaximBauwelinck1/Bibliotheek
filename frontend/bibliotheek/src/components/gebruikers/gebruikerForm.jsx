import * as styles from '../../css/Form.module.css';
import { useForm } from 'react-hook-form';
import {  useNavigate } from 'react-router';
  
const LEGE_GEBRUIKER = {
  voornaam: undefined,
  achternaam: undefined,
  rol:undefined,
  geboortedatum: undefined,
  email:undefined,
  hashed_password:undefined,
};

export default function GebruikerForm({gebruiker=LEGE_GEBRUIKER,saveGebruiker}) {
  const navigate = useNavigate();
  const { register, handleSubmit,formState: {isValid }, reset } = useForm({
    mode: 'onBlur',
    defaultValues: {
      voornaam:gebruiker.voornaam,
      achternaam:gebruiker.achternaam,
      rol:gebruiker.rol,
      geboortedatum:gebruiker.geboortedatum 
        ? new Date(gebruiker.geboortedatum).toISOString().split('T')[0]
        : undefined,
      email:gebruiker.email,
      hashed_password:gebruiker.hashed_password,
    },
  });

  const onSubmit = async (values) => {
    if (!isValid) return;
    await saveGebruiker({
      id: gebruiker?.id,
      values}, {
      throwOnError: false,
      onSuccess: () =>{
        reset();
        navigate('/dashboard/gebruikers');
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${styles.formContainer} w-50 mb-3`}>
      <div className={styles.inputGroup}>
        <label htmlFor="voornaam" className={styles.inputLabel}>
          Voornaam:
        </label>
        <input
          {...register('voornaam',{required:true})}
          id="voornaam"
          name="voornaam"
          type="text"
          className={styles.textInput}
          required
          readOnly={!!gebruiker?.id}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="achternaam" className={styles.inputLabel}>
          Achternaam:
        </label>
        <input
          {...register('achternaam',{required:true})}
          id="achternaam"
          name="achternaam"
          type="text"
          className={styles.textInput}
          required
          readOnly={!!gebruiker?.id}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="geboortedatum" className={styles.inputLabel}>
          Geboortedatum:
        </label>
        <input
          {...register('geboortedatum',{required:true,valueAsDate:true})}
          id="geboortedatum"
          name="geboortedatum"
          type="date"
          className={styles.textInput}
          readOnly={!!gebruiker?.id}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="rol" className={styles.inputLabel}>
          Permissies:
        </label>
        <select  {...register('rol', {
          required: true,
          validate: (val) => val === 'user' || val === 'admin'})}
        id="rol" name="rol" className={styles.selectInput} required>
          <option value="" disabled>
            -- Kies een rol --
          </option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.inputLabel}>
          Emailadres:
        </label>
        <input
          {...register('email',{required:true})}
          id="email"
          name="email"
          type="email"
          className={styles.textInput}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="hashed_password" className={styles.inputLabel}>
          Wachtwoord:
        </label>
        <input
          {...register('hashed_password',{required:true})}
          id="hashed_password"
          name="hashed_password"
          type="password"
          className={styles.textInput}
          required
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        {gebruiker?.id
          ? 'Werk Gebruiker bij'
          : 'Maak nieuwe gebruiker aan'}
      </button>
    </form>
  );
}
