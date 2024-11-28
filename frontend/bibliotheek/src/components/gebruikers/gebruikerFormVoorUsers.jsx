import * as styles from '../../css/Form.module.css';
import { useForm } from 'react-hook-form';
import {  useNavigate } from 'react-router';
  
const LEGE_GEBRUIKER = {
  voornaam: undefined,
  achternaam: undefined,
  geboortedatum: undefined,
  email:undefined,
};

export default function GebruikerFormVoorUsers({gebruiker=LEGE_GEBRUIKER,saveGebruiker}) {
  const navigate = useNavigate();
  const { register, handleSubmit,formState: {isValid }, reset } = useForm({
    mode: 'onBlur',
    defaultValues: {
      voornaam:gebruiker.voornaam,
      achternaam:gebruiker.achternaam,
      geboortedatum:gebruiker.geboortedatum 
        ? new Date(gebruiker.geboortedatum).toISOString().split('T')[0]
        : undefined,
      email:gebruiker.email,
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
        navigate(`/gebruikers/${gebruiker.id}`);
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
          readOnly
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
          readOnly
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
          readOnly
          required
        />
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
      <button type="submit" className={styles.submitButton}>
        Werk profiel bij
      </button>
    </form>
  );
}
