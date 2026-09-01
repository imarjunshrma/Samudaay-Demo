import { act, renderHook } from '@testing-library/react-native';

import { useDebounce } from '../useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello'));
    expect(result.current).toBe('hello');
  });

  it('does not update value before delay elapses', () => {
    const { result, rerender } = renderHook<string, { value: string }>(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'updated' });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('initial');
  });

  it('updates value after delay elapses', () => {
    const { result, rerender } = renderHook<string, { value: string }>(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'updated' });
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  it('resets timer on rapid value changes', () => {
    const { result, rerender } = renderHook<string, { value: string }>(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    act(() => { jest.advanceTimersByTime(100); });

    rerender({ value: 'c' });
    act(() => { jest.advanceTimersByTime(100); });

    rerender({ value: 'd' });
    act(() => { jest.advanceTimersByTime(100); });

    // 300ms has passed total but the timer restarted on each change
    expect(result.current).toBe('a');

    act(() => { jest.advanceTimersByTime(300); });
    expect(result.current).toBe('d');
  });

  it('uses 300ms default delay', () => {
    const { result, rerender } = renderHook<string, { value: string }>(({ value }) => useDebounce(value), {
      initialProps: { value: 'start' },
    });

    rerender({ value: 'end' });
    act(() => { jest.advanceTimersByTime(299); });
    expect(result.current).toBe('start');

    act(() => { jest.advanceTimersByTime(1); });
    expect(result.current).toBe('end');
  });

  it('works with non-string types', () => {
    const { result, rerender } = renderHook<number, { value: number }>(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 0 },
    });

    rerender({ value: 42 });
    act(() => { jest.advanceTimersByTime(200); });
    expect(result.current).toBe(42);
  });
});
