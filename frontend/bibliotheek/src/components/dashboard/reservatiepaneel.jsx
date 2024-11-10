import AsyncData from '../AsyncData';
import useSWR from 'swr';
import * as API from './../../api/index';
import * as styles from './../../css/BoekTabel.module.css';
import { useMemo,useState } from 'react';

const ReservatiePaneel = () => {
  const werkelijke_kolommen = ['id','boek_kopie_id','gebruiker_id','startdatum_display','einddatum_display','status'];
  const zichtbare_kolommen = ['id','boek kopie id','gebruiker id','startdatum reservatie','einddatum reservatie'
    ,'status'];
  const {
    data: reservaties = [],
    isLoading,
    error,
  } = useSWR('reservaties', API.getAll);
  // om datums leesbaar te maken
  let filteredReservaties = useMemo(() => {
    const datum_opties = { year: 'numeric', month: 'long', day: 'numeric' };
    return [...reservaties].map((res) => {
       
      const formattedDateStartdatum = new Intl.DateTimeFormat('nl-BE', datum_opties).format(new Date(res.startdatum));
      const formattedDateEinddatum = new Intl.DateTimeFormat('nl-BE', datum_opties).format(new Date(res.einddatum));
       
      return { ...res, startdatum_display: formattedDateStartdatum,einddatum_display:formattedDateEinddatum }; 
    });
  }, [reservaties]);
  const [zoekveld, setZoekVeld] = useState('id');
  const [order, setOrder] = useState('asc');
  filteredReservaties =useMemo(() => {
    const string_zoekvelden = ['id','boek kopie id','gebruiker id','status'];
    return [...filteredReservaties].sort((a,b) => {
      if(string_zoekvelden.includes(zoekveld)){
        if (a[zoekveld] > b[zoekveld]) return order === 'asc' ? 1 : -1; 
        if (a[zoekveld] < b[zoekveld]) return order === 'asc' ? -1 : 1;
        return 0;
      }else{
        let parsed_zoekveld;
        switch (zoekveld) { // dit is echt een mess maar ik weet anders niet hoe
          case 'startdatum reservatie':
            parsed_zoekveld = 'startdatum';
            break;
          case 'einddatum reservatie':
            parsed_zoekveld = 'einddatum';
            break;
          default:
            parsed_zoekveld = zoekveld;
            break;
        }
        const dateA = new Date(a[parsed_zoekveld]);
        const dateB = new Date(b[parsed_zoekveld]);
        if (dateA > dateB) return order === 'asc' ? 1 : -1;
        if (dateA < dateB) return order === 'asc' ? -1 : 1;
        return 0;
      }
    
    });
  }, [filteredReservaties, zoekveld,order]);
  const handleSorteren = (nieuw_zoekveld) => {
    if(zoekveld == nieuw_zoekveld){
      setOrder(order == 'asc'?'desc':'asc');
    }
    setZoekVeld(nieuw_zoekveld);
  
  };
  return (
    <div>
      <h2>Reservaties</h2>
      <AsyncData loading={isLoading} error={error}> 
        <div className={styles.table_container}>
          <table>
            <thead>
              <tr>
                {zichtbare_kolommen.map((col, index) => (
                  <th key={index} onClick={() => handleSorteren(zichtbare_kolommen[index])} 
                    className={zoekveld === col && order === 'desc'
                      ? styles.up
                      : zoekveld === col && order === 'asc'
                        ? styles.down
                        : styles.default_arrow}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredReservaties.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {werkelijke_kolommen.map((col, colIndex) => (
                    <td key={colIndex}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AsyncData>
    </div>
  );
};

export default ReservatiePaneel;