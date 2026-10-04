import { useCallback, useState } from 'react';

export interface UseUndoRedoOptions {
  /** Maximum number of undo states kept in memory. @default 50 */
  maxHistory?: number;
}

export interface UndoRedoControls<T> {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
  reset: (newInitial: T) => void;
  past: T[];
  future: T[];
}

interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useUndoRedo<T>(
  initialPresent: T | (() => T),
  options: UseUndoRedoOptions = {}
): [T, (next: T | ((current: T) => T)) => void, UndoRedoControls<T>] {
  const { maxHistory = 50 } = options;

  const [state, setState] = useState<UndoRedoState<T>>(() => {
    const initial =
      typeof initialPresent === 'function' ? (initialPresent as () => T)() : initialPresent;
    return {
      past: [],
      present: initial,
      future: []
    };
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    setState((curr) => {
      if (curr.past.length === 0) return curr;

      const previous = curr.past[curr.past.length - 1]!;
      const newPast = curr.past.slice(0, curr.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [curr.present, ...curr.future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((curr) => {
      if (curr.future.length === 0) return curr;

      const next = curr.future[0]!;
      const newFuture = curr.future.slice(1);

      return {
        past: [...curr.past, curr.present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  const setPresent = useCallback(
    (newValOrFn: T | ((current: T) => T)) => {
      setState((curr) => {
        const nextPresent =
          typeof newValOrFn === 'function'
            ? (newValOrFn as (current: T) => T)(curr.present)
            : newValOrFn;

        if (Object.is(curr.present, nextPresent)) {
          return curr;
        }

        const newPast = [...curr.past, curr.present];
        if (newPast.length > maxHistory) {
          newPast.shift();
        }

        return {
          past: newPast,
          present: nextPresent,
          future: [] // Clear future on new action
        };
      });
    },
    [maxHistory]
  );

  const clear = useCallback(() => {
    setState((curr) => ({
      past: [],
      present: curr.present,
      future: []
    }));
  }, []);

  const reset = useCallback((newInitial: T) => {
    setState({
      past: [],
      present: newInitial,
      future: []
    });
  }, []);

  const controls: UndoRedoControls<T> = {
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    reset,
    past: state.past,
    future: state.future
  };

  return [state.present, setPresent, controls];
}
