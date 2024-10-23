import  {boeken} from '../../api/mock_data';
import Boek from '../../components/boeken/boek';

const BoekenList = () => {
  return (
    <>
      <h1>Boeken </h1>
      <div className='grid'>
        {boeken
          .sort((a, b) =>
            a.titel.toUpperCase().localeCompare(b.titel.toUpperCase()),
          )
          .map((p) => (       
            <Boek key={p.id}  {...p} />
          ))}
      </div>
    </>
    
  );
};

export default BoekenList;
