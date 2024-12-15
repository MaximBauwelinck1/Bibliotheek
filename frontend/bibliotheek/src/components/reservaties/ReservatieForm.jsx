import * as styles from '../../css/Form.module.css';
import { useForm } from 'react-hook-form';
import {  useNavigate } from 'react-router';
  
const LEGE_RESERVATIE = {
  status: undefined,
  boek_kopie:{
    id:undefined,
  },
  gebruiker:{
    id:undefined,
  },
  einddatum: undefined,
};

export default function ReservatieForm({reservatie=LEGE_RESERVATIE,saveReservatie}) {
  const navigate = useNavigate();
  const { register, handleSubmit,formState: {isValid,isSubmitting,isValidating,isLoading }, reset } = useForm({
    mode: 'onBlur',
    defaultValues: {
      status:reservatie.status,
      boek_kopie_id: reservatie.boek_kopie.id,
      gebruiker_id: reservatie.gebruiker.id,
      einddatum:reservatie.einddatum 
        ? new Date(reservatie.einddatum).toISOString().split('T')[0]
        : undefined,
    },
  });

  const onSubmit = async (values) => {
    const formattedData = reservatie?.id?{
      status:values.status,
      einddatum:values.einddatum,
    }:values;
    console.log(values.einddatum);
    if (!isValid) return;
    await saveReservatie({
      id: reservatie?.id,
      values:formattedData}, {
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
        <label htmlFor="boek_kopie_id" className={styles.inputLabel}>
          Boek kopie ID:
        </label>
        <input
          {...register('boek_kopie_id',{required:true})}
          id="boek_kopie_id"
          name="boek_kopie_id"
          type="text"
          className={styles.textInput}
          readOnly={!!reservatie?.id}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="gebruiker_id" className={styles.inputLabel}>
          Gebruiker ID:
        </label>
        <input
          {...register('gebruiker_id',{required:true})}
          id="gebruiker_id"
          name="gebruiker_id"
          type="text"
          className={styles.textInput}
          readOnly={!!reservatie?.id}
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
            validate: (val) => val == 'actief' || val == 'niet-actief',
          })}
          id="status"
          name="status"
          className={styles.selectInput}
          required
        >
          <option value="" disabled>
            -- Kies een status --
          </option>
          <option value="actief">Actief</option>
          <option value="niet-actief">Niet-actief</option>
        </select>
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
        { isSubmitting || isLoading || isValidating? <div className='spinner-border'></div> :reservatie?.id
          ? 'Werk reservatie bij'
          : 'Maak een nieuwe reservatie aan'}
      </button>
    </form>
  );
}
