import AsyncData from '../AsyncData';
import useSWR from 'swr';
import * as API from './../../api/index';
import * as styles from './../../css/BoekTabel.module.css';
import { useMemo,useState } from 'react';
import { useNavigate } from 'react-router';

const ReservatiePaneel = () => {
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [categorieFilter, setCategorieFilter] = useState('id');
  const [searchcategorieFilter, setSearchCategorieFilter] = useState('id');
  const [menu_toggle,setMenu_toggle] = useState(false);
  const [huidigeMenu,setHuidigeMenu] = useState('');
  const navigate = useNavigate();

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
    return [...reservaties].filter((geb)=>{
      return  (search && searchcategorieFilter) ?
        geb[searchcategorieFilter].toLowerCase().includes(search.toLowerCase().trim()) : true;
    },
    ).map((res) => {
      const formattedDateStartdatum = new Intl.DateTimeFormat('nl-BE', datum_opties).format(new Date(res.startdatum));
      const formattedDateEinddatum = new Intl.DateTimeFormat('nl-BE', datum_opties).format(new Date(res.einddatum)); 
      // eslint-disable-next-line @stylistic/max-len
      return { ...res,boek_kopie_id:res.boek_kopie.id, gebruiker_id:res.gebruiker.id,startdatum_display: formattedDateStartdatum,einddatum_display:formattedDateEinddatum }; 
    });
  }, [reservaties, search, searchcategorieFilter]);
  const [zoekveld, setZoekVeld] = useState('id');
  const [order, setOrder] = useState('asc');
  filteredReservaties =useMemo(() => {
    let parsed_zoekveld;
    const string_zoekvelden = ['id','boek kopie id','gebruiker id','status'];
    return [...filteredReservaties].sort((a,b) => {
      if(string_zoekvelden.includes(zoekveld)){
        switch (zoekveld) {
          case 'boek kopie id':
            parsed_zoekveld = 'boek_kopie_id';
            break;
          case 'gebruiker id':
            parsed_zoekveld = 'gebruiker_id';
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

  function toggleMenu(id) {
    const menu = document.getElementById(id);
    if(huidigeMenu === id){
      setHuidigeMenu('');
      setMenu_toggle(false);
      menu.style.display = 'none';
    } else if(!menu_toggle) {
      setHuidigeMenu(id);
      setMenu_toggle(menu_toggle?false:true);
      menu.style.display = 'block';
    }
  }
  
  function editItem(id) {
    //TODO
    toggleMenu(); 
  }
  
  function deleteItem(id) {
    //TODO
    toggleMenu();
  }
  function bekijkItem(id) {
    navigate(`/dashboard/reservaties/${id}`);
  }
  return (
    <div>
      <h2>Reservaties</h2>
      <div className='d-flex justify-content-center'>
        <small style={{marginTop:10, marginRight:15}}>
          {filteredReservaties.length} zoekresultaten
        </small>
        <div className='input-group mb-3 w-50'>
          <input
            type='search'
            id='search'
            className='form-control'
            placeholder='doorzoeken...'
            onChange={(e) => setText(e.target.value)}
          />
          <select id="book-genre" name="genre" onChange={(e) => {
            setCategorieFilter(e.target.value);
          }}>
            <option value="id">id</option>
            <option  value="boek_kopie_id">boek kopie id</option>
            <option value="gebruiker_id">gebruiker</option>
            <option value="status">status</option>
          </select>
          <button type='button' className='btn btn-outline-primary' onClick={() => {
            setSearch(text);
            setSearchCategorieFilter(categorieFilter);
          }}>
            Filter toepassen
          </button>
          <span
            style={{ marginLeft: '10px', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            onClick={() => {         
              setSearch('');      
              setSearchCategorieFilter('');       
            }}
          >
            Alle filters verwijderen
          </span>
        </div>
      </div>
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
                    <td key={colIndex}>
                      {row[col]}
                      {colIndex === 0 && (
                        <div className={styles.menu_container}>
                          <button className={styles.menu_button} onClick={() => toggleMenu(row['id'])}>⋮</button>
                          <div className={`${styles.menu_options} menuOptions`} id={row['id']} >
                            <button onClick={() => editItem(row['id'])}>Edit</button>
                            <button onClick={() => deleteItem(row['id'])}>Delete</button>
                            <button onClick={()=> bekijkItem(row['id'])}>Bekijken</button>
                          </div>
                        </div>
                      )}
                    </td>
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