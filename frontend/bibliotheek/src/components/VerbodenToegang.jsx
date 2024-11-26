import styles from '../css/VerbodenToegang.module.css';
import { Link } from 'react-router-dom';
const VerbodenToegang = () => {

  return (
    <>
      <Link to={'/boeken'}> <button className='top_left_button' >Terugkeren</button></Link> 
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Geen Toegang</h1>
          <p className={styles.message}>
            U heeft geen toestemming om deze pagina te bekijken. 
            Neem contact op met een beheerder als u denkt dat dit een vergissing is.
          </p>
        </div>
      </div>
    </>
  );
};

export default VerbodenToegang;
