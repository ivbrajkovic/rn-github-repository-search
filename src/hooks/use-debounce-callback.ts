import debounce from 'lodash/fp/debounce';
import { useCallback, useRef } from 'react';

import { useIsomorphicEffect } from '@/hooks/use-isomorphic-effect';

type Func<TArgs extends any[]> = (...args: TArgs) => void;
type Debounced = ReturnType<typeof debounce>;

/**
 * Custom hook that provides a debounced version of a callback function.
 *
 * @template TArgs - The type of the arguments accepted by the callback function.
 * @template TReturn - The return type of the callback function.
 * @param {Func<TArgs, TReturn>} callback - The callback function to be debounced.
 * @param {number} wait - The delay in milliseconds before invoking the debounced callback.
 * @returns {Func<TArgs, TReturn>} - The debounced version of the callback function.
 */
export const useDebounceCallback = <TArgs extends any[]>(
  callback: Func<TArgs>,
  wait: number
): Func<TArgs> => {
  const callbackRef = useRef(callback);
  const callbackDebouncedRef = useRef<Debounced | undefined>(undefined);

  useIsomorphicEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useIsomorphicEffect(() => {
    const func = (...args: TArgs) => callbackRef.current(...args);
    const cancel = () => callbackDebouncedRef.current?.cancel();
    callbackDebouncedRef.current = debounce(wait, func);
    return cancel;
  }, [wait]);

  return useCallback((...args: TArgs) => {
    callbackDebouncedRef.current?.(...args);
  }, []);
};
