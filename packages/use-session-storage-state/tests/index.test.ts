import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSessionStorageState } from '../src';

describe('useSessionStorageState', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('initializes with default value if sessionStorage is empty', () => {
    const { result } = renderHook(() =>
      useSessionStorageState('test-session', 'default-session')
    );

    expect(result.current[0]).toBe('default-session');
    expect(window.sessionStorage.getItem('test-session')).toBeNull();
  });

  it('updates state and sessionStorage on setStoredValue', () => {
    const { result } = renderHook(() =>
      useSessionStorageState('test-session', 'initial')
    );

    act(() => {
      result.current[1]('session-updated');
    });

    expect(result.current[0]).toBe('session-updated');
    expect(window.sessionStorage.getItem('test-session')).toBe(JSON.stringify('session-updated'));
  });

  it('removes value and resets to default on remove()', () => {
    const { result } = renderHook(() =>
      useSessionStorageState('test-session', 'fallback')
    );

    act(() => {
      result.current[1]('transient-data');
    });

    act(() => {
      result.current[2].remove();
    });

    expect(result.current[0]).toBe('fallback');
    expect(window.sessionStorage.getItem('test-session')).toBeNull();
  });
});
