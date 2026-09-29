import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUrlState } from '../src';

describe('useUrlState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState({}, '', '/');
  });

  it('initializes with defaultValue and updates URL params on change', () => {
    const { result } = renderHook(() => useUrlState('page', 1));

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1](2);
    });

    expect(result.current[0]).toBe(2);
    expect(window.location.search).toContain('page=2');
  });

  it('supports array serialization and deserialization', () => {
    const { result } = renderHook(() => useUrlState<string[]>('tags', []));

    act(() => {
      result.current[1](['react', 'typescript']);
    });

    expect(result.current[0]).toEqual(['react', 'typescript']);
    expect(window.location.search).toContain('tags=react%2Ctypescript');
  });

  it('clears param when clear() is invoked', () => {
    const { result } = renderHook(() => useUrlState('filter', 'active'));

    act(() => {
      result.current[1]('completed');
    });
    expect(window.location.search).toContain('filter=completed');

    act(() => {
      result.current[2].clear();
    });

    expect(result.current[0]).toBe('active');
    expect(window.location.search).not.toContain('filter=');
  });
});
