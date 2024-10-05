export default function Boek(prop){
  return(
    <div className="text-bg-dark" style={{textAlign:'center'}}> 
      {prop.naam} van autheur {prop.autheur} met genre {prop.genre} en beschrijving {prop.description}  
    </div>
  );
}