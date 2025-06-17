import debounce from 'lodash/debounce';
import { SetStateAction, useCallback, useRef, useState } from 'react';

import { useIsomorphicEffect } from '@/hooks/use-isomorphic-effect';

export interface UseDebouncedStateOptions {
  leading?: boolean;
  trailing?: boolean;
}

export type UseDebouncedStateReturnValue<T> = [T, (newValue: SetStateAction<T>) => void];

type DebouncedFunc<T extends (...args: any[]) => any> = ReturnType<typeof debounce<T>>;

export const useDebouncedState = <T = any>(
  defaultValue: T,
  wait: number,
  { leading = false, trailing = true }: UseDebouncedStateOptions = {}
): UseDebouncedStateReturnValue<T> => {
  const [value, setValue] = useState(defaultValue);
  const debouncedSetValueRef = useRef<
    DebouncedFunc<(newValue: SetStateAction<T>) => void> | undefined
  >(undefined);

  useIsomorphicEffect(() => {
    const setValueFunc = (newValue: SetStateAction<T>) => setValue(newValue);
    const cancel = () => debouncedSetValueRef.current?.cancel();
    debouncedSetValueRef.current = debounce(setValueFunc, wait, { leading, trailing });
    return cancel;
  }, [wait, leading, trailing]);

  const debouncedSetValue = useCallback((newValue: SetStateAction<T>) => {
    debouncedSetValueRef.current?.(newValue);
  }, []);

  return [value, debouncedSetValue] as const;
};
