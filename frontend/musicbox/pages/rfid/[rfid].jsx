import { useState , useEffect, useRef , useContext } from "react";
import Album from '../../components/album'
import styles from '../../styles/CardDetail.module.css';
import LoginContext from "../../context/logincontext";

const CardDetail = ({card, initialToken}) => {
  const [searchName, setSearchName]         = useState("");
  const [searchNum, setSearchNum]           = useState(0);
  const [albums, setAlbums]                 = useState([]);
  const [newCard, setNewCard]               = useState(card);
  const isRender                            = useRef(true);
  const {token, setToken}                   = useContext(LoginContext);
  useEffect(() => {
    setToken(initialToken);
  }, []);
  useEffect(() => {
    const getData = async () => {
      getAlbumFromURI(newCard.uri);
      if (isRender.current === false) {
        const response = await fetch(`http://localhost:4000/card/${newCard.rfid}`, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(newCard) // body data type must match "Content-Type" header
        });
        setAlbums([]);
      }
    };
    getData();
  }, [newCard]);
  useEffect(()=>{
    if (isRender.current === false) {
      albumSearch();
    }
  }, [searchNum]);
  useEffect(() => {
    if (isRender.current === true) {
      isRender.current = false;
      return;
    }
  })
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearchNum(10);
    }
  }
  const albumSearch = async () => {
    console.log(searchNum);
    const response = await fetch(`https://api.spotify.com/v1/search?type=album&q=${searchName}&limit=${searchNum}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const results  = await response.json();
    if (response.status == 401) {
      setToken('');
      return;
    }
    const albums = results.albums.items.map((item) => {
      return(
        {
          name: item.name,
          artist: item.artists[0].name,
          image: item.images[2].url.replace(/https:\/\/i.scdn.co\/image\//, ''),
          uri: item.uri,
          id: item.id
        }
      );
    });
    setAlbums(albums);
  }
  const getAlbumFromURI = async (uri) => {
    const albumID = uri.replace(/spotify:album:/, '');
    const response = await fetch(`https://api.spotify.com/v1/albums/${albumID}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const album = await response.json();
    console.log(album);
    return album;
  }
  return(
    <div className="card_detail">
      <h2>{newCard.rfid}</h2>
      <h2>{newCard.name}</h2>
      <h2>{newCard.uri}</h2>
      <input value={searchName} onChange={(e) => setSearchName(e.target.value)} onKeyPress={(e) => handleKeyPress(e)}/>
      <button onClick={() => setSearchNum(10)}>Search</button>
      <ul>
        {albums.map((album) => <Album album={album} setNewCard={setNewCard} key={album.id}/>)}
      </ul>
      {
        (albums.length === 0) || (albums.length === 50) || <button className={styles.more} onClick={() => setSearchNum((prevSearchNum) => {
          if (prevSearchNum < 40) {
            return prevSearchNum+10
          }
          // API limit reached
          return 50;
        })}>More</button>         
      }
    </div>
  );
};

export default CardDetail;

export async function getServerSideProps(context) {
  let resp = await fetch("http://localhost:4000/spotify/token");
  const {access_token} = await resp.json();
  resp = await fetch(`http://localhost:4000/card/${context.params.rfid}`);
  const card = await resp.json();
  return {
    props:{card, initialToken:access_token}
  }
}