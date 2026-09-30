# @pareeshy/react-confirm-action

Accessible, headless promise-based confirmation dialog workflow for React with keyboard traps, focus restoration, and zero UI library lock-in.

## Installation

```bash
npm install @pareeshy/react-confirm-action
# or
pnpm add @pareeshy/react-confirm-action
```

## Quick Start

```tsx
import React from 'react';
import { ConfirmProvider, useConfirmAction } from '@pareeshy/react-confirm-action';

function DeleteButton() {
  const confirm = useConfirmAction();

  const handleDelete = async () => {
    const shouldDelete = await confirm({
      title: 'Permanently delete item?',
      message: 'This operation cannot be undone. All child records will be removed.',
      confirmText: 'Delete Now',
      destructive: true
    });

    if (shouldDelete) {
      await api.delete();
    }
  };

  return <button onClick={handleDelete}>Delete File</button>;
}

export function App() {
  return (
    <ConfirmProvider>
      <DeleteButton />
    </ConfirmProvider>
  );
}
```

## API

### `<ConfirmProvider customDialog?>`
Wraps application tree to render confirm dialog overlay.

### `useConfirmAction(): (options: ConfirmDialogOptions) => Promise<boolean>`

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | `undefined` | Dialog heading |
| `message` | `ReactNode` | **required** | Body explanation text |
| `confirmText` | `string` | `'Confirm'` | Confirm button label |
| `cancelText` | `string` | `'Cancel'` | Cancel button label |
| `destructive` | `boolean` | `false` | Highlights button with danger theme |

## License

MIT
