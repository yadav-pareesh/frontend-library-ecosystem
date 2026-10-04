import React, { useState, useEffect } from 'react';
import { usePermission, StandardPermissionName } from '@pareeshy/use-permission';
import { PlaygroundDemoProps } from '../types';

export function UsePermissionDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [selectedPermission, setSelectedPermission] =
    useState<StandardPermissionName>('notifications');

  const { state, isSupported, isLoading } = usePermission(selectedPermission);

  useEffect(() => {
    log(
      'info',
      `Queried permission for "${selectedPermission}": state=${state}, isSupported=${isSupported}`
    );
  }, [selectedPermission, state, isSupported, resetKey]);

  const getStateBadge = (permState: string) => {
    switch (permState) {
      case 'granted':
        return { color: 'var(--success)', bg: 'var(--success-bg)', text: '✓ GRANTED' };
      case 'denied':
        return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: '✗ DENIED' };
      case 'prompt':
        return { color: 'var(--primary)', bg: 'var(--primary-light)', text: '❓ PROMPT' };
      case 'unsupported':
      default:
        return { color: 'var(--text-muted)', bg: 'var(--stripe-bg-subtle)', text: 'UNSUPPORTED' };
    }
  };

  const badge = getStateBadge(state);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Selector */}
      <div>
        <label
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-head)',
            display: 'block',
            marginBottom: 6
          }}
        >
          Select Browser Permission to Query:
        </label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(
            [
              'notifications',
              'geolocation',
              'camera',
              'microphone',
              'clipboard-read',
              'clipboard-write'
            ] as StandardPermissionName[]
          ).map((perm) => (
            <button
              key={perm}
              onClick={() => setSelectedPermission(perm)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor:
                  selectedPermission === perm ? 'var(--primary)' : 'var(--stripe-bg-subtle)',
                color: selectedPermission === perm ? '#fff' : 'var(--text-head)',
                border: '1px solid var(--stripe-border)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              {perm}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--stripe-bg-subtle)',
          border: '1px solid var(--stripe-border)'
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Permission Status
          </span>
          <div
            style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-head)', marginTop: 4 }}
          >
            navigator.permissions.query({`{ name: "${selectedPermission}" }`})
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            API Supported: {isSupported ? 'Yes' : 'No'} {isLoading ? '(Querying...)' : ''}
          </span>
        </div>

        <div
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: badge.bg,
            color: badge.color,
            fontWeight: 800,
            fontSize: '0.9rem',
            border: `1px solid ${badge.color}`
          }}
        >
          {badge.text}
        </div>
      </div>
    </div>
  );
}
