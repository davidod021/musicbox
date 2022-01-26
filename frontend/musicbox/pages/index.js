import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Card from '../components/card'

export default function Home({cards}) {
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
  const resp  = await fetch("http://localhost:4000/card");
  const cards = await resp.json();
  return {
    props: {cards}
  }
}
