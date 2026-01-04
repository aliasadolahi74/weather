import { promises as fs } from 'fs';
import path from 'path';

export interface City {
  province: string;
  city: string;
  lat: number;
  lon: number;
}

const citiesFilePath = path.join(process.cwd(), 'src/utils/cities.json');

export async function getAllCities(): Promise<City[]> {
  const data = await fs.readFile(citiesFilePath, 'utf-8');
  return JSON.parse(data);
}

export async function addCity(city: City): Promise<void> {
  const cities = await getAllCities();
  cities.push(city);
  await fs.writeFile(citiesFilePath, JSON.stringify(cities, null, 2), 'utf-8');
}
