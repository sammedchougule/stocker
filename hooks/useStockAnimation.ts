import { useState, useEffect } from 'react';

export function useStockAnimation<T>(currentValue: T | undefined, compareKeys: (keyof T)[]) {
  const [prevValue, setPrevValue] = useState<T | null>(null);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (currentValue && prevValue) {
      let hasChanged = false;
      let isIncreasing = false;

      for (const key of compareKeys) {
        if (currentValue[key] !== prevValue[key]) {
          hasChanged = true;
          isIncreasing = currentValue[key] > prevValue[key];
          break;
        }
      }

      if (hasChanged) {
        setDirection(isIncreasing ? 'up' : 'down');
      }
    }

    setPrevValue(currentValue || null);
  }, [currentValue, prevValue, compareKeys]);

  return direction;
}

