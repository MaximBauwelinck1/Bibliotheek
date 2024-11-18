import * as styles from '../../css/Form.module.css';
import { useForm } from 'react-hook-form';
import {  useNavigate } from 'react-router';
  
const LEGE_KOPIE = {
  status: undefined,
  extra_informatie: undefined,
};

export default function BoekKopieForm({gebruiker: kopie=LEGE_KOPIE,saveGebruiker}) {
  const navigate = useNavigate();
  const { register, handleSubmit,formState: {isValid }, reset } = useForm({
    mode: 'onBlur',
    defaultValues: {
      status:kopie.status,
      extra_informatie:kopie.extra_informatie,
    },
  });

  const onSubmit = async (values) => {
    if (!isValid) return;
    await saveGebruiker({
      id: kopie?.id,
      values}, {
      throwOnError: false,
      onSuccess: () =>{
        reset();
        navigate('/dashboard/boekkopieen');
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
        <label htmlFor="extra_informatie" className={styles.inputLabel}>
          Extra informatie:
        </label>
        <input
          {...register('extra_informatie',{required:true})}
          id="extra_informatie"
          name="extra_informatie"
          type="text"
          className={styles.textInput}
          required
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        {kopie?.id
          ? 'Werk kopie bij'
          : 'Maak een nieuwe kopie aan'}
      </button>
    </form>
  );
}
