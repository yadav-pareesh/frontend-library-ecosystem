import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useShortcut, parseShortcut } from '../src';

describe('react-shortcuts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('parses modifiers and keys accurately', () => {
    const parsed = parseShortcut('Ctrl+Shift+K');
    expect(parsed.ctrl).toBe(true);
    expect(parsed.shift).toBe(true);
    expect(parsed.alt).toBe(false);
    expect(parsed.key).toBe('k');
  });

  it('invokes handler when matched key sequence is pressed', () => {
    const handler = vi.fn();
    renderHook(() => useShortcut('ctrl+s', handler));

    // Matching event
    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
      bubbles: true
    });
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);

    // Non-matching event (missing ctrl)
    const unmatched = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: false,
      bubbles: true
    });
    window.dispatchEvent(unmatched);

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
