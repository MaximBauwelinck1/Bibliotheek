import BoekPaneel from '../../components/dashboard/boekpaneel';
import ReservatiesPaneel from '../../components/dashboard/reservatiepaneel';
import GebruikersPaneel from '../../components/dashboard/gebruikerpaneel';
import * as dashboard from './../../css/Dashboard.module.css';
import DashboardMenu from '../../components/dashboard/dashboardMenu';
import { useState } from 'react';
import BoekKopiePaneel from '../../components/dashboard/boekkopiePaneel';
const Dashbord = ({init_menu='boeken'}) => {
  const [menu,setMenu] = useState(init_menu);
  const handlclick = (btn) =>{
    setMenu(btn);
  };
  return (
    <>
      <DashboardMenu onAction={handlclick} />
      <div className={dashboard.dashboard} >  
        {menu === 'boeken' && <BoekPaneel />}
        {menu === 'gebruikers' && <GebruikersPaneel />}
        {menu === 'reservaties' && <ReservatiesPaneel />}
        {menu === 'boekkopieen' && <BoekKopiePaneel />}
      </div>
    </>
  );
};

export default Dashbord;