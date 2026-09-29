import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ConfirmProvider, useConfirmAction } from '../src';

function TestConsumer() {
  const confirm = useConfirmAction();
  return (
    <button
      onClick={async () => {
        const ok = await confirm({
          title: 'Delete Item',
          message: 'Are you sure you want to delete this?'
        });
        document.body.setAttribute('data-result', String(ok));
      }}
    >
      Trigger Action
    </button>
  );
}

describe('react-confirm-action', () => {
  it('opens confirmation modal and resolves promise with true on confirm', async () => {
    render(
      <ConfirmProvider>
        <TestConsumer />
      </ConfirmProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /trigger action/i }));

    expect(screen.getByText('Delete Item')).toBeDefined();
    expect(screen.getByText('Are you sure you want to delete this?')).toBeDefined();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    });

    expect(document.body.getAttribute('data-result')).toBe('true');
  });

  it('resolves promise with false on cancel', async () => {
    render(
      <ConfirmProvider>
        <TestConsumer />
      </ConfirmProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /trigger action/i }));

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    });

    expect(document.body.getAttribute('data-result')).toBe('false');
  });
});
