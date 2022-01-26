import styles from '../styles/Card.module.css';
import Image from 'next/image';

const Album = ({album, setNewCard}) => {
  const handleClick = () => {
    setNewCard((currentCard) => {
      const newCard = {...currentCard, name: album.name, uri: album.uri};
      return(newCard);
    })
  }
  const myLoader = ({src, width, quality}) => {
    return `https://i.scdn.co/image/${src}`;
  }
  return(
    <div className={styles.card} onClick={handleClick}>
      <Image loader={myLoader} src={album.image} alt={album.name} width="100%" height="100%" />
      <h2 className="album_artist">{album.artist}</h2>
      <h3 className="album_name">{album.name}</h3>
    </div>
  );
};

export default Album;