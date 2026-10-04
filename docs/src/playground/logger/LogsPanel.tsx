import React, { useEffect, useRef, useState } from 'react';
import { LogEntry, LogLevel } from '../types';

export interface LogsPanelProps {
  logs: LogEntry[];
  onClear: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function LogsPanel({
  logs,
  onClear,
  isPaused,
  onTogglePause,
  isMinimized,
  onToggleMinimize,
  isExpanded,
  onToggleExpand
}: LogsPanelProps) {
  const [filterLevel, setFilterLevel] = useState<'all' | LogLevel>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const [showRawJson, setShowRawJson] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new logs arrive if enabled
  useEffect(() => {
    if (autoScroll && scrollRef.current && !isPaused) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll, isPaused]);

  const filteredLogs = logs.filter((l) => filterLevel === 'all' || l.level === filterLevel);

  const copyLogs = () => {
    const text = showRawJson
      ? JSON.stringify(logs, null, 2)
      : logs
          .map(
            (l) =>
              `[${l.timestamp}] ${l.level.toUpperCase().padEnd(7)} ${l.message}${
                l.data !== undefined ? ` | ${JSON.stringify(l.data)}` : ''
              }`
          )
          .join('\n');
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelStyle = (level: LogLevel) => {
    switch (level) {
      case 'success':
        return {
          color: 'var(--success)',
          bg: 'rgba(5, 150, 105, 0.15)',
          border: 'rgba(5, 150, 105, 0.3)'
        };
      case 'warning':
        return {
          color: 'var(--warning)',
          bg: 'rgba(217, 119, 6, 0.15)',
          border: 'rgba(217, 119, 6, 0.3)'
        };
      case 'error':
        return {
          color: '#ef4444',
          bg: 'rgba(239, 68, 68, 0.15)',
          border: 'rgba(239, 68, 68, 0.3)'
        };
      case 'info':
      default:
        return {
          color: '#38bdf8',
          bg: 'rgba(56, 189, 248, 0.15)',
          border: 'rgba(56, 189, 248, 0.3)'
        };
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--code-bg)',
        border: '1px solid var(--code-border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8rem',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      {/* Header Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: 'var(--code-header)',
          borderBottom: '1px solid var(--code-border)',
          flexWrap: 'wrap',
          gap: 8
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.85rem' }}>📟</span>
          <span style={{ fontWeight: 700, color: 'var(--code-text)', letterSpacing: '0.04em' }}>
            PLAYGROUND LOGS
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              padding: '1px 6px',
              borderRadius: 10,
              backgroundColor: 'var(--stripe-bg-surface)',
              color: 'var(--text-muted)'
            }}
          >
            {filteredLogs.length}
          </span>
          {isPaused && (
            <span
              style={{
                fontSize: '0.68rem',
                padding: '2px 6px',
                borderRadius: 4,
                backgroundColor: 'rgba(217, 119, 6, 0.2)',
                color: 'var(--warning)',
                fontWeight: 600
              }}
            >
              PAUSED
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Level Filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as any)}
            aria-label="Filter logs by level"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--code-text)',
              border: '1px solid var(--code-border)',
              borderRadius: 4,
              padding: '3px 6px',
              fontSize: '0.72rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>

          {/* Pause / Resume */}
          <button
            onClick={onTogglePause}
            title={isPaused ? 'Resume live logging' : 'Pause live logging'}
            style={{
              backgroundColor: isPaused ? 'rgba(217, 119, 6, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              color: isPaused ? 'var(--warning)' : 'var(--code-text)',
              border: '1px solid var(--code-border)',
              borderRadius: 4,
              padding: '3px 8px',
              fontSize: '0.72rem',
              cursor: 'pointer'
            }}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>

          {/* Auto Scroll Toggle */}
          <button
            onClick={() => setAutoScroll((prev) => !prev)}
            title="Toggle auto-scroll to latest log"
            style={{
              backgroundColor: autoScroll ? 'rgba(99, 91, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              color: autoScroll ? 'var(--primary)' : 'var(--code-text)',
              border: '1px solid var(--code-border)',
              borderRadius: 4,
              padding: '3px 8px',
              fontSize: '0.72rem',
              cursor: 'pointer'
            }}
          >
            ↓ Auto-scroll
          </button>

          {/* Raw JSON toggle */}
          <button
            onClick={() => setShowRawJson((prev) => !prev)}
            title="Toggle Raw JSON View"
            style={{
              backgroundColor: showRawJson ? 'rgba(99, 91, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              color: showRawJson ? 'var(--primary)' : 'var(--code-text)',
              border: '1px solid var(--code-border)',
              borderRadius: 4,
              padding: '3px 8px',
              fontSize: '0.72rem',
              cursor: 'pointer'
            }}
          >
            {showRawJson ? 'Standard View' : 'Raw JSON'}
          </button>

          {/* Copy Logs */}
          <button
            onClick={copyLogs}
            title="Copy logs to clipboard"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--code-text)',
              border: '1px solid var(--code-border)',
              borderRadius: 4,
              padding: '3px 8px',
              fontSize: '0.72rem',
              cursor: 'pointer'
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>

          {/* Clear Logs */}
          <button
            onClick={onClear}
            title="Clear all logs"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 4,
              padding: '3px 8px',
              fontSize: '0.72rem',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>

          {/* Toggle Expand / Collapse */}
          {onToggleExpand && !isMinimized && (
            <button
              onClick={onToggleExpand}
              title={isExpanded ? 'Collapse panel height' : 'Expand panel height'}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--code-text)',
                border: '1px solid var(--code-border)',
                borderRadius: 4,
                padding: '3px 8px',
                fontSize: '0.72rem',
                cursor: 'pointer'
              }}
            >
              {isExpanded ? '▼ Compact' : '▲ Expand'}
            </button>
          )}

          {/* Toggle Minimize / Restore */}
          {onToggleMinimize && (
            <button
              onClick={onToggleMinimize}
              title={isMinimized ? 'Restore logs panel' : 'Minimize logs panel'}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--code-text)',
                border: '1px solid var(--code-border)',
                borderRadius: 4,
                padding: '3px 8px',
                fontSize: '0.72rem',
                cursor: 'pointer'
              }}
            >
              {isMinimized ? '▲ Show Logs' : '— Hide'}
            </button>
          )}
        </div>
      </div>

      {/* Log Feed (Hidden when minimized) */}
      {!isMinimized && (
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: '10px 14px',
            lineHeight: 1.6
          }}
        >
          {filteredLogs.length === 0 ? (
            <div style={{ color: 'var(--code-comment)', padding: '24px 0', textAlign: 'center' }}>
              No logs captured yet. Interact with the demo above to view real-time events.
            </div>
          ) : showRawJson ? (
            <pre style={{ margin: 0, color: 'var(--code-text)', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(filteredLogs, null, 2)}
            </pre>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {filteredLogs.map((log) => {
                const style = getLevelStyle(log.level);
                return (
                  <div
                    key={log.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      wordBreak: 'break-word',
                      padding: '2px 0'
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--code-comment)',
                        fontSize: '0.72rem',
                        userSelect: 'none'
                      }}
                    >
                      [{log.timestamp}]
                    </span>
                    <span
                      style={{
                        color: style.color,
                        backgroundColor: style.bg,
                        border: `1px solid ${style.border}`,
                        padding: '0 4px',
                        borderRadius: 3,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        userSelect: 'none',
                        minWidth: 58,
                        textAlign: 'center'
                      }}
                    >
                      {log.level.toUpperCase()}
                    </span>
                    <span style={{ color: 'var(--code-text)', flex: 1 }}>{log.message}</span>
                    {log.data !== undefined && (
                      <span
                        style={{
                          color: 'var(--code-fn)',
                          backgroundColor: 'rgba(56, 189, 248, 0.08)',
                          padding: '1px 6px',
                          borderRadius: 3,
                          fontSize: '0.72rem'
                        }}
                      >
                        {typeof log.data === 'object' ? JSON.stringify(log.data) : String(log.data)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
