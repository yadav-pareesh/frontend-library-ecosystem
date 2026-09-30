import React, { useState } from 'react';
import { useWebWorker } from '@pareeshy/use-web-worker';

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

export function WebWorkerPlayground() {
  const [num, setNum] = useState<number>(38);
  const { post, data, loading, error } = useWebWorker<number, number>(fibonacci);

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>Web Worker Playground</h2>
      <p>Compute heavy recursive Fibonacci on a background worker without freezing the UI.</p>
      <input
        type="number"
        value={num}
        onChange={(e) => setNum(Number(e.target.value))}
        style={{ padding: 6, marginRight: 8 }}
      />
      <button onClick={() => post(num)} disabled={loading}>
        {loading ? 'Calculating...' : 'Compute in Worker'}
      </button>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
      {data !== null && <p>Result: <strong>{data}</strong></p>}
    </div>
  );
}
