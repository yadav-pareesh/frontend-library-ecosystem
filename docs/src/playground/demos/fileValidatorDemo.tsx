import React, { useState, useEffect } from 'react';
import { validateFiles } from '@pareeshy/file-validator';
import { PlaygroundDemoProps } from '../types';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function FileValidatorDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [maxSizeMb, setMaxSizeMb] = useState(2);
  const [allowedTypes, setAllowedTypes] = useState<string[]>([
    'image/png',
    'image/jpeg',
    'application/pdf'
  ]);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    errors: string[];
    fileNames: string[];
  } | null>(null);

  useEffect(() => {
    setValidationResult(null);
    log('info', 'Initialized @pareeshy/file-validator with MIME & size checks');
  }, [resetKey]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    log('info', `Validating ${files.length} selected files...`);

    const result = await validateFiles(files, {
      maxSize: maxSizeMb * 1024 * 1024,
      allowedMimeTypes: allowedTypes,
      checkMagicBytes: true
    });

    const errorMsgs = result.errors.map((err) => err.message);
    const names = Array.from(files).map((f) => `${f.name} (${formatBytes(f.size)})`);

    setValidationResult({
      valid: result.valid,
      errors: errorMsgs,
      fileNames: names
    });

    if (result.valid) {
      log('success', `All ${files.length} files passed validation checks!`, { files: names });
    } else {
      log('error', `File validation failed with ${result.errors.length} error(s)`, {
        errors: errorMsgs
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Policy Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12
        }}
      >
        <div>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-head)',
              display: 'block',
              marginBottom: 4
            }}
          >
            Max Size Limit: {maxSizeMb} MB
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={maxSizeMb}
            onChange={(e) => setMaxSizeMb(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-head)',
              display: 'block',
              marginBottom: 4
            }}
          >
            Allowed MIME Types
          </label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['image/png', 'image/jpeg', 'application/pdf', 'text/plain'].map((type) => {
              const isChecked = allowedTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => {
                    setAllowedTypes((prev) =>
                      isChecked ? prev.filter((t) => t !== type) : [...prev, type]
                    );
                  }}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    border: '1px solid var(--stripe-border)',
                    backgroundColor: isChecked ? 'var(--primary)' : 'var(--stripe-bg-subtle)',
                    color: isChecked ? '#fff' : 'var(--text-head)',
                    cursor: 'pointer'
                  }}
                >
                  {type.split('/')[1]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* File Upload Trigger */}
      <div
        style={{
          border: '2px dashed var(--stripe-border)',
          borderRadius: 'var(--radius-md)',
          padding: 24,
          textAlign: 'center',
          backgroundColor: 'var(--stripe-bg-surface)'
        }}
      >
        <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: 6 }}>📁</span>
        <label
          style={{
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.85rem',
            display: 'inline-block'
          }}
        >
          Select Files to Validate
          <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
        </label>
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'block',
            marginTop: 8
          }}
        >
          Tests MIME types, magic bytes header, and size constraints synchronously.
        </span>
      </div>

      {/* Validation Result Box */}
      {validationResult && (
        <div
          style={{
            padding: 16,
            borderRadius: 'var(--radius-md)',
            backgroundColor: validationResult.valid
              ? 'var(--success-bg)'
              : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${validationResult.valid ? 'var(--success-border)' : 'rgba(239, 68, 68, 0.3)'}`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: '1.1rem' }}>{validationResult.valid ? '✓' : '⚠️'}</span>
            <strong
              style={{
                color: validationResult.valid ? 'var(--success)' : '#ef4444',
                fontSize: '0.9rem'
              }}
            >
              {validationResult.valid ? 'VALIDATION PASSED' : 'VALIDATION REJECTED'}
            </strong>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-body)' }}>
            <strong>Files checked:</strong> {validationResult.fileNames.join(', ')}
          </div>

          {!validationResult.valid && (
            <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#ef4444' }}>
              <strong>Rejection Reasons:</strong>
              <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                {validationResult.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
