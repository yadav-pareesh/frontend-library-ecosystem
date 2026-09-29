import React, { useCallback, useEffect, useRef, useState } from 'react';
import { isBrowser } from '@pareesh/internal-utils';

export interface UseAutoEllipsisOptions {
  /** Number of visible clamped lines. @default 1 */
  lines?: number;
  /** Whether the text is initially expanded. @default false */
  defaultExpanded?: boolean;
  /** Callback fired whenever truncation state updates. */
  onTruncateChange?: (isTruncated: boolean) => void;
}

export interface AutoEllipsisState {
  isTruncated: boolean;
  isExpanded: boolean;
  toggleExpand: () => void;
  setExpanded: (expanded: boolean) => void;
}

export function useAutoEllipsis<E extends HTMLElement = HTMLDivElement>(
  options: UseAutoEllipsisOptions = {}
): [(element: E | null) => void, AutoEllipsisState] {
  const { lines = 1, defaultExpanded = false, onTruncateChange } = options;

  const [isTruncated, setIsTruncated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const elementRef = useRef<E | null>(null);
  const onTruncateChangeRef = useRef(onTruncateChange);
  onTruncateChangeRef.current = onTruncateChange;

  const checkTruncation = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;

    let truncated = false;
    if (lines <= 1) {
      truncated = el.scrollWidth > el.clientWidth;
    } else {
      truncated = el.scrollHeight > el.clientHeight;
    }

    setIsTruncated(truncated);
    onTruncateChangeRef.current?.(truncated);
  }, [lines]);

  const observerRef = useRef<ResizeObserver | null>(null);

  const refCallback = useCallback(
    (node: E | null) => {
      elementRef.current = node;

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node || !isBrowser) return;

      checkTruncation();

      if ('ResizeObserver' in window) {
        const ro = new ResizeObserver(() => {
          checkTruncation();
        });
        ro.observe(node);
        observerRef.current = ro;
      }
    },
    [checkTruncation]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    checkTruncation();
  }, [checkTruncation, isExpanded]);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return [
    refCallback,
    {
      isTruncated,
      isExpanded,
      toggleExpand,
      setExpanded: setIsExpanded
    }
  ];
}

export interface AutoEllipsisProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  lines?: number;
  expandable?: boolean;
  expandText?: string;
  collapseText?: string;
  ellipsis?: string;
  renderTooltip?: (text: string) => React.ReactNode;
}

export const AutoEllipsis: React.FC<AutoEllipsisProps> = ({
  text,
  lines = 1,
  expandable = false,
  expandText = 'Read more',
  collapseText = 'Show less',
  ellipsis = '...',
  renderTooltip,
  className,
  style,
  ...rest
}) => {
  const [ref, { isTruncated, isExpanded, toggleExpand }] = useAutoEllipsis<HTMLDivElement>({
    lines
  });

  const clampStyle: React.CSSProperties = isExpanded
    ? {}
    : lines > 1
      ? {
          display: '-webkit-box',
          WebkitLineClamp: lines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      : {
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        };

  return (
    <div
      className={className}
      style={{ position: 'relative', ...style }}
      title={isTruncated && !renderTooltip ? text : undefined}
      {...rest}
    >
      <div ref={ref} style={clampStyle}>
        {text}
      </div>
      {isTruncated && renderTooltip && renderTooltip(text)}
      {expandable && (isTruncated || isExpanded) && (
        <button
          type="button"
          onClick={toggleExpand}
          aria-expanded={isExpanded}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            color: 'inherit',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.875em',
            marginTop: 4
          }}
        >
          {isExpanded ? collapseText : expandText}
        </button>
      )}
    </div>
  );
};
