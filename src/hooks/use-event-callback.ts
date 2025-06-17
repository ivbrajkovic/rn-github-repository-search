import { useCallback, useRef } from 'react';

import { useIsomorphicEffect } from '@/hooks/use-isomorphic-effect';

type Func<TArgs extends any[], TReturn> = (...args: TArgs) => TReturn;

/**
 * Custom hook that returns a memoized version of the provided callback function.
 * The memoized callback function will always refer to the latest version of the provided function.
 *
 * @template TArgs - The type of arguments accepted by the callback function.
 * @template TReturn - The return type of the callback function.
 * @param {Func<TArgs, TReturn>} func - The callback function to be memoized.
 * @returns {Func<TArgs, TReturn>} - The memoized callback function.
 */
export const useEventCallback = <TArgs extends any[], TReturn>(
  func: Func<TArgs, TReturn>
): Func<TArgs, TReturn> => {
  const ref = useRef(func);

  useIsomorphicEffect(() => {
    ref.current = func;
  }, [func]);

  return useCallback((...args: TArgs) => ref.current(...args), []);
};
