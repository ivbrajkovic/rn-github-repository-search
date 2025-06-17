import { useEffect, useLayoutEffect } from 'react';
import { Platform } from 'react-native';

/**
 * A universal isomorphic effect hook that avoids SSR warnings on web.
 * - On native (iOS, Android), always uses useLayoutEffect.
 * - On web, uses useLayoutEffect only on the client (after hydration).
 */
export const useIsomorphicEffect =
  Platform.OS !== 'web' || typeof window !== 'undefined' ? useLayoutEffect : useEffect;
