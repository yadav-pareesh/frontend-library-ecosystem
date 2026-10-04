import React, { useCallback, useMemo, useState } from 'react';
import { PLAYGROUND_REGISTRY } from './registry';
import { LogEntry, LogLevel } from './types';
import { DemoContainer } from './components/DemoContainer';
import { LogsPanel } from './logger/LogsPanel';

export interface PlaygroundViewProps {
  selectedPackage: string;
  onNavigateToDocs: (pkgName: string) => void;
}

export function PlaygroundView({ selectedPackage, onNavigateToDocs }: PlaygroundViewProps) {
  const [resetKey, setResetKey] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isLogsMinimized, setIsLogsMinimized] = useState(false);
  const [isLogsExpanded, setIsLogsExpanded] = useState(false);

  const addLog = useCallback(
    (level: LogLevel, message: string, data?: unknown) => {
      if (isPaused) return;
      const newEntry: LogEntry = {
        id: Math.random().toString(36).slice(2, 9),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        level,
        message,
        data
      };
      setLogs((prev) => {
        const next = [...prev, newEntry];
        // Keep max 200 log items for memory performance
        return next.length > 200 ? next.slice(next.length - 200) : next;
      });
    },
    [isPaused]
  );

  const activeDemo = useMemo(
    () => PLAYGROUND_REGISTRY.find((d) => d.packageName === selectedPackage) ?? PLAYGROUND_REGISTRY[0]!,
    [selectedPackage]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 60px)',
        maxHeight: 'calc(100vh - 60px)',
        overflow: 'hidden',
        backgroundColor: 'var(--stripe-bg)',
        flex: 1,
        minWidth: 0
      }}
      className="playground-stage-wrapper"
    >
      {/* Scrollable Demo Stage */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px 32px' }}>
        <DemoContainer
          demo={activeDemo}
          log={addLog}
          resetKey={resetKey}
          onReset={() => setResetKey((k) => k + 1)}
          onNavigateToDocs={onNavigateToDocs}
        />
      </div>

      {/* Docked Real-time Logs Panel */}
      <div
        style={{
          flexShrink: 0,
          height: isLogsMinimized ? '42px' : isLogsExpanded ? '340px' : '220px',
          transition: 'height 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          borderTop: '1px solid var(--stripe-border)',
          backgroundColor: 'var(--code-bg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <LogsPanel
          logs={logs}
          onClear={() => setLogs([])}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused((prev) => !prev)}
          isMinimized={isLogsMinimized}
          onToggleMinimize={() => setIsLogsMinimized((prev) => !prev)}
          isExpanded={isLogsExpanded}
          onToggleExpand={() => setIsLogsExpanded((prev) => !prev)}
        />
      </div>
    </div>
  );
}
