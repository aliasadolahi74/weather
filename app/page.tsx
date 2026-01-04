import Link from 'next/link';
import styles from '@/styles/page.module.scss';
import { getAllCities } from '@/utils/db';
import { fetchWeatherForCities } from '@/utils/weather';
import Card from '@/components/WeatherCard';
import WeatherList from '@/components/WeatherList';

const BATCH_SIZE = 8;

export default async function Home() {
  const cities = await getAllCities();
  const initialBatch = cities.slice(0, BATCH_SIZE);
  const initialData = await fetchWeatherForCities(initialBatch);
  const hasMore = cities.length > BATCH_SIZE;

  const initialCards = initialData.map((cityData, index) => (
    <Card key={`${cityData.city}-${index}`} data={cityData} />
  ));

  return (
    <div className={styles.Wrapper}>
      <h1 className={styles.Title}>Weather</h1>
      <div className={styles.CardContainer}>
        <WeatherList initialCards={initialCards} initialHasMore={hasMore} />
      </div>
      <Link href="/create" className={styles.FloatingButton}>
        +
      </Link>
    </div>
  );
}
