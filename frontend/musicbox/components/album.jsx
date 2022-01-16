import styles from '../styles/Card.module.css';

const Album = ({album}) => {
  return(
    <div className={styles.card}>
      {<img src={album.image}></img>}
      <h2 className="album_artist">{album.artist}</h2>
      <h3 className="album_name">{album.name}</h3>
    </div>
  );
};

export default Album;