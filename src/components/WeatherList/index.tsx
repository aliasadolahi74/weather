'use client';

import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from 'react';
import { fetchWeatherBatch } from '@/actions';
import styles from '@/styles/page.module.scss';

interface WeatherListProps {
  initialCards: ReactNode;
  initialHasMore: boolean;
}

export default function WeatherList({
  initialCards,
  initialHasMore,
}: WeatherListProps) {
  const [cards, setCards] = useState<ReactNode[]>([initialCards]);
  const [offset, setOffset] = useState(8);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = loaderRef.current;
    if (!element || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isPending) {
          startTransition(async () => {
            const result = await fetchWeatherBatch(offset);
            setCards(prev => [...prev, result.cards]);
            setOffset(prev => prev + 8);
            setHasMore(result.hasMore);
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasMore, isPending, offset]);

  return (
    <>
      {cards}
      {hasMore && (
        <div ref={loaderRef} className={styles.Loader}>
          {isPending ? 'Loading more...' : ''}
        </div>
      )}
    </>
  );
}
