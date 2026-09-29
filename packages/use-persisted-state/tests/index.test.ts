import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePersistedState } from '../src';

describe('usePersistedState', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('stores and retrieves envelope with version', () => {
    const { result } = renderHook(() =>
      usePersistedState('user-settings', { dark: true }, { version: 1 })
    );

    expect(result.current[0]).toEqual({ dark: true });

    act(() => {
      result.current[1]({ dark: false });
    });

    expect(result.current[0]).toEqual({ dark: false });
    const stored = JSON.parse(window.localStorage.getItem('user-settings') || '{}');
    expect(stored.value).toEqual({ dark: false });
    expect(stored.version).toBe(1);
  });

  it('runs migration when schema version increases', () => {
    // Seed old version 1
    window.localStorage.setItem(
      'profile',
      JSON.stringify({ value: { name: 'Alice' }, version: 1, expiresAt: null })
    );

    const migrate = vi.fn((oldVal: any, oldVer: number) => {
      return { fullName: oldVal.name, upgraded: true };
    });

    const { result } = renderHook(() =>
      usePersistedState(
        'profile',
        { fullName: '', upgraded: false },
        { version: 2, migrate }
      )
    );

    expect(result.current[0]).toEqual({ fullName: 'Alice', upgraded: true });
    expect(migrate).toHaveBeenCalledWith({ name: 'Alice' }, 1);
  });

  it('expires state when ttlMs has elapsed', () => {
    const now = Date.now();
    // Seed expired item
    window.localStorage.setItem(
      'auth-token',
      JSON.stringify({ value: 'expired-token', version: 1, expiresAt: now - 1000 })
    );

    const { result } = renderHook(() =>
      usePersistedState('auth-token', 'guest-token')
    );

    expect(result.current[0]).toBe('guest-token');
  });
});
