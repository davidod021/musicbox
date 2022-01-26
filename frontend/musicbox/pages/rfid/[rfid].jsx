import { useState , useEffect, useRef } from "react";
import Album from '../../components/album'

const CardDetail = ({card, accessToken}) => {
  const [searchName, setSearchName]         = useState("");
  const [albums, setAlbums]                 = useState([]);
  const [newCard, setNewCard]               = useState(card);
  const [newAccessToken, setNewAccessToken] = useState(accessToken);
  const isRender                            = useRef(true);
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
  useEffect(() => {
    if (isRender.current === true) {
      isRender.current = false;
      return;
    }
  })
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  }
  const handleSearch = async (e) => {
    const response = await fetch(`https://api.spotify.com/v1/search?type=album&q=${searchName}&limit=10`, {
      headers: {
        Authorization: `Bearer ${newAccessToken}`
      }
    });
    const results  = await response.json();
    if (response.status == 401) {
      setNewAccessToken('');
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
    setSearchName("");
  }
  const getAlbumFromURI = async (uri) => {
    const albumID = uri.replace(/spotify:album:/, '');
    const response = await fetch(`https://api.spotify.com/v1/albums/${albumID}`, {
      headers: {
        Authorization: `Bearer ${newAccessToken}`
      }
    });
    const album = await response.json();
    console.log(album);
    return album;
  }
  if (newAccessToken === '') {
    return(
      <div className="logged_out">
        <a href={`http://localhost:4000/spotify/login/${card.rfid}`}>Log in</a>
      </div>
    );
  }
  else {
    return(
      <div className="card_detail">
        <h2>{newCard.rfid}</h2>
        <h2>{newCard.name}</h2>
        <h2>{newCard.uri}</h2>
        <input value={searchName} onChange={(e) => setSearchName(e.target.value)} onKeyPress={(e) => handleKeyPress(e)}/>
        <button onClick={(e) => handleSearch(e)}>Search</button>
        <ul>
          {albums.map((album) => <Album album={album} setNewCard={setNewCard} key={album.id}/>)}
        </ul>
      </div>
    );
  }
};

export default CardDetail;

export async function getServerSideProps(context) {
  let resp = await fetch("http://localhost:4000/spotify/token");
  const {access_token} = await resp.json();
  resp = await fetch(`http://localhost:4000/card/${context.params.rfid}`);
  const card = await resp.json();
  return {
    props:{card, accessToken:access_token}
  }
  
}