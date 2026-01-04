'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addCity, getAllCities } from '@/utils/db';
import { fetchWeatherForCities } from '@/utils/weather';
import Card from '@/components/WeatherCard';
import type { ReactNode } from 'react';

const BATCH_SIZE = 8;

export async function createCity(formData: FormData) {
  const city = formData.get('city') as string;
  const province = formData.get('province') as string;
  const lat = parseFloat(formData.get('lat') as string);
  const lon = parseFloat(formData.get('lon') as string);

  await addCity({ city, province, lat, lon });

  revalidatePath('/');
  redirect('/');
}

export async function fetchWeatherBatch(offset: number): Promise<{
  cards: ReactNode;
  hasMore: boolean;
}> {
  const cities = await getAllCities();
  const batch = cities.slice(offset, offset + BATCH_SIZE);
  const data = await fetchWeatherForCities(batch);

  const cards = data.map((cityData, index) => (
    <Card key={`${cityData.city}-${offset + index}`} data={cityData} />
  ));

  return {
    cards,
    hasMore: offset + BATCH_SIZE < cities.length,
  };
}
