import { useState } from 'react';
import * as styles from '../../css/Form.module.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import ToonBevestiging from '../ToonBevestiging';
import * as buttonStyles from '../../css/ReservatieDetail.module.css';
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
  auteur:{
    achternaam: undefined,
    geboortedatum: undefined,
    nationaliteit: undefined,
    biografie: undefined,
  },
};
const genres = [
  'Fictie', 'Non Fictie', 'Mysterie', 'Fantasie', 
  'Science fiction', 'Biografie', 'Romantiek', 
  'Geschiedenis', 'Dystopisch', 'Southern-gothic', 
  'Post-apocalyptisch', 'Anti-war', 'Tragedie', 
  'Avontuur', 'Memoir', 'Thriller',
];
const talen = [ 'Nederlands','Frans','Engels','Zweeds','Duits','Russisch','Portugees'];

export default function BoekForm({ boek = LEEG_BOEK,saveBoek,saveKopie,DeleteKopie }) {
  const [toonBevesteging,setToonBevesteging] = useState(false);
  const [onSuccesMethode,setOnSuccesMethode] = useState();
  const aantalGereserveerd = boek.totale_kopieen-boek.vrije_kopieen;
  const [vrijeKopieen, setVrijeKopieen] = useState(0);
  const [totaleKopieen, setTotaleKopieen] = useState(0);
  useEffect(() => {
    if (boek?.id) {
      setVrijeKopieen(boek.vrije_kopieen || 0);
      setTotaleKopieen(boek.totale_kopieen || 0);
    }
  }, [boek]);
  
  const handleTotaleKopieenChange = (e) => {
    const value = e.target.valueAsNumber;
    setTotaleKopieen(value);
    if (!boek?.id || vrijeKopieen === totaleKopieen) {
      setVrijeKopieen(value);
    }
  };
  const voegExemplaarToe = () => {
    setOnSuccesMethode(() => {
      return () => {
        saveKopie({
          values: {
            status: 'beschikbaar',
            boek_id: boek?.id,
          },
        }, {
          throwOnError: false,
        });
        setToonBevesteging(false);  
      };
    });
    setToonBevesteging(true);  
  };
  
  const deleteExemplaar = () => {
    setOnSuccesMethode(() => {
      return () => {
        DeleteKopie(
          { id: boek?.id },
          { throwOnError: false },
        );
        setToonBevesteging(false);  
      };
    });
    setToonBevesteging(true);  
  };
  
  const handleVrijeKopieenChange = (e) => {
    const value = e.target.valueAsNumber;
    setVrijeKopieen(value);
  };
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors,isValid }, reset } = useForm({
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
      vrije_kopieen: vrijeKopieen,
      totale_kopieen: totaleKopieen,
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
    if(!boek?.id){
      formattedData.vrije_kopieen= vrijeKopieen,
      formattedData.totale_kopieen= totaleKopieen;
    }
    await saveBoek({
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
    <>
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
          <label htmlFor="genre" className={styles.inputLabel}>
            Genre:
          </label>
          <select
            {...register('genre', {
              required: true,
              validate: (val) => genres.includes(val),
            })}
            id="genre"
            name="genre"
            className={styles.selectInput}
            disabled={!!boek?.id}
            required
          >
            <option value="" disabled>
              -- Kies een genre --
            </option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
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
          <label htmlFor="taal" className={styles.inputLabel}>
            Taal:
          </label>
          <select
            {...register('taal', {
              required: true,
              validate: (val) => talen.includes(val),
            })}
            id="taal"
            name="taal"
            className={styles.selectInput}
            disabled={!!boek?.id}
            required
          >
            <option value="" disabled>
              -- Kies een taal --
            </option>
            {talen.map((taal) => (
              <option key={taal} value={taal}>
                {taal}
              </option>
            ))}
          </select>
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
            {...register('vrije_kopieen', { required: true,  max: {
              value: totaleKopieen,
              message: `Waarde moet minstens ${ totaleKopieen} zijn.`,
            },
            min: {
              value: 0,
              message: 'Waarde moet groter als 0 zijn.',
            } })}
            id="vrije_kopieen"
            name="vrije_kopieen"
            type="number"
            className={styles.textInput}
            value={vrijeKopieen}
            onChange={handleVrijeKopieenChange}
            readOnly
            required
          />
        </div>
        {errors.vrije_kopieen && (
          <b className={styles.errorMessage}>{errors.vrije_kopieen.message}</b>
        )}
        <div className={styles.inputGroup}>
          <label htmlFor="totale_kopieen" className={styles.inputLabel}>Totale kopieën:</label>
          <input
            {...register('totale_kopieen', { required: true ,  min: {
              value: aantalGereserveerd,
              message: `Waarde moet minstens ${ aantalGereserveerd} zijn.`,
            }})}
            id="totale_kopieen"
            name="totale_kopieen"
            type="number"
            className={styles.textInput}
            value={totaleKopieen}
            onChange={handleTotaleKopieenChange}
            readOnly={boek?.id}
            required
          />
        </div>
        {errors.totale_kopieen && (
          <b className={styles.errorMessage}>{errors.totale_kopieen.message}</b>
        )}
        <div className={buttonStyles.buttonGroup}>
          <button className={buttonStyles.updateButton} onClick={(e)=>{
            e.preventDefault(); 
            voegExemplaarToe();
          }} type='button'>
            {/* type='button' zorgt ervoor dat default behavior niet wordt aangeroepen en form submit wordt*/}
            Voeg nieuw exemplaar toe
          </button>
          <button className={buttonStyles.deleteButton} type="button"onClick={(e) =>{
            e.preventDefault(); 
            deleteExemplaar();
          }}>
            Verwijder een beschikbaar exemplaar
          </button>
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
      <ToonBevestiging
        isOpen={toonBevesteging}
        onClose={() => setToonBevesteging(false)}
        onConfirm={onSuccesMethode}
        title="Bevestiging keuze"
        message="Wil je zeker deze actie uitvoeren"
      />
    </>
  );
}
