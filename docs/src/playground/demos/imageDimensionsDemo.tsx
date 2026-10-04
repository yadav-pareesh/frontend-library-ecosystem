import React, { useState, useEffect } from 'react';
import { getImageDimensions, ImageDimensions } from '@pareeshy/image-dimensions';
import { PlaygroundDemoProps } from '../types';

export function ImageDimensionsDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80'
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    log('info', 'Initialized @pareeshy/image-dimensions');
    inspectUrl(imageUrl);
  }, [resetKey]);

  const inspectUrl = async (url: string) => {
    setLoading(true);
    log('info', `Extracting image dimensions from URL: ${url.slice(0, 50)}...`);
    try {
      const dims = await getImageDimensions(url);
      setDimensions(dims);
      log(
        'success',
        `Extracted dimensions: ${dims.width} × ${dims.height} (${dims.orientation})`,
        dims
      );
    } catch (err) {
      log('error', `Failed to load image dimensions: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Input */}
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
          Image URL or Upload Local Image
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)',
              fontSize: '0.85rem'
            }}
          />
          <button
            onClick={() => inspectUrl(imageUrl)}
            disabled={loading}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
          Test Presets:
        </span>
        <button
          onClick={() => {
            const url = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800';
            setImageUrl(url);
            inspectUrl(url);
          }}
          style={{
            padding: '3px 8px',
            borderRadius: 4,
            fontSize: '0.72rem',
            border: '1px solid var(--stripe-border)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            cursor: 'pointer'
          }}
        >
          Landscape Photo
        </button>
        <button
          onClick={() => {
            const url = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';
            setImageUrl(url);
            inspectUrl(url);
          }}
          style={{
            padding: '3px 8px',
            borderRadius: 4,
            fontSize: '0.72rem',
            border: '1px solid var(--stripe-border)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            cursor: 'pointer'
          }}
        >
          Portrait Photo
        </button>
      </div>

      {/* Metrics Card */}
      {dimensions && (
        <div
          style={{
            padding: 16,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            border: '1px solid var(--stripe-border)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 12
          }}
        >
          <div>
            <span
              style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}
            >
              Width
            </span>
            <div
              style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--text-head)',
                marginTop: 2
              }}
            >
              {dimensions.width} px
            </div>
          </div>

          <div>
            <span
              style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}
            >
              Height
            </span>
            <div
              style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--text-head)',
                marginTop: 2
              }}
            >
              {dimensions.height} px
            </div>
          </div>

          <div>
            <span
              style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}
            >
              Aspect Ratio
            </span>
            <div
              style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginTop: 2 }}
            >
              {dimensions.aspectRatio.toFixed(2)}
            </div>
          </div>

          <div>
            <span
              style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}
            >
              Orientation
            </span>
            <div
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-head)',
                marginTop: 2,
                textTransform: 'capitalize'
              }}
            >
              {dimensions.orientation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
