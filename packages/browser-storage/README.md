# @pareesh/browser-storage

Unified browser storage abstraction for localStorage, sessionStorage, memory, and IndexedDB with typed schemas, custom serialization, and clean async API.

## Installation

```bash
npm install @pareesh/browser-storage
# or
pnpm add @pareesh/browser-storage
```

## Quick Start

```ts
import { createBrowserStorage } from '@pareesh/browser-storage';

interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
}

// Seamlessly switch between 'local', 'session', 'indexeddb', or 'memory'
const storage = createBrowserStorage<UserSettings>('indexeddb', {
  dbName: 'my-app-db',
  storeName: 'settings'
});

async function savePreferences() {
  await storage.set('prefs', { theme: 'dark', notifications: true });
  const prefs = await storage.get('prefs');
  console.log('Saved settings:', prefs);
}
```

## API

### `createBrowserStorage<T>(type, options?): StorageAdapter<T>`

* `type`: `'local' | 'session' | 'indexeddb' | 'memory'`
* Returns consistent async interface:
  * `get(key: string): Promise<T | null>`
  * `set(key: string, value: T): Promise<void>`
  * `remove(key: string): Promise<void>`
  * `clear(): Promise<void>`
  * `keys(): Promise<string[]>`

## License

MIT
