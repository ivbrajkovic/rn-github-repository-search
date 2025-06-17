import { useEventCallback } from '@/hooks/use-event-callback';
import { renderHook } from '@testing-library/react-native';

describe('useEventCallback', () => {
  it('should return a stable callback reference', () => {
    const callback = jest.fn();
    const { result, rerender } = renderHook(({ cb }) => useEventCallback(cb), {
      initialProps: { cb: callback },
    });

    const firstCallback = result.current;
    rerender({ cb: callback });
    const secondCallback = result.current;

    expect(firstCallback).toBe(secondCallback);
  });

  it('should call the latest callback', () => {
    let callback1 = jest.fn();
    let callback2 = jest.fn();

    const { result, rerender } = renderHook(
      ({ callback }) => useEventCallback(callback),
      { initialProps: { callback: callback1 } }
    );

    // Call with first callback
    result.current();
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();

    // Update to second callback
    rerender({ callback: callback2 });
    result.current();

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments correctly', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useEventCallback(callback));

    result.current('arg1', 'arg2', 123);

    expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 123);
  });
});
