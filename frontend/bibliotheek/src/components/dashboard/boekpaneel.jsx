import AsyncData from '../AsyncData';
import useSWR from 'swr';
import * as API from './../../api/index';
import * as styles from './../../css/BoekTabel.module.css';
import { useMemo,useState } from 'react';
const BoekPaneel = () => {
  const test =[{test:'z'},{test:'g'},{test:'a'},{test:'c'}];
  const naam = 'test';
  const werkelijke_kolommen = ['id','ISBN','titel','genre','publicatie_datum','taal','paginas',
    'vrije_kopieen','totale_kopieen','cover_uri','aangemaakt','upgedate'];
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
    return boeken.map((boek) => {
      // eslint-disable-next-line @stylistic/max-len
      const formattedDatePublicatie = new Intl.DateTimeFormat('nl-BE', datum_opties).format(new Date(boek.publicatie_datum));
      const formattedDateAangemaakt = new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(boek.aangemaakt));
      const formattedDateUpgedate = new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(boek.upgedate));
      // eslint-disable-next-line @stylistic/max-len
      return { ...boek, publicatie_datum: formattedDatePublicatie,aangemaakt: formattedDateAangemaakt,upgedate:formattedDateUpgedate }; 
    });
  }, [boeken]);
  const [zoekveld, setZoekVeld] = useState('');
  const [order, setOrder] = useState('asc');
  filteredBoeken =useMemo(() => {
    console.log(test);
    test.sort((a, b) => {
      if (a[naam] > b[naam]) return 1;
      if (a[naam] < b[naam]) return -1;
      return 0;
    });
    return filteredBoeken.sort((a,b) => {
      if (a[zoekveld] > b[zoekveld]) return 1;
      if (a[zoekveld] < b[zoekveld]) return -1;
      return 0;
    });
  }, [filteredBoeken, zoekveld]);

  const handleSorteren = (zoekveld) => {
    setZoekVeld(zoekveld);
  
  };
  console.log(test);
  return (
    <div>
      <h2>Boeken</h2>
      <AsyncData loading={isLoading} error={error}> 
        <div className={styles.table_container}>
          <table>
            <thead>
              <tr>
                {zichtbare_kolommen.map((col, index) => (
                  <th key={index} onClick={() => handleSorteren(col)}>{col}</th>
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