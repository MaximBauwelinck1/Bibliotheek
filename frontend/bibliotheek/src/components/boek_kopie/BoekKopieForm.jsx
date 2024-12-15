import * as styles from '../../css/Form.module.css';
import { useForm } from 'react-hook-form';
import {  useNavigate } from 'react-router';
  
const LEGE_KOPIE = {
  status: undefined,
  extra_informatie: undefined,
  boek:{
    id:undefined,
  },
};

export default function BoekKopieForm({kopie: kopie=LEGE_KOPIE,saveKopie}) {
  const navigate = useNavigate();
  const { register, handleSubmit,formState: {isValid,isSubmitting }, reset } = useForm({
    mode: 'onBlur',
    defaultValues: {
      status:kopie.status,
      extra_informatie:kopie.extra_informatie,
      boek_id: kopie.boek.id,
    },
  });

  const onSubmit = async (values) => {
    const formattedData = {
      status: values.status,
      extra_informatie: values.extra_informatie,
    };
    if (!isValid) return;
    await saveKopie({
      id: kopie?.id,
      values: kopie?.id?formattedData:values,
    }, {
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
        <label htmlFor="boek_id" className={styles.inputLabel}>
          Boek ID:
        </label>
        <input
          {...register('boek_id',{required:true})}
          id="boek_id"
          name="boek_id"
          type="text"
          className={styles.textInput}
          readOnly={!!kopie?.id}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="status" className={styles.inputLabel}>
          Status:
        </label>
        <select
          {...register('status', {
            required: true,
            validate: (val) => val === 'beschikbaar' || val ==='gereserveerd' || val ==='niet-beschikbaar',
          })}
          id="status"
          name="status"
          className={styles.selectInput}
          required
        >
          <option value="" disabled>
            -- Kies een optie --
          </option>
          <option value="beschikbaar">beschikbaar</option>
          <option value="gereserveerd">gereserveerd</option>
          <option value="niet-beschikbaar">Niet beschikbaar</option>
        </select>
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
      
        { !isSubmitting? kopie?.id
          ? 'Werk kopie bij'
          : 'Maak een nieuwe kopie aan': <div className='spinner-border'></div>}
      </button>
    </form>
  );
}
