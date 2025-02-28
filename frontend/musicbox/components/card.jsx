import styles from '../styles/Card.module.css';
import Link from 'next/link';

const Card = ({card}) => {
  return (
    <Link href={`http://localhost:4000/rfid/${card.rfid}`}>
      <div className={styles.card}>
        <div className={styles.container}>
          <h4>{card.rfid}</h4>
        </div>
      </div>
    </Link>
  );
};

export default Card;