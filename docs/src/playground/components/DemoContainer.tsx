import React, { useState } from 'react';
import { PlaygroundDemo, LogFunction } from '../types';
import { PlaygroundErrorBoundary } from './PlaygroundErrorBoundary';

interface DemoContainerProps {
  demo: PlaygroundDemo;
  log: LogFunction;
  resetKey: number;
  onReset: () => void;
  onNavigateToDocs: (pkgName: string) => void;
}

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export function DemoContainer({
  demo,
  log,
  resetKey,
  onReset,
  onNavigateToDocs
}: DemoContainerProps) {
  const [pkgManager, setPkgManager] = useState<PackageManager>('npm');
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const getInstallCommand = (pkg: string, pm: PackageManager) => {
    switch (pm) {
      case 'pnpm':
        return `pnpm add ${pkg}`;
      case 'yarn':
        return `yarn add ${pkg}`;
      case 'bun':
        return `bun add ${pkg}`;
      case 'npm':
      default:
        return `npm install ${pkg}`;
    }
  };

  const copyText = (text: string, type: 'install' | 'code') => {
    navigator.clipboard?.writeText(text);
    if (type === 'install') {
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const DemoComponent = demo.component;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 12,
          paddingBottom: 16,
          borderBottom: '1px solid var(--stripe-border)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '1.4rem' }}>{demo.icon}</span>
            <h2
              style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                color: 'var(--text-head)',
                margin: 0,
                letterSpacing: '-0.02em'
              }}
            >
              {demo.packageName}
            </h2>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--primary)',
                backgroundColor: 'var(--primary-light)',
                padding: '2px 8px',
                borderRadius: 4
              }}
            >
              {demo.category}
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: '0.9rem',
              color: 'var(--text-body)',
              lineHeight: 1.5,
              maxWidth: 640
            }}
          >
            {demo.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onNavigateToDocs(demo.packageName)}
            title="Read complete API reference & usage guide"
            style={{
              padding: '7px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg-subtle)',
              color: 'var(--text-head)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            📘 View Full Docs
          </button>

          <button
            onClick={onReset}
            title="Reset this demo to its initial state"
            style={{
              padding: '7px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg-subtle)',
              color: 'var(--text-head)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            🔄 Reset Demo
          </button>
        </div>
      </div>

      {/* Installation & Import Quick Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--code-bg)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--code-border)',
          padding: '8px 14px',
          flexWrap: 'wrap',
          gap: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['pnpm', 'npm', 'yarn', 'bun'] as PackageManager[]).map((pm) => (
              <button
                key={pm}
                onClick={() => setPkgManager(pm)}
                style={{
                  padding: '2px 6px',
                  borderRadius: 3,
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  border: 'none',
                  backgroundColor:
                    pkgManager === pm ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
                  color: pkgManager === pm ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {pm}
              </button>
            ))}
          </div>

          <code
            style={{
              color: 'var(--code-text)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem'
            }}
          >
            {getInstallCommand(demo.packageName, pkgManager)}
          </code>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => copyText(getInstallCommand(demo.packageName, pkgManager), 'install')}
            style={{
              padding: '3px 8px',
              fontSize: '0.72rem',
              borderRadius: 4,
              border: '1px solid var(--code-border)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--code-text)',
              cursor: 'pointer'
            }}
          >
            {copiedInstall ? '✓ Copied' : 'Copy'}
          </button>

          <button
            onClick={() => setShowCode((prev) => !prev)}
            style={{
              padding: '3px 8px',
              fontSize: '0.72rem',
              borderRadius: 4,
              border: '1px solid var(--code-border)',
              backgroundColor: showCode ? 'rgba(99, 91, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              color: showCode ? 'var(--primary)' : 'var(--code-text)',
              cursor: 'pointer'
            }}
          >
            {showCode ? 'Hide Code' : 'View Code'}
          </button>
        </div>
      </div>

      {/* Collapsible Usage Code Preview */}
      {showCode && (
        <div
          style={{
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--code-bg)',
            border: '1px solid var(--code-border)',
            padding: 14,
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--code-comment)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              // Example Usage Snippet
            </span>
            <button
              onClick={() => copyText(demo.codeSnippet, 'code')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {copiedCode ? '✓ Copied Snippet' : 'Copy Snippet'}
            </button>
          </div>
          <pre
            style={{
              margin: 0,
              color: 'var(--code-text)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.5
            }}
          >
            {demo.codeSnippet}
          </pre>
        </div>
      )}

      {/* Main Interactive Demo Box with Error Isolation */}
      <div
        style={{
          padding: 20,
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--stripe-bg-surface)',
          border: '1px solid var(--stripe-border)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <PlaygroundErrorBoundary
          key={`${demo.packageName}_${resetKey}`}
          packageName={demo.packageName}
          onReset={onReset}
          log={log}
        >
          <DemoComponent log={log} resetKey={resetKey} />
        </PlaygroundErrorBoundary>
      </div>
    </div>
  );
}
