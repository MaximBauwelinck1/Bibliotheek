import AsyncData from '../AsyncData';
import useSWR from 'swr';
import * as API from './../../api/index';
import * as styles from './../../css/BoekTabel.module.css';
import { useMemo,useState } from 'react';
import { useNavigate } from 'react-router';
import useSWRMutation from 'swr/mutation';
import ToonBevestiging from '../ToonBevestiging';
import AdminNavbarStyles from '../../css/AdminNavbar.module.css';
const GebruikerPaneel = () => {
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [categorieFilter, setCategorieFilter] = useState('voornaam');
  const [searchcategorieFilter, setSearchCategorieFilter] = useState('voornaam');
  const [menu_toggle,setMenu_toggle] = useState(false);
  const [huidigeMenu,setHuidigeMenu] = useState('');
  const [toonBevesteging, setToonBevesteging] = useState(false);
  const [gebruikerIdTodeleter,setGebruikerIdTodelete] = useState('');
  const navigate = useNavigate();

  const werkelijke_kolommen = ['id','voornaam','achternaam','geboortedatum_display','email','rol',
    'aangemaakt_display','upgedate_display'];
  const zichtbare_kolommen = ['id','voornaam','achternaam','geboortedatum','email','rol',
    'aangemaakt','laatst aangepast'];
  const {
    data: gebruikers = [],
    isLoading,
    error,
  } = useSWR('gebruikers', API.getAll);
  // om datums leesbaar te maken
  let filteredgebruikers = useMemo(() => {
    const datum_opties = { year: 'numeric', month: 'long', day: 'numeric' };
    const datum_opties2 = { year: 'numeric', month: 'long', day: 'numeric',hour: 'numeric',minute:'numeric' };
    return [...gebruikers].filter((geb)=>{
      return  (search && searchcategorieFilter) ?
        geb[searchcategorieFilter].toLowerCase().includes(search.toLowerCase().trim()) : true;
    },
    ).map((geb) => {
      // eslint-disable-next-line @stylistic/max-len
      const formattedDateGeboortedatum = new Intl.DateTimeFormat('nl-BE', datum_opties).format(new Date(geb.geboortedatum));
      const formattedDateAangemaakt = new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(geb.aangemaakt));
      const formattedDateUpgedate = new Intl.DateTimeFormat('nl-BE', datum_opties2).format(new Date(geb.upgedate));
      // eslint-disable-next-line @stylistic/max-len
      return { ...geb, geboortedatum_display: formattedDateGeboortedatum,aangemaakt_display: formattedDateAangemaakt,upgedate_display:formattedDateUpgedate }; 
    });
  }, [gebruikers, search, searchcategorieFilter]);
  const [zoekveld, setZoekVeld] = useState('voornaam');
  const [order, setOrder] = useState('asc');
  filteredgebruikers =useMemo(() => {
    const string_zoekvelden = ['id','voornaam','achternaam','email','rol'];
    return [...filteredgebruikers].sort((a,b) => {
      if(string_zoekvelden.includes(zoekveld)){
        if (a[zoekveld] > b[zoekveld]) return order === 'asc' ? 1 : -1; 
        if (a[zoekveld] < b[zoekveld]) return order === 'asc' ? -1 : 1;
        return 0;
      }else{
        let parsed_zoekveld;
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
        const dateA = new Date(a[parsed_zoekveld]);
        const dateB = new Date(b[parsed_zoekveld]);
        if (dateA > dateB) return order === 'asc' ? 1 : -1;
        if (dateA < dateB) return order === 'asc' ? -1 : 1;
        return 0;
      }
    
    });
  }, [filteredgebruikers, zoekveld,order]);
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
    navigate(`/dashboard/gebruikers/edit/${id}`);
    toggleMenu(); 
  }
  
  function deleteItem(id) {
    setGebruikerIdTodelete(id);
    toggleMenu(id);
    setToonBevesteging(true);
  }
  function bekijkItem(id) {
    navigate(`/dashboard/gebruikers/${id}`);
  }
  const { trigger: deleteGebruiker, error: deleteError } = useSWRMutation(
    'gebruikers',
    API.deleteById,
  );
  
  return (
    <div>
      <h2>Gebruikers</h2>
      <button className={AdminNavbarStyles.blue_button} onClick={() => navigate('/dashboard/gebruikers/add')}>
        Gebruiker aanmaken
      </button>
      <div className='d-flex justify-content-center'>
        <small style={{marginTop:10, marginRight:15}}>
          {filteredgebruikers.length>1?`${filteredgebruikers.length} zoekresultaten`:
            filteredgebruikers.length==1?`${filteredgebruikers.length} zoekresultaat`:'geen zoekresultaten'} 
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
            <option  value="voornaam">Voornaam</option>
            <option value="achternaam">Achternaam</option>
            <option value="id">id</option>
            <option value="email">email</option>
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
              {filteredgebruikers.map((row, rowIndex) => (
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
                              <button onClick={()=>  bekijkItem(row['id'])}>Bekijken</button>
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
      </AsyncData>
      <ToonBevestiging
        isOpen={toonBevesteging}
        onClose={() => setToonBevesteging(false)}
        onConfirm={() =>{
          deleteGebruiker(gebruikerIdTodeleter);
          setToonBevesteging(false);
        }}
        title="Bevestig verwijdering"
        message="Wil je zeker deze gebruiker verwijderen?"
      />
    </div>
  );
};

export default GebruikerPaneel;