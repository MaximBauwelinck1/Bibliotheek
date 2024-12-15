import { useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import styles from '../css/Notfound.module.css';

const ServerError = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/'; 
    }, 15000); 

    return () => clearTimeout(timer);
  }, []); 
  return (
    <>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Er is een fout opgetreden</h1>
          <p className={styles.message}>
            Onze excuses, er is een fout opgetreden. Je kan proberen de pagina te vernieuwen.
            Als de fout zich nog blijft voort doen neem dan contact op met een administrator.
          </p>
          <p style={{marginBottom:'1em'}}>Je wordt automatisch doorgestuurd naar de homepagina na 15 seconden...</p>
          <Link to={'/'} className={styles.homeButton}>Home Page</Link>
        </div>
      </div>
    </>
  );
};

export default ServerError;
