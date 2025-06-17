import { useEffect, useRef } from 'react';

export const useRenderCount = (component: string) => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`${component} rendered ${renderCount.current} times`);
  });

  useEffect(() => {
    return () => {
      console.log(`${component} unmounted`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return renderCount.current;
};
