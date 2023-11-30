import { useCallback, useState } from 'react';

export function useBoolean(startingValue: boolean) {
  const [value, setValue] = useState(startingValue);
  const toggle = useCallback(() => setValue((x) => !x), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return [value, { toggle, setTrue, setFalse }] as const;
}
