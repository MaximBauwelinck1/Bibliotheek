import BoekPaneel from '../../components/dashboard/boekpaneel';
import ReservatiesPaneel from '../../components/dashboard/reservatiepaneel';
import GebruikersPaneel from '../../components/dashboard/gebruikerpaneel';
import * as dashboard from './../../css/Dashboard.module.css';
import DashboardMenu from '../../components/dashboard/dashboardMenu';
import { useState } from 'react';

const Dashbord = () => {
  const [menu,setMenu] = useState('boeken');
  const handlclick = (btn) =>{
    setMenu(btn);
  };
  return (
    <>
      <DashboardMenu onAction={handlclick} />
      <div className={dashboard.dashboard}>  
        {menu === 'boeken' && <BoekPaneel />}
        {menu === 'gebruikers' && <GebruikersPaneel />}
        {menu === 'reservaties' && <ReservatiesPaneel />}
      </div>
    </>
  );
};

export default Dashbord;