import { Link } from 'react-router-dom';
function App() {
  return (
    <div>
      <h1>Welkom!</h1>
      <p>Kies één van de volgende links:</p>
      <ul>
        <li>
          <Link to='/boeken'>boeken</Link> 
        </li>
        
        <li>
          <Link to='/about'>Over ons</Link> 
        </li>
      </ul>
    </div>
  );
}

export default App;
