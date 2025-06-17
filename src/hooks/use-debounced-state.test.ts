import { useDebouncedState } from '@/hooks/use-debounced-state';
import { act, renderHook } from '@testing-library/react-native';

jest.useFakeTimers();

describe('use-debounced-state', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it('should run without errors', () => {
    const { unmount } = renderHook(() => useDebouncedState('asdf1', 100));
    unmount();

    const { unmount: unmount2 } = renderHook(() =>
      useDebouncedState('asdf1', 100, { leading: false })
    );
    unmount2();

    const { unmount: unmount3 } = renderHook(() =>
      useDebouncedState('asdf1', 100, { leading: true })
    );
    unmount3();
  });

  it('should debounce value with leading=false', () => {
    const hook = renderHook(() => useDebouncedState('test1', 100));
    expect(hook.result.current[0]).toEqual('test1');

    act(() => hook.result.current[1]('test2'));
    expect(hook.result.current[0]).toEqual('test1');

    act(() => hook.result.current[1]('test3'));
    expect(hook.result.current[0]).toEqual('test1');

    // Fast-forward time to trigger debounced function
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(hook.result.current[0]).toEqual('test3');

    act(() => hook.result.current[1]((prev) => `${prev}0`));
    expect(hook.result.current[0]).toEqual('test3');

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(hook.result.current[0]).toEqual('test30');
  });

  it('should debounce value with leading=true', () => {
    const hook = renderHook(() => useDebouncedState('test1', 100, { leading: true }));
    expect(hook.result.current[0]).toEqual('test1');

    act(() => hook.result.current[1]('test2'));
    // With leading=true, value should change immediately
    expect(hook.result.current[0]).toEqual('test2');

    act(() => hook.result.current[1]('test3'));
    // Subsequent calls should be ignored until debounce period ends
    expect(hook.result.current[0]).toEqual('test2');

    // Fast-forward time to allow trailing edge
    act(() => {
      jest.advanceTimersByTime(100);
    });
    // at the end of the debounce period, the last value should be set
    expect(hook.result.current[0]).toEqual('test3');
  });
});
