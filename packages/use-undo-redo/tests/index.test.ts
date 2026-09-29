import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUndoRedo } from '../src';

describe('useUndoRedo', () => {
  it('manages undo and redo stacks correctly', () => {
    const { result } = renderHook(() => useUndoRedo('A'));

    expect(result.current[0]).toBe('A');
    expect(result.current[2].canUndo).toBe(false);
    expect(result.current[2].canRedo).toBe(false);

    act(() => {
      result.current[1]('B');
    });
    expect(result.current[0]).toBe('B');
    expect(result.current[2].canUndo).toBe(true);
    expect(result.current[2].canRedo).toBe(false);

    act(() => {
      result.current[1]('C');
    });
    expect(result.current[0]).toBe('C');

    // Undo to B
    act(() => {
      result.current[2].undo();
    });
    expect(result.current[0]).toBe('B');
    expect(result.current[2].canUndo).toBe(true);
    expect(result.current[2].canRedo).toBe(true);

    // Undo to A
    act(() => {
      result.current[2].undo();
    });
    expect(result.current[0]).toBe('A');
    expect(result.current[2].canUndo).toBe(false);
    expect(result.current[2].canRedo).toBe(true);

    // Redo to B
    act(() => {
      result.current[2].redo();
    });
    expect(result.current[0]).toBe('B');
    expect(result.current[2].canUndo).toBe(true);
    expect(result.current[2].canRedo).toBe(true);
  });

  it('clears future stack when a new state is set after an undo', () => {
    const { result } = renderHook(() => useUndoRedo(1));

    act(() => {
      result.current[1](2);
      result.current[1](3);
    });

    act(() => {
      result.current[2].undo(); // At 2
    });

    act(() => {
      result.current[1](4); // New branch: past is [1, 2], present is 4, future empty
    });

    expect(result.current[0]).toBe(4);
    expect(result.current[2].canRedo).toBe(false);
    expect(result.current[2].past).toEqual([1, 2]);
  });
});
