import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorageState } from '../src';

describe('useLocalStorageState', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('initializes with default value if localStorage is empty', () => {
    const { result } = renderHook(() =>
      useLocalStorageState('test-key', 'default-val')
    );

    expect(result.current[0]).toBe('default-val');
    expect(window.localStorage.getItem('test-key')).toBeNull();
  });

  it('updates state and localStorage on setValue', () => {
    const { result } = renderHook(() =>
      useLocalStorageState('test-key', 'initial')
    );

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  it('supports functional updater pattern', () => {
    const { result } = renderHook(() =>
      useLocalStorageState<number>('count', 10)
    );

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(15);
    expect(window.localStorage.getItem('count')).toBe(JSON.stringify(15));
  });

  it('removes value and restores default on remove()', () => {
    const { result } = renderHook(() =>
      useLocalStorageState('test-key', 'default-val')
    );

    act(() => {
      result.current[1]('temporary');
    });
    expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('temporary'));

    act(() => {
      result.current[2].remove();
    });

    expect(result.current[0]).toBe('default-val');
    expect(window.localStorage.getItem('test-key')).toBeNull();
  });

  it('synchronizes state when custom storage event triggers', () => {
    const { result } = renderHook(() =>
      useLocalStorageState('synced-key', 'initial')
    );

    act(() => {
      window.dispatchEvent(
        new CustomEvent('pareeshy:local-storage-change', {
          detail: { key: 'synced-key', newValue: JSON.stringify('synced-value') }
        })
      );
    });

    expect(result.current[0]).toBe('synced-value');
  });
});
