import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import ToonBevestiging from '../ToonBevestiging';
import * as styles from './../../css/BoekTabel.module.css';
// wordt niet gebruikt. Werkt niet voor elke entiteit
const Tabel = ({
  typeEntiteit,
  apiURL,
  data,
  onDelete,
  echte_kolommen,
  label_kolommen,
  zoekvelden = [],
  defaultZoekVeld = 'id',
  defaultSorting = 'asc',
}) => {
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [zoekveld, setZoekveld] = useState(zoekvelden[0] || '');
  const [searchZoekveld, setSearchZoekveld] = useState(zoekvelden[0] || '');
  const [menuToggle, setMenuToggle] = useState(false);
  const [huidigMenu, setHuidigMenu] = useState('');
  const [toonBevestiging, setToonBevestiging] = useState(false);
  const [itemToDelete, setItemToDelete] = useState('');
  const [sortingveld, setSortingveld] = useState(defaultZoekVeld);
  const [sortingOrder, setSortingOrder] = useState(defaultSorting);
  const navigate = useNavigate();

  const geformateerdeItems = useMemo(() => {
    return data.map((item) => {
      const formattedItem = { ...item };
      echte_kolommen.forEach((col) => {
        if (col == 'aangemaakt' || col == 'upgedate') {
          formattedItem[col] = new Intl.DateTimeFormat('nl-BE', {
            year: 'numeric', month: 'long', day: 'numeric',hour:'numeric',minute:'numeric',
          }).format(new Date(item[col]));
        } else if(col.includes('datum')){
          formattedItem[col] = new Intl.DateTimeFormat('nl-BE', {
            year: 'numeric', month: 'long', day: 'numeric',
          }).format(new Date(item[col]));
        }
      });
      return formattedItem;
    });
  }, [data, echte_kolommen]);

  const gefilterdeItems = useMemo(() => {
    return geformateerdeItems.filter((item) => 
      search ? item[searchZoekveld].toString().toLowerCase().includes(search.toLowerCase()) : true,
    ).sort((a, b) => {
      if (typeof a[sortingveld] === 'string') {
        return a[sortingveld].localeCompare(b[sortingveld]) * (sortingOrder === 'asc' ? 1 : -1);
      } else if (typeof a[sortingveld] === 'number' || a[sortingveld] instanceof Date) {
        return (a[sortingveld] - b[sortingveld]) * (sortingOrder === 'asc' ? 1 : -1);
      }
      return 0;
    });
  }, [geformateerdeItems, search, searchZoekveld, sortingveld, sortingOrder]);

  const handleSort = (field) => {
    if (sortingveld === field) {
      setSortingOrder(sortingOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortingveld(field);
      setSortingOrder(defaultSorting);
    }
  };

  const toggleMenu = (id) => {
    const menu = document.getElementById(id);
    if (huidigMenu === id) {
      setHuidigMenu('');
      setMenuToggle(false);
      menu.style.display = 'none';
    } else if(!menuToggle){
      setHuidigMenu(id);
      setMenuToggle(true);
      menu.style.display = 'block';
    }
  };

  const handleDeleteItem = (id) => {
    setItemToDelete(id);
    toggleMenu(id);
    setToonBevestiging(true);
  };

  return (
    <div>
      <h2>{typeEntiteit}</h2>
      <div className="d-flex justify-content-center">
        <small style={{ marginTop: 10, marginRight: 15 }}>
          {gefilterdeItems.length > 1 ? `${gefilterdeItems.length} Zoekresultaten` :
            gefilterdeItems.length === 1 ? '1 Zoekresultaat' : 'geen Zoekresultaten'}
        </small>
        <div className="input-group mb-3 w-50">
          <input
            type="search"
            className="form-control"
            placeholder="doorzoeken..."
            onChange={(e) => setText(e.target.value)}
          />
          <select onChange={(e) => setZoekveld(e.target.value)}>
            {zoekvelden.map((field) => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
          <button type="button" className="btn btn-outline-primary" onClick={() => {
            setSearch(text);
            setSearchZoekveld(zoekveld);
          }}>
            Filter toepassen
          </button>
          <span
            style={{ marginLeft: '10px', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            onClick={() => {
              setSearch('');
              setSearchZoekveld('');
            }}
          >
            Alle filters verwijderen
          </span>
        </div>
      </div>
      <div className={styles.table_container}>
        <table>
          <thead>
            <tr>
              {label_kolommen.map((label, index) => (
                <th key={index} onClick={() => handleSort(echte_kolommen[index])}
                  className={
                    sortingveld === echte_kolommen[index] && sortingOrder === 'desc' ? styles.up :
                      sortingveld === echte_kolommen[index] && sortingOrder === 'asc' ? styles.down :
                        styles.default_arrow
                  }>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gefilterdeItems.map((y, yIndex) => (
              <tr key={yIndex}>
                {echte_kolommen.map((x, xIndex) => (
                  <td key={xIndex}>
                    {y[x]}
                    {xIndex === 0 && (
                      <div className={styles.menu_container}>
                        <button className={styles.menu_button} onClick={() => toggleMenu(y.id)}>⋮</button>
                        <div className={`${styles.menu_options} menuOptions`} id={y.id}>
                          <button onClick={() => navigate(`/dashboard/${apiURL}/${y.id}`)}>Bekijken</button>
                          <button onClick={() => handleDeleteItem(y.id)}>Verwijderen</button>
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
      <ToonBevestiging
        isOpen={toonBevestiging}
        onClose={() => setToonBevestiging(false)}
        onConfirm={() => {
          onDelete(itemToDelete);
          setToonBevestiging(false);
        }}
        title="Bevestig verwijdering"
        message="Wil je zeker dit verwijderen?"
      />
    </div>
  );
};

export default Tabel;
