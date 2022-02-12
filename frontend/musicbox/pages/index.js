import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Card from '../components/card';
import { useEffect, useContext } from 'react';
import LoginContext from "../context/logincontext";

export default function Home({cards, initialToken}) {
  const {token, setToken} = useContext(LoginContext);
  useEffect(() => {
    setToken(initialToken);
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Musicbox</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Musicbox
        </h1>
        <ul>
          {
            cards.map((card) => {
              return(
                <Card card={card} key={card.rfid}/>
              );
            })
          }
        </ul>
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  let resp = await fetch("http://localhost:4000/spotify/token");
  const {access_token} = await resp.json();
  resp  = await fetch("http://localhost:4000/card");
  const cards = await resp.json();
  return {
    props: {cards, initialToken: access_token}
  }
}
