import citiesData from './cities.json';

export interface City {
  id?: number;
  province: string;
  city: string;
  lat: number;
  lon: number;
}

const DB_NAME = 'weatherDB';
const DB_VERSION = 1;
const STORE_NAME = 'cities';

let dbInstance: IDBDatabase | null = null;

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };
  });
};

export const seedDatabase = async (): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);

  const countRequest = store.count();

  return new Promise((resolve, reject) => {
    countRequest.onsuccess = async () => {
      if (countRequest.result === 0) {
        const writeTx = db.transaction(STORE_NAME, 'readwrite');
        const writeStore = writeTx.objectStore(STORE_NAME);

        for (const city of citiesData) {
          writeStore.add(city);
        }

        writeTx.oncomplete = () => resolve();
        writeTx.onerror = () => reject(writeTx.error);
      } else {
        resolve();
      }
    };
    countRequest.onerror = () => reject(countRequest.error);
  });
};

export const getAllCities = async (): Promise<City[]> => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const addCity = async (city: Omit<City, 'id'>): Promise<number> => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.add(city);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
};

export const initDB = async (): Promise<void> => {
  await openDB();
  await seedDatabase();
};
