import * as styles from '../../css/Form.module.css';
import { useForm } from 'react-hook-form';
import {  useNavigate } from 'react-router';
import { useState } from 'react';
const LEGE_GEBRUIKER = {
  voornaam: undefined,
  achternaam: undefined,
  rol:undefined,
  geboortedatum: undefined,
  email:undefined,
  password:undefined,
};

export default function GebruikerForm({gebruiker=LEGE_GEBRUIKER,saveGebruiker}) {
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  // dit is puur voor render omdat daar de requests 10 langer duren en isSubmitting niet wertk
  const { register, handleSubmit,formState: {isValid,errors,isSubmitting,isLoading,isValidating }, reset } = useForm({
    mode: 'onBlur',
    defaultValues: {
      voornaam:gebruiker.voornaam,
      achternaam:gebruiker.achternaam,
      rol:gebruiker.rol,
      geboortedatum:gebruiker.geboortedatum 
        ? new Date(gebruiker.geboortedatum).toISOString().split('T')[0]
        : undefined,
      email:gebruiker.email,
      password:'',
    },
  });
  console.log(isSubmitting);
  const onSubmit = async (values) => {
    setLoading(true);
    if (!isValid) {
      setLoading(false);
      return;
    }
    const { password, ...restData } = values;
    const formData = password && password.length >= 8 ? { ...restData, password } : restData;
    await saveGebruiker({
      id: gebruiker?.id,
      values:formData}, {
      throwOnError: false,
      onSuccess: () =>{
        reset();
        navigate('/dashboard/gebruikers');
      },
    });
    setLoading(false);
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
          data-cy='voornaam'
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
          data-cy='achternaam'
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="geboortedatum" className={styles.inputLabel}>
          Geboortedatum:
        </label>
        <input
          {...register('geboortedatum',{required:true,valueAsDate:true,
            validate: (value) => value <= new Date() || 'Datum mag niet in de toekomst liggen.'})}
          id="geboortedatum"
          name="geboortedatum"
          type="date"
          className={styles.textInput}
          readOnly={!!gebruiker?.id}
          required
          data-cy='geboortedatum'
        />
      </div>
      {errors.geboortedatum && <p data-cy='geboortedatum_error' className={styles.error}>
        {errors.geboortedatum.message}
      </p>}
      <div className={styles.inputGroup}>
        <label htmlFor="rol" className={styles.inputLabel}>
          Permissies:
        </label>
        <select  {...register('rol', {
          required: true,
          validate: (val) => val === 'user' || val === 'admin'})}
        id="rol" name="rol" className={styles.selectInput} required data-cy='rol'>
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
          data-cy='email'
          className={styles.textInput}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="password" className={styles.inputLabel}>
          Wachtwoord:
        </label>
        <input
          {...register('password',{required:false,  
            validate: (value) => {
              if (!value) return true;
              return value.length >= 8 || 'Wachtwoord moet minstens 8 tekens bevatten';
            }}) }
          id="password"
          name="password"
          type="password"
          className={styles.textInput}
          data-cy='password'
        />
      </div>
      {errors.password && <p data-cy='password_error' className={styles.error}>{errors.password.message}</p>}
      <button type="submit" className={styles.submitButton} data-cy='submit_gebruiker'>
        { isSubmitting || isLoading|| isValidating? <div className='spinner-border'></div> :gebruiker?.id
          ? 'Werk Gebruiker bij'
          : 'Maak een nieuwe gebruiker aan'}
      </button>
    </form>
  );
}
