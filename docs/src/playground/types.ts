import React from 'react';

export type LogLevel = 'info' | 'success' | 'warning' | 'error';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

export type LogFunction = (level: LogLevel, message: string, data?: unknown) => void;

export interface PlaygroundDemoProps {
  log: LogFunction;
  resetKey: number;
}

export interface PlaygroundDemo {
  packageName: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  component: React.ComponentType<PlaygroundDemoProps>;
  codeSnippet: string;
}
