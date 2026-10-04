import React, { useState, useEffect } from 'react';
import { useFileDropzone, FileRejection } from '@pareeshy/react-file-dropzone-lite';
import { PlaygroundDemoProps } from '../types';

export function ReactFileDropzoneLiteDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [accepted, setAccepted] = useState<File[]>([]);
  const [rejections, setRejections] = useState<FileRejection[]>([]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useFileDropzone({
    accept: 'image/*,application/pdf',
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 3,
    onDrop: (acc, rej) => {
      setAccepted(acc);
      setRejections(rej);
      if (acc.length > 0) {
        log('success', `Dropzone accepted ${acc.length} file(s)`, {
          files: acc.map((f) => f.name)
        });
      }
      if (rej.length > 0) {
        log('error', `Dropzone rejected ${rej.length} file(s)`, {
          rejections: rej.map((r) => `${r.file.name}: ${r.reason}`)
        });
      }
    }
  });

  useEffect(() => {
    setAccepted([]);
    setRejections([]);
    log('info', 'Initialized @pareeshy/react-file-dropzone-lite with 5MB limit');
  }, [resetKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Drop Area */}
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${
            isDragReject ? '#ef4444' : isDragActive ? 'var(--primary)' : 'var(--stripe-border)'
          }`,
          borderRadius: 'var(--radius-lg)',
          padding: '36px 20px',
          textAlign: 'center',
          backgroundColor: isDragActive ? 'var(--primary-light)' : 'var(--stripe-bg-surface)',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
      >
        <input {...getInputProps()} />
        <span style={{ fontSize: '2.4rem', display: 'block', marginBottom: 8 }}>
          {isDragActive ? '📥' : '📂'}
        </span>
        <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-head)' }}>
          {isDragActive ? 'Drop files here!' : 'Drag & drop files here, or click to browse'}
        </h4>
        <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Accepts: Images (PNG, JPEG, WebP) and PDF up to 5 MB (Max 3 files)
        </p>
      </div>

      {/* Results */}
      {(accepted.length > 0 || rejections.length > 0) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 12
          }}
        >
          {accepted.length > 0 && (
            <div
              style={{
                padding: 12,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--success-bg)',
                border: '1px solid var(--success-border)'
              }}
            >
              <strong style={{ fontSize: '0.82rem', color: 'var(--success)' }}>
                ✓ Accepted Files ({accepted.length}):
              </strong>
              <ul
                style={{
                  paddingLeft: 16,
                  marginTop: 6,
                  fontSize: '0.8rem',
                  color: 'var(--text-head)'
                }}
              >
                {accepted.map((f, i) => (
                  <li key={i}>
                    {f.name} ({(f.size / 1024).toFixed(1)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}

          {rejections.length > 0 && (
            <div
              style={{
                padding: 12,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              <strong style={{ fontSize: '0.82rem', color: '#ef4444' }}>
                ✗ Rejected Files ({rejections.length}):
              </strong>
              <ul style={{ paddingLeft: 16, marginTop: 6, fontSize: '0.8rem', color: '#ef4444' }}>
                {rejections.map((r, i) => (
                  <li key={i}>
                    {r.file.name}: {r.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
