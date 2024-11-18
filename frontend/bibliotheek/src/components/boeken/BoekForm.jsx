import * as styles from '../../css/Form.module.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

const LEEG_BOEK = {
  ISBN: undefined,
  titel: undefined,
  genre: undefined,
  publicatie_datum: undefined,
  taal: undefined,
  paginas: undefined,
  vrije_kopieen: undefined,
  totale_kopieen: undefined,
  beschrijving: undefined,
  cover_uri: undefined,
  voornaam: undefined,
  achternaam: undefined,
  geboortedatum: undefined,
  nationaliteit: undefined,
  biografie: undefined,
};

export default function BoekForm({ boek = LEEG_BOEK, saveGebruiker }) {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isValid }, reset } = useForm({
    mode: 'onBlur',
    defaultValues: {
      ISBN: boek.ISBN,
      titel: boek.titel,
      genre: boek.genre,
      publicatie_datum: boek.publicatie_datum 
        ? new Date(boek.publicatie_datum).toISOString().split('T')[0]
        : undefined,
      taal: boek.taal,
      paginas: boek.paginas,
      vrije_kopieen: boek.vrije_kopieen,
      totale_kopieen: boek.totale_kopieen,
      beschrijving: boek.beschrijving,
      cover_uri: boek.cover_uri,
      voornaam: boek.auteur.voornaam,
      achternaam: boek.auteur.achternaam,
      geboortedatum: boek.auteur.geboortedatum 
        ? new Date(boek.auteur.geboortedatum).toISOString().split('T')[0]
        : undefined,
      nationaliteit: boek.auteur.nationaliteit,
      biografie: boek.auteur.biografie,
    },
  });

  const onSubmit = async (values) => {
    const formattedData = {
      ISBN: values.ISBN,
      titel: values.titel,
      genre: values.genre,
      publicatie_datum: values.publicatie_datum,
      taal: values.taal,
      paginas: values.paginas,
      vrije_kopieen: values.vrije_kopieen,
      totale_kopieen: values.totale_kopieen,
      beschrijving: values.beschrijving,
      cover_uri: values.cover_uri,
      auteur: {
        voornaam: values.voornaam,
        achternaam: values.achternaam,
        geboortedatum: values.geboortedatum,
        nationaliteit: values.nationaliteit,
        biografie: values.biografie,
      },
    };
    if (!isValid) return;
    await saveGebruiker({
      id: boek?.id,
      values:formattedData,
    }, {
      throwOnError: false,
      onSuccess: () => {
        reset();
        navigate('/dashboard/boeken');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${styles.formContainer} w-50 mb-3`}>
      <h2>Boek</h2>
      <div className={styles.inputGroup}>
        <label htmlFor="ISBN" className={styles.inputLabel}>ISBN:</label>
        <input
          {...register('ISBN', { required: true })}
          id="ISBN"
          name="ISBN"
          type="text"
          className={styles.textInput}
          readOnly={!!boek?.id}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="titel" className={styles.inputLabel}>Titel:</label>
        <input
          {...register('titel', { required: true })}
          id="titel"
          name="titel"
          type="text"
          className={styles.textInput}
          readOnly={!!boek?.id}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="genre" className={styles.inputLabel}>Genre:</label>
        <input
          {...register('genre', { required: true })}
          id="genre"
          name="genre"
          type="text"
          className={styles.textInput}
          readOnly={!!boek?.id}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="publicatie_datum" className={styles.inputLabel}>Publicatiedatum:</label>
        <input
          {...register('publicatie_datum', { required: true })}
          id="publicatie_datum"
          name="publicatie_datum"
          type="date"
          className={styles.textInput}
          readOnly={!!boek?.id}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="taal" className={styles.inputLabel}>Taal:</label>
        <input
          {...register('taal', { required: true })}
          id="taal"
          name="taal"
          type="text"
          className={styles.textInput}
          readOnly={!!boek?.id}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="paginas" className={styles.inputLabel}>Paginas:</label>
        <input
          {...register('paginas', { required: true })}
          id="paginas"
          name="paginas"
          type="number"
          className={styles.textInput}
          readOnly={!!boek?.id}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="vrije_kopieen" className={styles.inputLabel}>Vrije kopieën:</label>
        <input
          {...register('vrije_kopieen', { required: true })}
          id="vrije_kopieen"
          name="vrije_kopieen"
          type="number"
          className={styles.textInput}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="totale_kopieen" className={styles.inputLabel}>Totale kopieën:</label>
        <input
          {...register('totale_kopieen', { required: true })}
          id="totale_kopieen"
          name="totale_kopieen"
          type="number"
          className={styles.textInput}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="beschrijving" className={styles.inputLabel}>Beschrijving:</label>
        <textarea
          {...register('beschrijving', { required: true })}
          id="beschrijving"
          name="beschrijving"
          className={styles.textInput}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="cover_uri" className={styles.inputLabel}>Cover URI:</label>
        <input
          {...register('cover_uri', { required: true })}
          id="cover_uri"
          name="cover_uri"
          type="text"
          className={styles.textInput}
          required
        />
      </div>

      <h2>Auteur</h2>
      <div className={styles.inputGroup}>
        <label htmlFor="voornaam" className={styles.inputLabel}>Voornaam:</label>
        <input
          {...register('voornaam', { required: true })}
          id="voornaam"
          name="voornaam"
          type="text"
          className={styles.textInput}
          readOnly={!!boek?.id}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="achternaam" className={styles.inputLabel}>Achternaam:</label>
        <input
          {...register('achternaam', { required: true })}
          id="achternaam"
          name="achternaam"
          type="text"
          className={styles.textInput}
          readOnly={!!boek?.id}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="geboortedatum" className={styles.inputLabel}>Geboortedatum:</label>
        <input
          {...register('geboortedatum', { required: true, valueAsDate: true })}
          id="geboortedatum"
          name="geboortedatum"
          type="date"
          className={styles.textInput}
          readOnly={!!boek?.id}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="nationaliteit" className={styles.inputLabel}>Nationaliteit:</label>
        <input
          {...register('nationaliteit', { required: true })}
          id="nationaliteit"
          name="nationaliteit"
          type="text"
          className={styles.textInput}
          readOnly={!!boek?.id}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="biografie" className={styles.inputLabel}>Biografie:</label>
        <textarea
          {...register('biografie', { required: true })}
          id="biografie"
          name="biografie"
          className={styles.textInput}
          required
        />
      </div>
      
      <button type="submit" className={styles.submitButton}>
        {boek?.id ? 'Werk Boek bij' : 'Maak een nieuw Boek aan'}
      </button>
    </form>
  );
}
