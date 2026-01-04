import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import Card from '../../shared/common/WeatherCard';
import type { CardData } from '../../shared/common/WeatherCard';
import styles from './index.module.scss';
import { getAllCities, type City } from '../../utils/db.ts';
import { hashKey } from '../../utils/hashKey.ts';

const BATCH_SIZE = 8;

interface WeatherResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
    wind_speed_10m: number[];
  };
}

const fetchWeatherBatch = async (
  cities: City[],
  pageParam: number
): Promise<CardData[]> => {
  const citiesToFetch = cities.slice(pageParam, pageParam + BATCH_SIZE);

  if (citiesToFetch.length === 0) return [];

  const latitudes = citiesToFetch.map(c => c.lat).join(',');
  const longitudes = citiesToFetch.map(c => c.lon).join(',');

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitudes}&longitude=${longitudes}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m&forecast_days=1`;

  const res = await fetch(url);
  const data: WeatherResponse[] | WeatherResponse = await res.json();

  const results = Array.isArray(data) ? data : [data];
  const currentHour = new Date().getHours();

  return citiesToFetch.map((city, index) => {
    const weather = results[index];
    const hourlyTemps = weather?.hourly?.temperature_2m ?? [];
    const times = weather?.hourly?.time ?? [];
    const humidity = weather?.hourly?.relative_humidity_2m ?? [];
    const rain = weather?.hourly?.precipitation_probability ?? [];
    const wind = weather?.hourly?.wind_speed_10m ?? [];

    return {
      city: city.city,
      province: city.province,
      lat: city.lat,
      lon: city.lon,
      temperature: hourlyTemps[currentHour],
      wind: wind[currentHour] ? Math.round(wind[currentHour]) : undefined,
      humidity: humidity[currentHour]
        ? Math.round(humidity[currentHour])
        : undefined,
      rain: rain[currentHour] ? Math.round(rain[currentHour]) : undefined,
      hourlyTemperatures: times
        .slice(currentHour, currentHour + 3)
        .map((time, i) => ({
          time: new Date(time).toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
          }),
          temp: hourlyTemps[currentHour + i],
        })),
    };
  });
};

export default function List() {
  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: getAllCities,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['weather-cities', hashKey(cities)],
    queryFn: ({ pageParam }) => fetchWeatherBatch(cities, pageParam),
    initialPageParam: 0,
    getNextPageParam: (_, allPages) => {
      const loadedCount = allPages.flat().length;
      return loadedCount < cities.length ? loadedCount : undefined;
    },
    enabled: cities.length > 0,
  });

  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = loaderRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allCities = data?.pages.flat() ?? [];

  return (
    <div className={styles.Wrapper}>
      <h1 className={styles.Title}>Weather</h1>
      <div className={styles.CardContainer}>
        {isLoading && <div className={styles.Loader}>Loading...</div>}
        {isError && (
          <div className={styles.Loader}>Failed to load weather data</div>
        )}
        {allCities.map((cityData, index) => (
          <Card key={`${cityData.city}-${index}`} data={cityData} />
        ))}
      </div>
      {hasNextPage && (
        <div ref={loaderRef} className={styles.Loader}>
          {isFetchingNextPage ? 'Loading more...' : ''}
        </div>
      )}
    </div>
  );
}
