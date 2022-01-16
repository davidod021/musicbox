import { useState } from "react";
import { useRouter } from "next/router"

const CardDetail = ({card, access_token}) => {
  const [newCard, setNewCard]       = useState(card);
  const router                      = useRouter();
  const handleSubmit = async (e) => {
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
    router.back();
  };
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
        <input value={newCard.name} onChange={(e) => setNewCard({...newCard, name: e.target.value})}/>
        <button onClick={(e) => handleSubmit(e)}>Submit</button>
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
  console.log(card);
  console.log(access_token);
  return {
    props:{card, access_token}
  }
  
}