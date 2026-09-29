import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../src';

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Explosion!');
  }
  return <div>Safe Component</div>;
}

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Content')).toBeDefined();
  });

  it('renders fallback and triggers reset', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender } = render(
      <ErrorBoundary
        fallback={({ error, resetErrorBoundary }) => (
          <div>
            <p>Caught: {error.message}</p>
            <button onClick={resetErrorBoundary}>Reset</button>
          </div>
        )}
      >
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Caught: Explosion!')).toBeDefined();

    // Rerender with clean component before clicking reset
    rerender(
      <ErrorBoundary
        fallback={({ error, resetErrorBoundary }) => (
          <div>
            <p>Caught: {error.message}</p>
            <button onClick={resetErrorBoundary}>Reset</button>
          </div>
        )}
      >
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /reset/i }));
    expect(screen.getByText('Safe Component')).toBeDefined();

    spy.mockRestore();
  });
});
