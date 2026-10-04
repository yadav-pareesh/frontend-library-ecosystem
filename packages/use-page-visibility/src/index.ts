import { useEffect, useRef, useState } from 'react';
import { isBrowser } from '@pareeshy/internal-utils';

export function getDocumentVisibility(): DocumentVisibilityState {
  if (!isBrowser) return 'visible';
  return document.visibilityState;
}

/**
 * Returns whether the document is currently visible (`document.visibilityState === 'visible'`).
 */
export function usePageVisibility(onChange?: (visible: boolean) => void): boolean {
  const [isVisible, setIsVisible] = useState<boolean>(() => getDocumentVisibility() === 'visible');

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!isBrowser) return;

    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      setIsVisible(visible);
      onChangeRef.current?.(visible);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
}

/**
 * Returns the exact DocumentVisibilityState ('visible' | 'hidden').
 */
export function useDocumentVisibility(
  onChange?: (state: DocumentVisibilityState) => void
): DocumentVisibilityState {
  const [state, setState] = useState<DocumentVisibilityState>(getDocumentVisibility);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!isBrowser) return;

    const handleVisibilityChange = () => {
      const nextState = document.visibilityState;
      setState(nextState);
      onChangeRef.current?.(nextState);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return state;
}
