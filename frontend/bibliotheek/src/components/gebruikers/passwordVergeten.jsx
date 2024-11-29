import { useForm } from 'react-hook-form';
import styles from '../../css/PasswordVergeten.module.css';

const Passwordvergeten = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const handleFormSubmit = async (data) => {
    await onSubmit({
      values:{
        email: data.email,
      },
    });
   
  };
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Wachtwoord Reset</h2>
      <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Voer uw email addres in:
          </label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email is verplicht' })}
            className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
            placeholder="you@example.com"
          />
          {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`${styles.button} ${isSubmitting ? styles.disabledButton : ''}`}
        >
          {isSubmitting ? 'Versturen...' : 'Verstuur reset email'}
        </button>
      </form>
    </div>
  );
};

export default Passwordvergeten;
