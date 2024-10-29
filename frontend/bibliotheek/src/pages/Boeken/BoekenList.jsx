import  {BOEKEN_DATA} from '../../api/mock_data';
import Boek from '../../components/boeken/boek';
import { useState } from 'react';
import '../../css/Boek.css';

const BoekenList = () => {
  const[boeken,setBoeken] = useState(BOEKEN_DATA);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
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
          <select id="book-genre" name="genre" multiple size="3">
            <option value="Fictie">Fictie</option>
            <option value="Non-fictie">Non-fictie</option>
            <option value="Mysterie">Mysterie</option>
            <option value="Fantasie">Fantasie</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Biografie">Biografie</option>
            <option value="Romantiek">Romantiek</option>
            <option value="Geschiedenis">Geschiedenis</option>
          </select>
          <select id="taal" name="taal" multiple size="3">
            <option value="Engels">Engels</option>
            <option value="Nederlands">Nederlands</option>
            <option value="Frans">Frans</option>
            <option value="Duits">Duits</option>
            <option value="Zweeds">Zweeds</option>
          </select>
          
          <button type='button' className='btn btn-outline-primary' onClick={() => setSearch(text)}>
            Filter toepassen
          </button>
        </div>
      </div>
      
      <div className="boek_grid">
        {boeken
          .sort((a, b) =>
            a.titel.toUpperCase().localeCompare(b.titel.toUpperCase()),
          ).filter((a) => a.titel.toLowerCase().includes(search.toLowerCase()))
          .map((p) => (       
            <Boek key={p.id}  {...p} />
          ))}
      </div>
    </>
    
  );
};

export default BoekenList;
