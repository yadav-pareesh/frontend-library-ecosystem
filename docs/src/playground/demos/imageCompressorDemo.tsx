import React, { useState, useEffect } from 'react';
import { compressImage, OutputMimeType, CompressedImageResult } from '@pareeshy/image-compressor';
import { PlaygroundDemoProps } from '../types';

export function ImageCompressorDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [quality, setQuality] = useState(0.7);
  const [maxWidth, setMaxWidth] = useState(800);
  const [mimeType, setMimeType] = useState<OutputMimeType>('image/webp');
  const [result, setResult] = useState<CompressedImageResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setResult(null);
    setPreviewUrl(null);
    log('info', 'Initialized @pareeshy/image-compressor with WebP/JPEG/PNG canvas compression');
  }, [resetKey]);

  // Helper to create a sample canvas-generated image so user doesn't even need to upload one to test!
  const createSampleImage = (): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 1200, 800);
        grad.addColorStop(0, '#635bff');
        grad.addColorStop(1, '#00d4ff');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1200, 800);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px sans-serif';
        ctx.fillText('@pareeshy Image Compressor Demo', 100, 400);
      }
      canvas.toBlob((blob) => {
        resolve(new File([blob!], 'sample-gradient-1200x800.png', { type: 'image/png' }));
      }, 'image/png');
    });
  };

  const handleCompress = async (file: File) => {
    setLoading(true);
    log('info', `Compressing image "${file.name}" (${(file.size / 1024).toFixed(1)} KB)...`, {
      quality,
      maxWidth,
      mimeType
    });

    try {
      const compressed = await compressImage(file, { quality, maxWidth, mimeType });
      setResult(compressed);

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(compressed.blob);
      setPreviewUrl(url);

      const savedPercent = Math.round((1 - compressed.compressionRatio) * 100);
      log(
        'success',
        `Compressed successfully: ${(compressed.compressedSize / 1024).toFixed(1)} KB (Saved ${savedPercent}%)`,
        {
          dimensions: `${compressed.width}x${compressed.height}`
        }
      );
    } catch (err) {
      log('error', `Compression error: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
            Quality: {Math.round(quality * 100)}%
          </label>
          <input
            type="range"
            min={0.1}
            max={1.0}
            step={0.05}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
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
            Max Width: {maxWidth}px
          </label>
          <input
            type="range"
            min={300}
            max={1600}
            step={100}
            value={maxWidth}
            onChange={(e) => setMaxWidth(Number(e.target.value))}
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
            Output Format
          </label>
          <select
            value={mimeType}
            onChange={(e) => setMimeType(e.target.value as OutputMimeType)}
            style={{
              width: '100%',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)'
            }}
          >
            <option value="image/webp">WebP (Smallest file size)</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
          </select>
        </div>
      </div>

      {/* Upload or Generate Action */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={async () => {
            const sample = await createSampleImage();
            handleCompress(sample);
          }}
          disabled={loading}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Compressing...' : '⚡ Test with Synthetic 1200x800 Image'}
        </button>

        <label
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            color: 'var(--text-head)',
            border: '1px solid var(--stripe-border)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          📁 Upload Custom Photo
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files?.[0]) handleCompress(e.target.files[0]);
            }}
          />
        </label>
      </div>

      {/* Result Metrics */}
      {result && (
        <div
          style={{
            padding: 16,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            border: '1px solid var(--stripe-border)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 12
          }}
        >
          <div>
            <span
              style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}
            >
              Original Size
            </span>
            <div style={{ fontWeight: 700, color: 'var(--text-head)', marginTop: 2 }}>
              {(result.originalSize / 1024).toFixed(1)} KB
            </div>
          </div>

          <div>
            <span
              style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}
            >
              Compressed Size
            </span>
            <div style={{ fontWeight: 800, color: 'var(--success)', marginTop: 2 }}>
              {(result.compressedSize / 1024).toFixed(1)} KB
            </div>
          </div>

          <div>
            <span
              style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}
            >
              Bandwidth Saved
            </span>
            <div style={{ fontWeight: 800, color: 'var(--primary)', marginTop: 2 }}>
              {Math.round((1 - result.compressionRatio) * 100)}%
            </div>
          </div>

          <div>
            <span
              style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}
            >
              Resolution
            </span>
            <div style={{ fontWeight: 700, color: 'var(--text-head)', marginTop: 2 }}>
              {result.width} × {result.height} px
            </div>
          </div>
        </div>
      )}

      {/* Image Preview */}
      {previewUrl && (
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <img
            src={previewUrl}
            alt="Compressed result preview"
            style={{
              maxWidth: '100%',
              maxHeight: 220,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--stripe-border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
        </div>
      )}
    </div>
  );
}
