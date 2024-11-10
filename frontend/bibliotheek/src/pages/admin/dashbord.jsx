import BoekPaneel from '../../components/dashboard/boekpaneel';
import ReservatiesPaneel from '../../components/dashboard/reservatiepaneel';
import GebruikersPaneel from '../../components/dashboard/gebruikerpaneel';
import * as dashboard from './../../css/Dashboard.module.css';

const Dashbord = () => {
  return(
    <div className={dashboard.dashboard}>
      <div className={dashboard.boeken}>
        <BoekPaneel />
      </div>
      <div className={dashboard.reservaties }>
        <ReservatiesPaneel/>
      </div>
      <div className={dashboard.gebruikers}>
        <GebruikersPaneel/>
      </div>
    </div>
  );
};

export default Dashbord;