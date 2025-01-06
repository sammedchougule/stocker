import { useState, useEffect } from 'react';

export function useStockAnimation<T>(
  currentValue: T | undefined,
  compareKeys: (keyof T)[]
): 'up' | 'down' | 'neutral' {
  const [prevValue, setPrevValue] = useState<T | null>(null);
  const [direction, setDirection] = useState<'up' | 'down' | 'neutral'>('neutral');

  useEffect(() => {
    if (currentValue && prevValue) {
      for (const key of compareKeys) {
        if (currentValue[key] !== prevValue[key]) {
          const isIncreasing = currentValue[key] > prevValue[key];
          setDirection(isIncreasing ? 'up' : 'down');
          break;
        }
      }
    } else if (!prevValue) {
      // Handle initial render or reset direction
      setDirection('neutral');
    }

    setPrevValue(currentValue || null);
  }, [currentValue, prevValue, compareKeys]);

  return direction;
}
