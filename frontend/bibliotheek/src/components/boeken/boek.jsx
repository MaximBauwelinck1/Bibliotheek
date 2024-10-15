const Boek = (prop) => {
  return (
    <div className='bg-light border-dark mb-4'>
      <div className="text-bg-dark" style={{textAlign:'center'}}> 
        {prop.naam} van autheur {prop.autheur} met genre {prop.genre} en beschrijving {prop.description}  
      </div>
    </div>
  );
};

export default Boek;
