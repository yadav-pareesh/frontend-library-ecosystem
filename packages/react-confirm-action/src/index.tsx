import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export interface ConfirmDialogOptions {
  title?: React.ReactNode;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

export interface ConfirmRenderProps extends ConfirmDialogOptions {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

interface ConfirmContextValue {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export interface ConfirmProviderProps {
  children: React.ReactNode;
  customDialog?: (props: ConfirmRenderProps) => React.ReactNode;
}

export const ConfirmProvider: React.FC<ConfirmProviderProps> = ({
  children,
  customDialog
}) => {
  const [dialogState, setDialogState] = useState<ConfirmDialogOptions | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  const confirm = useCallback((options: ConfirmDialogOptions): Promise<boolean> => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setDialogState(options);
    });
  }, []);

  const handleClose = useCallback((result: boolean) => {
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
    setDialogState(null);
    if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
      previousFocusRef.current.focus();
    }
  }, []);

  const handleConfirm = useCallback(() => handleClose(true), [handleClose]);
  const handleCancel = useCallback(() => handleClose(false), [handleClose]);

  useEffect(() => {
    if (!dialogState) return;

    confirmBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dialogState, handleCancel]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialogState && (
        customDialog ? (
          customDialog({
            ...dialogState,
            isOpen: true,
            onConfirm: handleConfirm,
            onCancel: handleCancel
          })
        ) : (
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCancel();
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 8,
                padding: 24,
                maxWidth: 420,
                width: '90%',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }}
            >
              {dialogState.title && (
                <h3 id="confirm-dialog-title" style={{ margin: '0 0 12px 0', fontSize: '1.25rem' }}>
                  {dialogState.title}
                </h3>
              )}
              <div style={{ margin: '0 0 20px 0', color: '#4b5563', lineHeight: 1.5 }}>
                {dialogState.message}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {dialogState.cancelText || 'Cancel'}
                </button>
                <button
                  ref={confirmBtnRef}
                  type="button"
                  onClick={handleConfirm}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: 'none',
                    backgroundColor: dialogState.destructive ? '#ef4444' : '#2563eb',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {dialogState.confirmText || 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </ConfirmContext.Provider>
  );
};

export function useConfirmAction(): (options: ConfirmDialogOptions) => Promise<boolean> {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirmAction must be used within a ConfirmProvider.');
  }
  return ctx.confirm;
}
