import { useState , useEffect, useRef } from "react";
import { useRouter } from "next/router"
import Album from '../../components/album'

const CardDetail = ({card, access_token}) => {
  const [searchName, setSearchName]  = useState("");
  const [albums, setAlbums]          = useState([]);
  const [newCard, setNewCard]        = useState(card);
  const isRender                     = useRef(true);
  const router                       = useRouter();
  useEffect(async () => {
    if (isRender.current === false) {
      const response = await fetch(`http://localhost:4000/card/${card.rfid}`, {
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
        Authorization: `Bearer ${access_token}`
      }
    });
    const results  = await response.json();
    const albums = results.albums.items.map((item) => {
      return(
        {
          name: item.name,
          artist: item.artists[0].name,
          image: item.images[2].url,
          uri: item.uri,
          id: item.id
        }
      );
    });
    setAlbums(albums);
    setSearchName("");
  }
  if (access_token === '') {
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
    props:{card, access_token}
  }
  
}