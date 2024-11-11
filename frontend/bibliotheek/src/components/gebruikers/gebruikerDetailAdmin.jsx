import * as styles from '../../css/GebruikerDetail.module.css';
const GebruikerDetailAdmin = (props) =>{
  const datum_opties2 = { year: 'numeric', month: 'long', day: 'numeric',hour: 'numeric',minute:'numeric' };
  return(
    <div className={styles.userCard}>
      <div className={styles.userInfo}>
        <h3 className={styles.userName}>{props.voornaam} {props.achternaam}</h3>
        <p><strong>ID:</strong> {props.id}</p>
        <p><strong>Email:</strong> {props.email}</p>
        <p><strong>Geboortedatum:</strong> {new Date(props.geboortedatum).toLocaleDateString()}</p>
        <p><strong>Rol:</strong> {props.rol}</p>
        <p><strong>Aangemaakt:</strong> 
          {new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(props.aangemaakt))}
        </p>
        <p><strong>Upgedate:</strong>
          {new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(props.upgedate))}
        </p>
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.updateButton} >Update</button>
        <button className={styles.deleteButton}>Delete</button>
      </div>
    </div>
  );
};

export default GebruikerDetailAdmin;