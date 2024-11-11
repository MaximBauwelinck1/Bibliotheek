import BoekPaneel from '../../components/dashboard/boekpaneel';
import ReservatiesPaneel from '../../components/dashboard/reservatiepaneel';
import GebruikersPaneel from '../../components/dashboard/gebruikerpaneel';
import * as dashboard from './../../css/Dashboard.module.css';
import DashboardMenu from '../../components/dashboard/dashboardMenu';
import { useState } from 'react';
import * as API from '../../api/index';
import useSWR from 'swr';

const Dashbord = ({init_menu='boeken'}) => {
  const {
    data: user,
    isLoading,
    error,
  }  = useSWR(() => ('gebruikers/8a128b24-411e-4312-8618-e0c0c72bcb41', API.getById));
  
  const [menu,setMenu] = useState(init_menu);
  console.log(menu);
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