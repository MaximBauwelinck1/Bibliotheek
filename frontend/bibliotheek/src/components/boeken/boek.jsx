const Book = (props) => {
  return (
    <div className="boek_card">
      <div className="cover_container">
        {props.cover_uri ? (
          <img src={props.cover_uri} alt={`${props.titel} cover`} className="cover_img" />
        ) : (
          <div className="placeholder_cover">Cover Image</div>
        )}
      </div>
      <div className="boek_info">
        <h4 className="boek_titel">{props.titel}</h4>
        <p className="boek_auteur">{props.voornaam} {props.achternaam}</p>
      </div>
    </div>
  );
};

export default Book;