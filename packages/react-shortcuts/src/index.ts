import { useEffect, useRef } from 'react';
import { isBrowser } from '@pareeshy/internal-utils';

export interface ParsedShortcut {
  meta: boolean;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  key: string;
}

export const isMac =
  isBrowser &&
  typeof navigator !== 'undefined' &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform || '');

export function parseShortcut(combo: string): ParsedShortcut {
  const parts = combo
    .toLowerCase()
    .split('+')
    .map((p) => p.trim());

  let meta = false;
  let ctrl = false;
  let alt = false;
  let shift = false;
  let key = '';

  for (const part of parts) {
    if (part === 'mod' || part === 'cmd' || part === 'command') {
      if (isMac) {
        meta = true;
      } else {
        ctrl = true;
      }
    } else if (part === 'ctrl' || part === 'control') {
      ctrl = true;
    } else if (part === 'meta') {
      meta = true;
    } else if (part === 'alt' || part === 'option') {
      alt = true;
    } else if (part === 'shift') {
      shift = true;
    } else {
      key = part;
    }
  }

  return { meta, ctrl, alt, shift, key };
}

export interface ShortcutOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  /** Ignore shortcuts when user is focused inside an <input>, <textarea>, or contenteditable. @default true */
  ignoreInputs?: boolean;
  target?: HTMLElement | Document | Window | null;
}

function isTextInput(element: EventTarget | null): boolean {
  if (!element || !(element instanceof HTMLElement)) return false;
  const tag = element.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || element.isContentEditable;
}

export function useShortcut(
  combination: string,
  handler: (event: KeyboardEvent) => void,
  options: ShortcutOptions = {}
): void {
  const {
    enabled = true,
    preventDefault = true,
    stopPropagation = false,
    ignoreInputs = true,
    target
  } = options;

  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!isBrowser || !enabled) return;

    const parsed = parseShortcut(combination);
    const eventTarget = target || window;

    const handleKeyDown = (event: Event) => {
      const e = event as KeyboardEvent;

      if (ignoreInputs && isTextInput(e.target)) {
        return;
      }

      const keyMatches =
        e.key.toLowerCase() === parsed.key ||
        e.code.toLowerCase() === parsed.key ||
        (parsed.key === 'esc' && e.key.toLowerCase() === 'escape');

      const modifierMatches =
        Boolean(parsed.meta) === Boolean(e.metaKey) &&
        Boolean(parsed.ctrl) === Boolean(e.ctrlKey) &&
        Boolean(parsed.alt) === Boolean(e.altKey) &&
        Boolean(parsed.shift) === Boolean(e.shiftKey);

      if (keyMatches && modifierMatches) {
        if (preventDefault) {
          e.preventDefault();
        }
        if (stopPropagation) {
          e.stopPropagation();
        }
        handlerRef.current(e);
      }
    };

    eventTarget.addEventListener('keydown', handleKeyDown as EventListener);

    return () => {
      eventTarget.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [combination, enabled, preventDefault, stopPropagation, ignoreInputs, target]);
}
