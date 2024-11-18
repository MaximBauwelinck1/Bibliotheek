import * as styles from '../../css/Form.module.css';
import { useForm } from 'react-hook-form';
import {  useNavigate } from 'react-router';
  
const LEGE_RESERVATIE = {
  status: undefined,
  einddatum: undefined,
};

export default function ReservatieForm({reservatie=LEGE_RESERVATIE,saveGebruiker}) {
  console.log(reservatie);
  const navigate = useNavigate();
  const { register, handleSubmit,formState: {isValid }, reset } = useForm({
    mode: 'onBlur',
    defaultValues: {
      status:reservatie.status,
      einddatum:reservatie.einddatum 
        ? new Date(reservatie.einddatum).toISOString().split('T')[0]
        : undefined,
    },
  });

  const onSubmit = async (values) => {
    console.log(values.einddatum);
    if (!isValid) return;
    await saveGebruiker({
      id: reservatie?.id,
      values}, {
      throwOnError: false,
      onSuccess: () =>{
        reset();
        navigate('/dashboard/reservaties');
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${styles.formContainer} w-50 mb-3`}>
      <div className={styles.inputGroup}>
        <label htmlFor="status" className={styles.inputLabel}>
          Status:
        </label>
        <input
          {...register('status',{required:true})}
          id="status"
          name="status"
          type="text"
          className={styles.textInput}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="einddatum" className={styles.inputLabel}>
          Eindatum:
        </label>
        <input
          {...register('einddatum',{required:true})}
          id="einddatum"
          name="einddatum"
          type="date"
          className={styles.textInput}
          required
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        {reservatie?.id
          ? 'Werk reservatie bij'
          : 'Maak een nieuwe reservatie aan'}
      </button>
    </form>
  );
}
