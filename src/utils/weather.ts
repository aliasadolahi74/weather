import type { City } from './db';
import type { CardData } from '@/components/WeatherCard';

interface WeatherResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
    wind_speed_10m: number[];
  };
}

interface AirQualityResponse {
  hourly: {
    european_aqi: number[];
  };
}

async function fetchAqiForCities(
  cities: City[]
): Promise<(number | undefined)[]> {
  if (cities.length === 0) return [];

  const latitudes = cities.map(c => c.lat).join(',');
  const longitudes = cities.map(c => c.lon).join(',');

  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitudes}&longitude=${longitudes}&hourly=european_aqi&forecast_days=1`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  const data: AirQualityResponse[] | AirQualityResponse = await res.json();

  const results = Array.isArray(data) ? data : [data];
  const currentHour = new Date().getHours();

  return results.map(r => r.hourly?.european_aqi?.[currentHour]);
}

export async function fetchWeatherForCities(
  cities: City[]
): Promise<CardData[]> {
  if (cities.length === 0) return [];

  const latitudes = cities.map(c => c.lat).join(',');
  const longitudes = cities.map(c => c.lon).join(',');

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitudes}&longitude=${longitudes}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m&forecast_days=1`;

  const [weatherRes, aqiData] = await Promise.all([
    fetch(weatherUrl, { next: { revalidate: 3600 } }),
    fetchAqiForCities(cities),
  ]);

  const data: WeatherResponse[] | WeatherResponse = await weatherRes.json();
  const results = Array.isArray(data) ? data : [data];
  const currentHour = new Date().getHours();

  return cities.map((city, index) => {
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
      aqi: aqiData[index],
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
}
