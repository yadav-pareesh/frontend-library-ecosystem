import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AutoEllipsis, useAutoEllipsis } from '../src';

describe('AutoEllipsis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders text properly', () => {
    render(<AutoEllipsis text="Short text" />);
    expect(screen.getByText('Short text')).toBeDefined();
  });

  it('handles expandable toggle interaction', () => {
    // Mock scrollWidth > clientWidth
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      value: 500
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 200
    });

    render(<AutoEllipsis text="Very long truncated text" expandable lines={1} />);

    const button = screen.getByRole('button', { name: /read more/i });
    expect(button).toBeDefined();

    fireEvent.click(button);
    expect(screen.getByRole('button', { name: /show less/i })).toBeDefined();
  });
});
