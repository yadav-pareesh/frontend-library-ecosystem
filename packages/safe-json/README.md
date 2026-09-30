# @pareeshy/safe-json

Safe JSON serialization and parsing utilities with circular reference resolution, typed fallback results, and detailed syntax errors.

## Installation

```bash
npm install @pareeshy/safe-json
# or
pnpm add @pareeshy/safe-json
```

## Quick Start

```ts
import { safeParse, safeParseValue, safeStringifyCircular } from '@pareeshy/safe-json';

// Type-safe parse without try/catch
const result = safeParse<{ id: number }>('{"id": 42}');
if (result.success) {
  console.log(result.data.id);
} else {
  console.error(result.error);
}

// Fallback shorthand
const config = safeParseValue(localStorage.getItem('config') || '', { theme: 'light' });

// Circular reference safe stringification
const node: any = { name: 'Parent' };
node.child = { parent: node };
const jsonString = safeStringifyCircular(node, 2);
```

## API

* `safeParse<T>(json: string, fallback?: T): SafeParseResult<T>`
* `safeParseValue<T>(json: string, fallback: T): T`
* `safeStringify(val, replacer?, space?): SafeStringifyResult`
* `safeStringifyCircular(val, space?): string`

## License

MIT
