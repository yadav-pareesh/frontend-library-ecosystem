# @pareeshy/form-dirty-state

High-performance dirty state detection hook for React forms with deep equality, reset control, and beforeunload prompt integration.

## Installation

```bash
npm install @pareeshy/form-dirty-state
# or
pnpm add @pareeshy/form-dirty-state
```

## Quick Start

```tsx
import React, { useState } from 'react';
import { useFormDirtyState } from '@pareeshy/form-dirty-state';

export function EditProfile({ initialUser }) {
  const [form, setForm] = useState(initialUser);
  const { isDirty, dirtyFields, resetBaseline } = useFormDirtyState(form, initialUser, {
    warnOnBeforeUnload: true
  });

  const handleSave = async () => {
    await saveUser(form);
    resetBaseline(); // Mark current state as clean baseline
  };

  return (
    <form>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      {isDirty && <p style={{ color: 'orange' }}>Unsaved changes in: {dirtyFields.join(', ')}</p>}
      <button onClick={handleSave} disabled={!isDirty}>Save Changes</button>
    </form>
  );
}
```

## API

### `useFormDirtyState<T>(currentValues, initialValues?, options?): FormDirtyStateReturn<T>`

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `isEqual` | `(a: T, b: T) => boolean` | deep equality | Comparator function |
| `warnOnBeforeUnload` | `boolean` | `false` | Warn user when closing tab if form is dirty |

## License

MIT
