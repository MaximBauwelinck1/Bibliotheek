import AsyncData from '../AsyncData';
import useSWR from 'swr';
import * as API from './../../api/index';
import * as styles from './../../css/BoekTabel.module.css';
import { useMemo,useState } from 'react';
const BoekPaneel = () => {
  const werkelijke_kolommen = ['id','ISBN','titel','genre','publicatie_datum_display','taal','paginas',
    'vrije_kopieen','totale_kopieen','cover_uri','aangemaakt_display','upgedate_display'];
  const zichtbare_kolommen = ['id','ISBN','titel','genre','gepubliceerd','taal','paginas',
    'aantal beschikbaar','totaal','cover','aangemaakt','laatst aangepast'];
  const {
    data: boeken = [],
    isLoading,
    error,
  } = useSWR('boeken', API.getAll);
  // om datums leesbaar te maken
  let filteredBoeken = useMemo(() => {
    const datum_opties = { year: 'numeric', month: 'long', day: 'numeric' };
    const datum_opties2 = { year: 'numeric', month: 'long', day: 'numeric',hour: 'numeric',minute:'numeric' };
    return [...boeken].map((boek) => {
      // eslint-disable-next-line @stylistic/max-len
      const formattedDatePublicatie = new Intl.DateTimeFormat('nl-BE', datum_opties).format(new Date(boek.publicatie_datum));
      const formattedDateAangemaakt = new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(boek.aangemaakt));
      const formattedDateUpgedate = new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(boek.upgedate));
      // eslint-disable-next-line @stylistic/max-len
      return { ...boek, publicatie_datum_display: formattedDatePublicatie,aangemaakt_display: formattedDateAangemaakt,upgedate_display:formattedDateUpgedate }; 
    });
  }, [boeken]);
  const [zoekveld, setZoekVeld] = useState('titel');
  const [order, setOrder] = useState('asc');
  filteredBoeken =useMemo(() => {
    const string_zoekvelden = ['id','ISBN','titel','genre','taal','cover'];
    return [...filteredBoeken].sort((a,b) => {
      if(string_zoekvelden.includes(zoekveld)){
        if (a[zoekveld] > b[zoekveld]) return order === 'asc' ? 1 : -1; 
        if (a[zoekveld] < b[zoekveld]) return order === 'asc' ? -1 : 1;
        return 0;
      }else{
        let parsed_zoekveld;
        switch (zoekveld) { // dit is echt een mess maar ik weet anders niet hoe
          case 'gepubliceerd':
            parsed_zoekveld = 'publicatie_datum';
            break;
          case 'laatst aangepast':
            parsed_zoekveld = 'upgedate';
            break;
          case 'aangemaakt':
            parsed_zoekveld = 'aangemaakt';
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
  }, [filteredBoeken, zoekveld,order]);
  const handleSorteren = (nieuw_zoekveld) => {
    if(zoekveld == nieuw_zoekveld){
      setOrder(order == 'asc'?'desc':'asc');
    }
    setZoekVeld(nieuw_zoekveld);
  
  };
  return (
    <div>
      <h2>Boeken</h2>
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
              {filteredBoeken.map((row, rowIndex) => (
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
  
export default BoekPaneel;