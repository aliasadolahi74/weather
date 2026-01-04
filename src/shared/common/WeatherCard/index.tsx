import styles from './styles.module.scss';
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import AirFactor from '../AirFactor';
import HourlyTemperature from '../HourlyTemperature';

export interface CardData {
  city: string;
  province: string;
  lat: number;
  lon: number;
  temperature?: number;
  hourlyTemperatures?: { time: string; temp: number }[];
  wind?: number;
  humidity?: number;
  rain?: number;
}

interface CardProps {
  data: CardData;
}

interface AirQualityResponse {
  hourly: {
    european_aqi: number[];
  };
}

const fetchAqi = async (
  lat: number,
  lon: number
): Promise<number | undefined> => {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=european_aqi&forecast_days=1`;
  const res = await fetch(url);
  const data: AirQualityResponse = await res.json();
  const currentHour = new Date().getHours();
  return data.hourly?.european_aqi?.[currentHour];
};

const getAqiLabel = (aqi?: number): string => {
  if (aqi === undefined) return '--';
  if (aqi <= 20) return 'عالی';
  if (aqi <= 40) return 'خوب';
  if (aqi <= 60) return 'ناسالم برای گروه‌های حساس';
  if (aqi <= 80) return 'ناسالم';
  if (aqi <= 100) return 'خیلی ناسالم';
  return 'خطرناک';
};

const Card: React.FC<CardProps> = ({ data }) => {
  const { data: aqi } = useQuery({
    queryKey: ['aqi', data.lat, data.lon],
    queryFn: () => fetchAqi(data.lat, data.lon),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const currentTemp = data.temperature ?? '--';
  const hourlyData = data.hourlyTemperatures?.slice(0, 3) ?? [];

  return (
    <div className={styles.Container}>
      <div className={styles.MainInfo}>
        <h2 className={styles.Temperature}>{currentTemp}° C</h2>
        <div className={styles.Details}>
          <div className={styles.CityInfo}>
            <span className={styles.CityName}>
              {data.city}, {data.province}
            </span>
            <span className={styles.AQI}>{getAqiLabel(aqi)}</span>
          </div>
          <span className={styles.Datetime}>{currentDate}</span>
        </div>
      </div>
      <div className={styles.ForecastDetails}>
        <div className={styles.AirFactors}>
          <AirFactor
            label="Wind"
            value={data.wind !== undefined ? `${data.wind} km/h` : '--'}
          />
          <AirFactor
            label="Humidity"
            value={data.humidity !== undefined ? `${data.humidity}%` : '--'}
          />
          <AirFactor
            label="Rain"
            value={data.rain !== undefined ? `${data.rain}%` : '--'}
          />
        </div>
        <div className={styles.HourlyForecast}>
          {hourlyData.length > 0 ? (
            hourlyData.map((h, i) => (
              <HourlyTemperature
                key={i}
                temperature={`${Math.round(h.temp)}°`}
                hour={h.time}
              />
            ))
          ) : (
            <>
              <HourlyTemperature temperature="--" hour="--" />
              <HourlyTemperature temperature="--" hour="--" />
              <HourlyTemperature temperature="--" hour="--" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
