import '../../css/Boek.css';

const Boek = (prop) => {
  return (
    <div className="boek_container">
      <h1 className="boek_titel">{prop.titel}</h1>

      <div className="cover_container">
        <div className="cover">
          {prop.cover_uri ? <img src={prop.cover_uri} alt="Cover" className="cover_img" /> : 'Cover Image'}
        </div>

        <div className="auteur_info">
          <div className="auteur_foto">
            {prop.authorPhoto ? <img src={prop.authorPhoto} alt="Author" className="author_img" /> : 'Author Photo'}
          </div>
          <div className="auteur_description">
            <h3>{prop.voornaam + prop.achternaam}</h3>
            <p>{prop.biografie}</p>
          </div>
        </div>
      </div>

      <div className="description_container">
        <h2>beschrijving</h2>
        <p>{prop.beschrijving}</p>
      </div>
    </div>
  );
};

export default Boek;
