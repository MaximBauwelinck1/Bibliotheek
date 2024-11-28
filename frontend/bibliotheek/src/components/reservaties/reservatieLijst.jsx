import AsyncData from '../AsyncData';
import * as styles from './../../css/BoekTabel.module.css';
import { useMemo,useState } from 'react';
import ToonBevestiging from '../ToonBevestiging';

const ReservatieLijst = ({reservaties, actieve, isLoading, error, leverBoekInTrigger}) => {
  const [toonBevestiging,setToonbevestiging] = useState(false);
  const [reservatieId,setReservatieId] = useState('');
  const werkelijke_kolommen = ['nr','boek_titel','startdatum_display','einddatum_display'];
  const zichtbare_kolommen = ['nr','boek','startdatum reservatie','einddatum reservatie'];
  // om datums leesbaar te maken

  let filteredReservaties = useMemo(() => {
    const datum_opties = { year: 'numeric', month: 'long', day: 'numeric' };
    return [...reservaties].filter((res)=>{
      return actieve? res.status === 'actief': res.status === 'niet-actief';
    }).map((res,index) => {
      const formattedDateStartdatum = new Intl.DateTimeFormat('nl-BE', datum_opties).format(new Date(res.startdatum));
      const formattedDateEinddatum = new Intl.DateTimeFormat('nl-BE', datum_opties).format(new Date(res.einddatum)); 
      // eslint-disable-next-line @stylistic/max-len
      return { ...res,nr:index+1, boek_titel: res.boek_kopie.boek.titel, startdatum_display: formattedDateStartdatum,einddatum_display:formattedDateEinddatum }; 
    });
  }, [actieve, reservaties]);

  const [zoekveld, setZoekVeld] = useState('id');
  const [order, setOrder] = useState('asc');
  filteredReservaties =useMemo(() => {
    let parsed_zoekveld;
    const string_zoekvelden = ['nr','boek'];
    return [...filteredReservaties].sort((a,b) => {
      if(string_zoekvelden.includes(zoekveld)){
        switch (zoekveld) {
          case 'boek':
            parsed_zoekveld = 'boek_titel';
            break;
          default:
            parsed_zoekveld = zoekveld;
            break;
        }
        if (a[parsed_zoekveld] > b[parsed_zoekveld]) return order === 'asc' ? 1 : -1; 
        if (a[parsed_zoekveld] < b[parsed_zoekveld]) return order === 'asc' ? -1 : 1;
        return 0;
      }else{
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
  const handleBoekInleveren = ()=>{
    leverBoekInTrigger({
      id:reservatieId,
      values:{
        status:'niet-actief',
      },
    });
  };

  return (
    <>
      <AsyncData loading={isLoading} error={error}> 
        <div className={styles.kleine_container}>
          <h2>{actieve?'actieve reservaties':'afgelopen reservaties'}</h2>
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
                    <td key={colIndex}>
                      {row[col]}
                      {actieve && colIndex===1 && 
                      <button className='rode_knop' onClick={()=>{
                        setReservatieId(row['id']);
                        setToonbevestiging(true);
                      }}>
                        Boek inleveren
                      </button>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AsyncData>
      <ToonBevestiging isOpen={toonBevestiging} onConfirm={()=>{
        handleBoekInleveren();
        setToonbevestiging(false);
      }
      }
      onClose={()=>setToonbevestiging(false)}
      title='Bevestiging indienen'
      message={'Wilt u zeker dit boek indienen?'}/>
    </>
  );
};

export default ReservatieLijst;