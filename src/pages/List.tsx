import Card from '../shared/common/Card';
import styles from './List.module.scss';

export default function List() {
  const cardData = {
    latitude: 12.0,
    longitude: 12.0,
    province: 'New York',
    city: 'New York',
  };
  return (
    <div className={styles.Wrapper}>
      <h1 className={styles.Title}>Weather</h1>
      {/*<Link to="/create">Create New</Link>*/}
      <div className={styles.CardContainer}>
        <Card data={cardData} />
        <Card data={cardData} />
        <Card data={cardData} />
        <Card data={cardData} />
        <Card data={cardData} />
      </div>
    </div>
  );
}
