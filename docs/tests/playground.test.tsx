import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PLAYGROUND_REGISTRY, PLAYGROUND_CATEGORIES } from '../src/playground/registry';
import { PackageSelector } from '../src/playground/components/PackageSelector';
import { LogsPanel } from '../src/playground/logger/LogsPanel';
import { PlaygroundErrorBoundary } from '../src/playground/components/PlaygroundErrorBoundary';
import { AiAssistantDemo } from '../src/playground/demos/aiAssistantDemo';
import { LogEntry } from '../src/playground/types';

describe('Playground Registry', () => {
  it('contains all 34 demo entries with valid metadata and components', () => {
    expect(PLAYGROUND_REGISTRY.length).toBeGreaterThanOrEqual(33);

    PLAYGROUND_REGISTRY.forEach((item) => {
      expect(item.packageName).toBeDefined();
      expect(item.title).toBeDefined();
      expect(item.description).toBeDefined();
      expect(item.category).toBeDefined();
      expect(item.component).toBeDefined();
      expect(item.codeSnippet).toBeDefined();
    });
  });

  it('includes deterministic local AI mock assistant demo', () => {
    const aiDemo = PLAYGROUND_REGISTRY.find((d) => d.packageName === '@pareeshy/ai-mock-assistant');
    expect(aiDemo).toBeDefined();
    expect(aiDemo?.category).toBe('Developer Experience');
  });

  it('provides all expected category filters', () => {
    expect(PLAYGROUND_CATEGORIES).toContain('All');
    expect(PLAYGROUND_CATEGORIES).toContain('React Hooks');
    expect(PLAYGROUND_CATEGORIES).toContain('Browser APIs');
    expect(PLAYGROUND_CATEGORIES).toContain('State Management');
  });
});

describe('PackageSelector Component', () => {
  it('renders package items and filters by search query', () => {
    const onSelect = vi.fn();
    render(
      <PackageSelector
        demos={PLAYGROUND_REGISTRY}
        selectedPackage="@pareeshy/use-debounced-value"
        onSelectPackage={onSelect}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search packages...');
    expect(searchInput).toBeTruthy();

    // Type query
    fireEvent.change(searchInput, { target: { value: 'debounced' } });
    expect(screen.getByText('use-debounced-value')).toBeTruthy();

    // Package item click
    const item = screen.getByText('use-debounced-value');
    fireEvent.click(item);
    expect(onSelect).toHaveBeenCalledWith('@pareeshy/use-debounced-value');
  });

  it('filters by category pills', () => {
    const onSelect = vi.fn();
    render(
      <PackageSelector
        demos={PLAYGROUND_REGISTRY}
        selectedPackage="@pareeshy/use-debounced-value"
        onSelectPackage={onSelect}
      />
    );

    const hooksPill = screen.getByText('React Hooks');
    fireEvent.click(hooksPill);

    expect(screen.getByText('use-debounced-value')).toBeTruthy();
  });
});

describe('LogsPanel Component', () => {
  const sampleLogs: LogEntry[] = [
    { id: '1', timestamp: '12:00:00', level: 'info', message: 'Demo initialized' },
    { id: '2', timestamp: '12:00:01', level: 'success', message: 'Operation completed' },
    { id: '3', timestamp: '12:00:02', level: 'error', message: 'Failed to connect' }
  ];

  it('renders log messages with levels and timestamps', () => {
    render(
      <LogsPanel logs={sampleLogs} onClear={vi.fn()} isPaused={false} onTogglePause={vi.fn()} />
    );

    expect(screen.getByText('Demo initialized')).toBeTruthy();
    expect(screen.getByText('Operation completed')).toBeTruthy();
    expect(screen.getByText('Failed to connect')).toBeTruthy();
  });

  it('filters logs by log level filter dropdown', () => {
    render(
      <LogsPanel logs={sampleLogs} onClear={vi.fn()} isPaused={false} onTogglePause={vi.fn()} />
    );

    const filterSelect = screen.getByLabelText('Filter logs by level');
    fireEvent.change(filterSelect, { target: { value: 'error' } });

    expect(screen.getByText('Failed to connect')).toBeTruthy();
    expect(screen.queryByText('Demo initialized')).toBeNull();
  });

  it('triggers onClear and onTogglePause', () => {
    const onClear = vi.fn();
    const onTogglePause = vi.fn();

    render(
      <LogsPanel
        logs={sampleLogs}
        onClear={onClear}
        isPaused={false}
        onTogglePause={onTogglePause}
      />
    );

    const clearBtn = screen.getByTitle('Clear all logs');
    fireEvent.click(clearBtn);
    expect(onClear).toHaveBeenCalled();

    const pauseBtn = screen.getByTitle('Pause live logging');
    fireEvent.click(pauseBtn);
    expect(onTogglePause).toHaveBeenCalled();
  });
});

describe('PlaygroundErrorBoundary Isolation', () => {
  function CrashingComponent({ shouldCrash }: { shouldCrash: boolean }) {
    if (shouldCrash) {
      throw new Error('Simulated demo crash');
    }
    return <div>Normal Demo Output</div>;
  }

  it('catches demo errors safely without crashing the whole playground', () => {
    const originalConsoleError = console.error;
    console.error = vi.fn();

    const { rerender } = render(
      <PlaygroundErrorBoundary packageName="@pareeshy/crashing-demo">
        <CrashingComponent shouldCrash={false} />
      </PlaygroundErrorBoundary>
    );

    expect(screen.getByText('Normal Demo Output')).toBeTruthy();

    // Rerender with crash
    rerender(
      <PlaygroundErrorBoundary packageName="@pareeshy/crashing-demo">
        <CrashingComponent shouldCrash={true} />
      </PlaygroundErrorBoundary>
    );

    expect(screen.getByText(/Demo Error Isolated/i)).toBeTruthy();
    expect(screen.getByText(/Simulated demo crash/i)).toBeTruthy();
    expect(screen.getByText(/Reset & Reload Demo/i)).toBeTruthy();

    console.error = originalConsoleError;
  });
});

describe('AI Assistant Demo (Deterministic Local Mock)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('demonstrates prompt submission and simulated streaming', async () => {
    const logFn = vi.fn();

    render(<AiAssistantDemo log={logFn} resetKey={0} />);

    // Type input
    const input = screen.getByPlaceholderText(/Ask a question or test tool calling/i);
    fireEvent.change(input, { target: { value: 'Hello local AI' } });

    // Send button is now enabled
    const sendBtn = screen.getByText('Send Prompt');
    fireEvent.click(sendBtn);

    expect(logFn).toHaveBeenCalledWith(
      'info',
      expect.stringContaining('Hello local AI'),
      expect.anything()
    );

    // Advance streaming timer
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    vi.useRealTimers();
  });
});
