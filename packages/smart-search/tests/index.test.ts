import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { fuzzyMatch, highlightMatches, useSmartSearch } from '../src';

describe('fuzzyMatch & highlightMatches', () => {
  it('fuzzy matches sub-sequences accurately', () => {
    expect(fuzzyMatch('React Component', 'react').match).toBe(true);
    expect(fuzzyMatch('React Component', 'rc').match).toBe(true);
    expect(fuzzyMatch('React Component', 'xyz').match).toBe(false);
  });

  it('splits highlight segments around search query', () => {
    const segments = highlightMatches('JavaScript Library', 'Script');
    expect(segments).toEqual([
      { text: 'Java', isMatch: false },
      { text: 'Script', isMatch: true },
      { text: ' Library', isMatch: false }
    ]);
  });
});

describe('useSmartSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('filters and scores list of items', () => {
    const items = [
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Banana' },
      { id: 3, name: 'Apricot' }
    ];

    const { result } = renderHook(() =>
      useSmartSearch({
        items,
        keys: ['name'],
        debounceMs: 100
      })
    );

    act(() => {
      result.current.setQuery('Ap');
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.results).toHaveLength(2);
    expect(result.current.results[0]?.item.name).toBe('Apple');
    expect(result.current.results[1]?.item.name).toBe('Apricot');
  });
});
