import React, { useState, useEffect } from 'react';
import { useElementSize } from '@pareeshy/use-element-size';
import { PlaygroundDemoProps } from '../types';

export function UseElementSizeDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [sliderWidth, setSliderWidth] = useState(320);
  const [sliderHeight, setSliderHeight] = useState(140);

  const [boxRef, size] = useElementSize<HTMLDivElement>();

  useEffect(() => {
    log('info', 'Initialized @pareeshy/use-element-size with ResizeObserver tracking');
  }, [resetKey]);

  useEffect(() => {
    if (size.width > 0) {
      log(
        'info',
        `ResizeObserver triggered: ${Math.round(size.width)}px × ${Math.round(size.height)}px`
      );
    }
  }, [Math.round(size.width), Math.round(size.height)]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Controls */}
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
            Width Control: {sliderWidth}px
          </label>
          <input
            type="range"
            min={180}
            max={650}
            value={sliderWidth}
            onChange={(e) => setSliderWidth(Number(e.target.value))}
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
            Height Control: {sliderHeight}px
          </label>
          <input
            type="range"
            min={80}
            max={280}
            value={sliderHeight}
            onChange={(e) => setSliderHeight(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Target Resizable Element */}
      <div style={{ overflowX: 'auto', padding: 8 }}>
        <div
          ref={boxRef}
          style={{
            width: `${sliderWidth}px`,
            height: `${sliderHeight}px`,
            maxWidth: '100%',
            backgroundColor: 'var(--stripe-bg-surface)',
            border: '2px dashed var(--primary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            boxShadow: 'var(--shadow-sm)',
            transition: 'width 0.1s ease, height 0.1s ease',
            resize: 'both',
            overflow: 'hidden'
          }}
        >
          <span style={{ fontSize: '1.4rem' }}>📐</span>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-head)' }}>
            {Math.round(size.width)}px × {Math.round(size.height)}px
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            (Drag corner to resize manually)
          </span>
        </div>
      </div>

      {/* Live Measurement Readout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 10
        }}
      >
        <div
          style={{
            padding: 10,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            border: '1px solid var(--stripe-border)'
          }}
        >
          <span
            style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}
          >
            Exact Width
          </span>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--primary)',
              marginTop: 2
            }}
          >
            {size.width.toFixed(2)} px
          </div>
        </div>
        <div
          style={{
            padding: 10,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            border: '1px solid var(--stripe-border)'
          }}
        >
          <span
            style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}
          >
            Exact Height
          </span>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--primary)',
              marginTop: 2
            }}
          >
            {size.height.toFixed(2)} px
          </div>
        </div>
        <div
          style={{
            padding: 10,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            border: '1px solid var(--stripe-border)'
          }}
        >
          <span
            style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}
          >
            Aspect Ratio
          </span>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--text-head)',
              marginTop: 2
            }}
          >
            {size.height > 0 ? (size.width / size.height).toFixed(2) : '1.00'}
          </div>
        </div>
      </div>
    </div>
  );
}
