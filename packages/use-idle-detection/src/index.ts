import { useCallback, useEffect, useRef, useState } from 'react';
import { isBrowser } from '@pareesh/internal-utils';

export interface UseIdleOptions {
  /** Inactivity timeout in milliseconds before transitioning to idle. @default 60000 (1 minute) */
  timeout?: number;
  /** Initial idle state. @default false */
  initialIdle?: boolean;
  /** Callback fired when user becomes idle. */
  onIdle?: () => void;
  /** Callback fired when user becomes active. */
  onActive?: () => void;
  /** Custom DOM event list to track activity. */
  events?: string[];
  /** Whether to consider document hidden as idle immediately. @default false */
  idleOnVisibilityHidden?: boolean;
}

export interface IdleDetectionResult {
  isIdle: boolean;
  lastActive: number;
  reset: () => void;
  pause: () => void;
  resume: () => void;
}

const DEFAULT_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'wheel',
  'pointerdown',
  'scroll'
];

export function useIdleDetection(options: UseIdleOptions = {}): IdleDetectionResult {
  const {
    timeout = 60_000,
    initialIdle = false,
    onIdle,
    onActive,
    events = DEFAULT_EVENTS,
    idleOnVisibilityHidden = false
  } = options;

  const [isIdle, setIsIdle] = useState(initialIdle);
  const [lastActive, setLastActive] = useState<number>(() => Date.now());

  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;

  const isPausedRef = useRef(false);
  const isIdleRef = useRef(isIdle);
  isIdleRef.current = isIdle;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    if (isPausedRef.current) return;

    timerRef.current = setTimeout(() => {
      setIsIdle(true);
      onIdleRef.current?.();
    }, timeout);
  }, [timeout]);

  const handleActivity = useCallback(() => {
    if (isPausedRef.current) return;

    const now = Date.now();
    setLastActive(now);

    if (isIdleRef.current) {
      setIsIdle(false);
      onActiveRef.current?.();
    }

    startTimer();
  }, [startTimer]);

  const reset = useCallback(() => {
    setIsIdle(false);
    setLastActive(Date.now());
    startTimer();
  }, [startTimer]);

  const pause = useCallback(() => {
    isPausedRef.current = true;
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    isPausedRef.current = false;
    reset();
  }, [reset]);

  useEffect(() => {
    if (!isBrowser) return;

    startTimer();

    const handleEvent = () => handleActivity();

    events.forEach((eventType) => {
      window.addEventListener(eventType, handleEvent, { passive: true });
    });

    const handleVisibilityChange = () => {
      if (document.hidden && idleOnVisibilityHidden) {
        setIsIdle(true);
        onIdleRef.current?.();
      } else if (!document.hidden) {
        handleActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      events.forEach((eventType) => {
        window.removeEventListener(eventType, handleEvent);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [events, handleActivity, idleOnVisibilityHidden, startTimer]);

  return {
    isIdle,
    lastActive,
    reset,
    pause,
    resume
  };
}
