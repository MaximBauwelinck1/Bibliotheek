import Boek from './components/boeken/boek';
import BOEKEN_DATA from './api/mock_data';

function App() {
  return (
    <div className='App'>
      {BOEKEN_DATA.map((boek) => <Boek key={boek.id} {...boek}></Boek> )}
    </div>
  );
}

export default App;
