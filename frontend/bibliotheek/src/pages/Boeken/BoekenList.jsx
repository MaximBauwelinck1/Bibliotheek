import  {BOEKEN_DATA} from '../../api/mock_data';
import Boek from '../../components/boeken/boek';
import { useState } from 'react';
import styles from '../../css/Boek.module.css';

const BoekenList = () => {
  const[boeken,setBoeken] = useState(BOEKEN_DATA);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [categorie, setCategorie] = useState('');
  const [searchcategorie, setSearchCategorie] = useState('');
  const [taal, setTaal] = useState('');
  const [searchtaal, seSearchtTaal] = useState('');
  return (
    <>
      <div className='text-center'>Bibliotheek</div>
      <h1 className='text-center'>Temse</h1>
      <div className='d-flex justify-content-center'>
        <div className='input-group mb-3 w-50'>
          <input
            type='search'
            id='search'
            className='form-control'
            placeholder='Zoeken'
            onChange={(e) => setText(e.target.value)}
          />
          <select id="book-genre" name="genre" multiple size="3" onChange={(e) => {
            setCategorie(Array.from(e.target.selectedOptions, (option) => option.value));
          }}>
            <option value="Fictie">Fictie</option>
            <option value="Non-fictie">Non-fictie</option>
            <option value="Mysterie">Mysterie</option>
            <option value="Fantasie">Fantasie</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Biografie">Biografie</option>
            <option value="Romantiek">Romantiek</option>
            <option value="Geschiedenis">Geschiedenis</option>
            <option value="Dystopisch">Dystopisch</option>
            <option value="Southern Gothic">Southern Gothic</option>
            <option value="Post-apocalyptisch">Post-apocalyptisch</option>
            <option value="Tragedie">Tragedie</option>
            <option value="Anti-War">Anti-War</option>
            <option value="Aventuur">Aventuur</option>
          </select>
          <select id="taal" name="taal" multiple size="3" onChange={(e) => {
            setTaal(Array.from(e.target.selectedOptions, (option) => option.value));
          }}>
            <option value="Engels">Engels</option>
            <option value="Nederlands">Nederlands</option>
            <option value="Frans">Frans</option>
            <option value="Duits">Duits</option>
            <option value="Zweeds">Zweeds</option>
          </select>
          
          <button type='button' className='btn btn-outline-primary' onClick={() => {
            setSearch(text);
            setSearchCategorie(categorie);
            seSearchtTaal(taal);
          }}>
            Filter toepassen
          </button>
          <span
            style={{ marginLeft: '10px', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            onClick={() => {
              setText('');        
              setCategorie([]);   
              setTaal([]);        
              setSearch('');      
              setSearchCategorie([]);  
              seSearchtTaal([]);       
            }}
          >
            Alle filters verwijderen
          </span>
        </div>
      </div>
      
      <div className={styles.boek_grid}>
        {boeken
          .sort((a, b) =>
            a.titel.toUpperCase().localeCompare(b.titel.toUpperCase()),
          ).filter((a) =>{
            const matchedTitel = search ? a.titel.toLowerCase().includes(search.toLowerCase()) : true;
            const MatchedGenre = searchcategorie.length > 0 ? searchcategorie.includes(a.genre) : true;
            const MatchedTaal =  searchtaal.length > 0 ? searchtaal.includes(a.taal) : true;
            return matchedTitel && MatchedGenre && MatchedTaal;
          })
          .map((p) => (       
            <Boek key={p.id}  {...p} />
          ))}
      </div>
    </>
    
  );
};

export default BoekenList;
