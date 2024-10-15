import BOEKEN_DATA from '../../api/mock_data';
import Boek from '../../components/boeken/boek';

const BoekenList = () => {
  const boeken = BOEKEN_DATA;
  return (
    <div className='grid mt-3'>
      <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-3'>
        {boeken
          .sort((a, b) =>
            a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
          )
          .map((p) => (
            <div className='col' key={p.id}>
              <Boek key={p.id}  {...p} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default BoekenList;
