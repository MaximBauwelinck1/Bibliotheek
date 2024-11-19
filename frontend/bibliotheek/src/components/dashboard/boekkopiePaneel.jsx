import AsyncData from '../AsyncData';
import useSWR from 'swr';
import * as API from '../../api/index';
import * as styles from './../../css/BoekTabel.module.css';
import { useMemo,useState } from 'react';
import { useNavigate } from 'react-router';
import ToonBevestiging from '../ToonBevestiging';
import useSWRMutation from 'swr/mutation';
import AdminNavbarStyles from '../../css/AdminNavbar.module.css';

const BoekKopiePaneel = () => {
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [categorieFilter, setCategorieFilter] = useState('id');
  const [searchcategorieFilter, setSearchCategorieFilter] = useState('id');
  const [menu_toggle,setMenu_toggle] = useState(false);
  const [huidigeMenu,setHuidigeMenu] = useState('');
  const [toonBevesteging, setToonBevesteging] = useState(false);
  const [boekKopieIdTodelete,setBoekKopieIdTodelete] = useState('');
  const navigate = useNavigate();

  const werkelijke_kolommen = ['id','boek_id','status','extra_informatie','aangemaakt_display',
    'upgedate_display','formattedActief'];
  const zichtbare_kolommen = ['id','boek id','status','extra informatie',
    'aangemaakt','laatst aangepast','Archivering'];
  const {
    data: boekkopieen = [],
    isLoading,
    error,
  } = useSWR('kopieen', API.getAll);
  // om datums leesbaar te maken
  let filteredBoekKopieen = useMemo(() => {
    const datum_opties2 = { year: 'numeric', month: 'long', day: 'numeric',hour: 'numeric',minute:'numeric' };
    return [...boekkopieen].map((bk) => {
      const formattedActief = bk.actief?'Actief':'Gearchiveerd';
      const formattedDateAangemaakt = new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(bk.aangemaakt));
      const formattedDateUpgedate = new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(bk.upgedate));
      // eslint-disable-next-line @stylistic/max-len
      return { ...bk,boek_id:bk.boek.id, aangemaakt_display: formattedDateAangemaakt,upgedate_display:formattedDateUpgedate,formattedActief }; 
    }).filter((bk)=>{
      console.log(bk[searchcategorieFilter]);
      return  (search && searchcategorieFilter) ?
        bk[searchcategorieFilter].toLowerCase().includes(search.toLowerCase().trim()) : true;
    });
  }, [boekkopieen, search, searchcategorieFilter]);
  const [zoekveld, setZoekVeld] = useState('id');
  const [order, setOrder] = useState('asc');
  filteredBoekKopieen =useMemo(() => {
    let parsed_zoekveld;
    const string_zoekvelden = ['id','boek id','status','extra informatie','Archivering'];
    return [...filteredBoekKopieen].sort((a,b) => {
      if(string_zoekvelden.includes(zoekveld)){
        switch (zoekveld) {
          case 'boek id':
            parsed_zoekveld = 'boek_id';
            break;
          case 'extra informatie':
            parsed_zoekveld = 'extra_informatie';
            break;
          case 'Archivering':
            parsed_zoekveld = 'formattedActief';
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
        console.log('g'+parsed_zoekveld);
        const dateA = new Date(a[parsed_zoekveld]);
        const dateB = new Date(b[parsed_zoekveld]);
        if (dateA > dateB) return order === 'asc' ? 1 : -1;
        if (dateA < dateB) return order === 'asc' ? -1 : 1;
        return 0;
      }
    
    });
  }, [filteredBoekKopieen, zoekveld,order]);
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
    navigate(`/dashboard/boekkopieen/edit/${id}`);
    toggleMenu(); 
  }
  
  function deleteItem(id) {
    setBoekKopieIdTodelete(id);
    toggleMenu(id);
    setToonBevesteging(true);
  }
  function bekijkItem(boekId,BoekKopieId) {
    navigate(`/dashboard/boekkopieen/${boekId}/${BoekKopieId}`);
  }
  const { trigger: deletekopie, error: deleteError } = useSWRMutation(
    'kopieen',
    API.deleteById,
    {onSuccess:()=>navigate('/dashboard/boekkopieen')},
  );
  
  return (
    <div>
      <h2>Boek Kopieën</h2>
      <button className={AdminNavbarStyles.blue_button} onClick={() => navigate('/dashboard/boekkopieen/add')}>
        Kopie toevoegen
      </button>
      <div className='d-flex justify-content-center'>
        <small style={{marginTop:10, marginRight:15}}>
          {filteredBoekKopieen.length>1?`${filteredBoekKopieen.length} zoekresultaten`:
            filteredBoekKopieen.length==1?`${filteredBoekKopieen.length} zoekresultaat`:'geen zoekresultaten'} 
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
            <option  value="id">id</option>
            <option value="boek_id">boek id</option>
            <option value="status">status</option>
            <option value="extra_informatie">extra informatie</option>
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
      <AsyncData loading={isLoading} error={error || deleteError}> 
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
              {filteredBoekKopieen.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {werkelijke_kolommen.map((col, colIndex) => (
                    <td key={colIndex}>
                      <>
                        {row[col]}
                        {colIndex === 0 && (
                          <div className={styles.menu_container}>
                            <button className={styles.menu_button} onClick={() => toggleMenu(row['id'])}>⋮</button>
                            <div className={`${styles.menu_options} menuOptions`} id={row['id']} >
                              <button onClick={() => editItem(row['id'])}>Edit</button>
                              <button onClick={() => deleteItem(row['id'])}>Delete</button>
                              <button onClick={()=>  bekijkItem(row['boek_id'],row['id'])}>Bekijken</button>
                            </div>
                          </div>
                        )}
                      </>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ToonBevestiging
          isOpen={toonBevesteging}
          onClose={() => setToonBevesteging(false)}
          onConfirm={() =>{
            deletekopie(boekKopieIdTodelete);
            setToonBevesteging(false);
          }}
          title="Bevestig verwijdering"
          message="Wil je zeker dit boek verwijderen?"
        />
      </AsyncData>
    </div>
  );
};

export default BoekKopiePaneel;