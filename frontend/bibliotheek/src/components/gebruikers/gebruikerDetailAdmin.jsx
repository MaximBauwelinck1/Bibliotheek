import * as styles from '../../css/GebruikerDetail.module.css';
import { useState } from 'react';
import ToonBevestiging from '../ToonBevestiging';
const GebruikerDetailAdmin = ({onDelete,onUpdate,...gebruiker}) =>{
  const datum_opties2 = { year: 'numeric', month: 'long', day: 'numeric',hour: 'numeric',minute:'numeric' };
  const handelDelete = ()=>{
    onDelete(gebruiker.id);
  };
  const [toonBevesteging, setToonBevesteging] = useState(false);
  return(
    <div className={styles.userCard}>
      <div className={styles.userInfo}>
        <h3 data-cy='naam'className={styles.userName}>{gebruiker.voornaam} {gebruiker.achternaam}</h3>
        <p><strong>ID:</strong> {gebruiker.id}</p>
        <p data-cy='email'><strong>Email:</strong> {gebruiker.email}</p>
        <p><strong>Geboortedatum:</strong> {new Date(gebruiker.geboortedatum).toLocaleDateString()}</p>
        <p><strong>Rol:</strong> {gebruiker.rol}</p>
        <p><strong>Archivering:</strong> {gebruiker.actief?'Actief':'Gearchiveerd'}</p>
        <p><strong>Aangemaakt:</strong> 
          {new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(gebruiker.aangemaakt))}
        </p>
        <p><strong>Upgedate:</strong>
          {new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(gebruiker.upgedate))}
        </p>
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.updateButton}onClick={()=>onUpdate(gebruiker.id)}>  Update</button>
        <button className={styles.deleteButton} onClick={() => setToonBevesteging(true)}>Delete</button>
      </div>
      <ToonBevestiging
        isOpen={toonBevesteging}
        onClose={() => setToonBevesteging(false)}
        onConfirm={handelDelete}
        title="Bevestig verwijdering"
        message="Wil je zeker deze gebruiker verwijderen?"
      />
    </div>
  );
};

export default GebruikerDetailAdmin;