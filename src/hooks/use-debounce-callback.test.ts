import { act, renderHook } from '@testing-library/react-native';

import { useDebounceCallback } from '@/hooks/use-debounce-callback';

jest.useFakeTimers();

describe('useDebounceCallback', () => {
  it('should debounce the callback function', () => {
    const callback = jest.fn();
    const delay = 500;

    const { result } = renderHook(() => useDebounceCallback(callback, delay));

    // Trigger the debounced callback multiple times
    act(() => {
      result.current('arg1');
      result.current('arg2');
      result.current('arg3');
    });

    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time and check if the callback has been called once
    jest.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('arg3');
  });

  it('should cancel the previous debounce on delay change', () => {
    const callback = jest.fn();
    let delay = 500;

    const { result, rerender } = renderHook(
      ({ delay }) => useDebounceCallback(callback, delay),
      {
        initialProps: { delay },
      }
    );

    act(() => {
      result.current('arg1');
    });

    // Change the delay
    delay = 1000;
    rerender({ delay });

    // Fast-forward time and check if the callback was not called
    jest.advanceTimersByTime(delay);
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      result.current('arg2');
    });

    // Fast-forward time and check if the callback has been called once
    jest.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('arg2');
  });

  it('should call correct callback when changing the callback', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const delay = 500;

    const { result, rerender } = renderHook(
      ({ callback }) => useDebounceCallback(callback, delay),
      { initialProps: { callback: callback1 } }
    );

    act(() => {
      result.current('arg1');
      result.current('arg2');
    });

    // Change the callback
    rerender({ callback: callback2 });

    // Fast-forward time and check if the second callback was called
    jest.advanceTimersByTime(delay);
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledWith('arg2');
  });

  it('should clean up the debounce on unmount', () => {
    const callback = jest.fn();
    const delay = 500;

    const { result, unmount } = renderHook(() => useDebounceCallback(callback, delay));

    act(() => {
      result.current('arg1');
    });

    // Unmount the hook
    unmount();

    // Fast-forward time and check if the callback was not called
    jest.advanceTimersByTime(delay);
    expect(callback).not.toHaveBeenCalled();
  });
});
