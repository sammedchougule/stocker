import { useState, useEffect, useRef } from 'react';

export function useStockAnimation<T>(currentValue: T | undefined, compareKeys: (keyof T)[]) {
  const prevValueRef = useRef<T | undefined>(undefined);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const prevValue = prevValueRef.current;
    if (currentValue && prevValue) {
      for (const key of compareKeys) {
        if (currentValue[key] !== prevValue[key]) {
          setDirection(currentValue[key] > prevValue[key] ? 'up' : 'down');
          break;
        }
      }
    }
    prevValueRef.current = currentValue;
  }, [currentValue, compareKeys]);

  return direction;
}
