import styles from '../styles/Card.module.css';

const Album = ({album, setNewCard}) => {
  const handleClick = () => {
    setNewCard((currentCard) => {
      const newCard = {...currentCard, name: album.name, uri: album.uri};
      return(newCard);
    })
  }
  return(
    <div className={styles.card} onClick={handleClick}>
      <img src={album.image}></img>
      <h2 className="album_artist">{album.artist}</h2>
      <h3 className="album_name">{album.name}</h3>
    </div>
  );
};

export default Album;