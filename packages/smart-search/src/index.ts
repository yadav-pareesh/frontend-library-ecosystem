import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface FuzzyMatchResult {
  match: boolean;
  score: number;
}

export function fuzzyMatch(target: string, query: string): FuzzyMatchResult {
  const t = target.toLowerCase();
  const q = query.toLowerCase().trim();

  if (!q) return { match: true, score: 1 };
  if (t === q) return { match: true, score: 100 };
  if (t.startsWith(q)) return { match: true, score: 80 };
  if (t.includes(q)) return { match: true, score: 50 };

  let tIdx = 0;
  let qIdx = 0;
  let score = 0;

  while (tIdx < t.length && qIdx < q.length) {
    if (t[tIdx] === q[qIdx]) {
      score += 10;
      qIdx++;
    }
    tIdx++;
  }

  const match = qIdx === q.length;
  return { match, score: match ? score : 0 };
}

export interface HighlightSegment {
  text: string;
  isMatch: boolean;
}

export function highlightMatches(text: string, query: string): HighlightSegment[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return [{ text, isMatch: false }];
  }

  const regex = new RegExp(`(${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts
    .filter(Boolean)
    .map((part) => ({
      text: part,
      isMatch: part.toLowerCase() === trimmed.toLowerCase()
    }));
}

export interface SearchResult<T> {
  item: T;
  score: number;
}

export interface UseSmartSearchOptions<T> {
  items: T[];
  keys: (keyof T | ((item: T) => string))[];
  threshold?: number;
  debounceMs?: number;
  recentLimit?: number;
}

export interface UseSmartSearchReturn<T> {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult<T>[];
  selectedIndex: number;
  setSelectedIndex: (idx: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  recentSearches: string[];
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
}

export function useSmartSearch<T>(
  options: UseSmartSearchOptions<T>
): UseSmartSearchReturn<T> {
  const {
    items,
    keys,
    threshold = 10,
    debounceMs = 150,
    recentLimit = 5
  } = options;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return items.map((item) => ({ item, score: 0 }));
    }

    const scored: SearchResult<T>[] = [];

    for (const item of items) {
      let maxScore = 0;

      for (const key of keys) {
        const val = typeof key === 'function' ? key(item) : String(item[key] ?? '');
        const match = fuzzyMatch(val, debouncedQuery);
        if (match.match && match.score > maxScore) {
          maxScore = match.score;
        }
      }

      if (maxScore >= threshold) {
        scored.push({ item, score: maxScore });
      }
    }

    return scored.sort((a, b) => b.score - a.score);
  }, [items, keys, debouncedQuery, threshold]);

  const addRecentSearch = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
        return [trimmed, ...filtered].slice(0, recentLimit);
      });
    },
    [recentLimit]
  );

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedIndex(-1);
      }
    },
    [results.length]
  );

  return {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    onKeyDown,
    recentSearches,
    addRecentSearch,
    clearRecentSearches
  };
}
