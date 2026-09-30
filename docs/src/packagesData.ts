export interface PackageInfo {
  name: string;
  category:
    | 'React Hooks'
    | 'Browser APIs'
    | 'State Management'
    | 'Performance'
    | 'Search & Data'
    | 'Files & Images'
    | 'UI Utilities'
    | 'Developer Experience';
  purpose: string;
  description: string;
  whenToUse: string[];
  framework: string;
  browserOnly: boolean;
  bundleSize: string;
  dependencies: string;
  status: 'Stable';
  exampleSnippet: string;
  apiSummary: string;
}

export const PACKAGES_DATA: PackageInfo[] = [
  {
    name: '@pareeshy/use-debounced-value',
    category: 'React Hooks',
    purpose: 'Delays updating a value or calling a function until the user stops typing or interacting.',
    description:
      'When users type into a search bar, you do not want to trigger an API request on every single keystroke (which could fire 20 requests in 2 seconds!). Debouncing waits until the user pauses typing for a specified time (e.g. 300ms) before updating the value or making the call.',
    whenToUse: [
      'Search inputs to avoid spamming the backend API on every keystroke',
      'Auto-saving drafts as the user writes notes or documents',
      'Window resize or scroll listeners to prevent browser sluggishness'
    ],
    framework: 'React >=18',
    browserOnly: false,
    bundleSize: '1.2 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React, { useState, useEffect } from 'react';
import { useDebouncedValue } from '@pareeshy/use-debounced-value';

export function SearchBox() {
  const [text, setText] = useState('');
  
  // Updates 'debouncedText' 300ms AFTER the user stops typing
  const [debouncedText, { isPending, flush, cancel }] = useDebouncedValue(text, 300);

  useEffect(() => {
    if (debouncedText) {
      console.log('Fetching results from server for:', debouncedText);
    }
  }, [debouncedText]);

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type to search..."
      />
      {isPending() && <span>Typing...</span>}
      <button onClick={flush}>Search Immediately</button>
      <button onClick={cancel}>Cancel</button>
    </div>
  );
}`,
    apiSummary: 'useDebouncedValue(val, delay, { leading?, trailing?, maxWait? }), useDebouncedCallback(fn, delay, opts)'
  },
  {
    name: '@pareeshy/use-local-storage-state',
    category: 'State Management',
    purpose: 'Stores state in the browser\'s localStorage so data persists across reloads and syncs across tabs.',
    description:
      'Works just like React\'s standard useState, but automatically saves your state to browser localStorage. If the user refreshes the page or reopens the browser days later, their saved settings remain intact. It also synchronizes automatically across multiple open tabs.',
    whenToUse: [
      'Remembering user preferences like Dark Mode or Selected Language',
      'Saving shopping cart items before checkout',
      'Dismissing banners or modals with a "Don\'t show again" checkbox'
    ],
    framework: 'React >=18',
    browserOnly: false,
    bundleSize: '1.4 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { useLocalStorageState } from '@pareeshy/use-local-storage-state';

export function ThemeSwitcher() {
  // Saved in localStorage under the key 'app_theme', defaults to 'light'
  const [theme, setTheme, { remove }] = useLocalStorageState('app_theme', 'light');

  return (
    <div>
      <p>Current theme: <strong>{theme}</strong> (saved across page reloads)</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
      <button onClick={remove}>Reset to Default</button>
    </div>
  );
}`,
    apiSummary: 'useLocalStorageState<T>(key, defaultVal, { serializer?, syncTabs?, onError? })'
  },
  {
    name: '@pareeshy/use-session-storage-state',
    category: 'State Management',
    purpose: 'Stores state for the current tab that clears automatically when the tab is closed.',
    description:
      'Similar to localStorage, but the data only survives while the user keeps the current browser tab open. Perfect for temporary multi-step data or sensitive inputs that you don\'t want permanently stored on the user\'s computer.',
    whenToUse: [
      'Multi-step registration or checkout wizard progress',
      'Temporary page filters within a single browsing session',
      'One-time session flags that should reset once the tab is closed'
    ],
    framework: 'React >=18',
    browserOnly: false,
    bundleSize: '1.3 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { useSessionStorageState } from '@pareeshy/use-session-storage-state';

export function CheckoutWizard() {
  // Survives page refresh, but resets when tab closes
  const [step, setStep] = useSessionStorageState('checkout_step', 1);

  return (
    <div>
      <h3>Step {step} of 3</h3>
      <button disabled={step <= 1} onClick={() => setStep(step - 1)}>Back</button>
      <button disabled={step >= 3} onClick={() => setStep(step + 1)}>Next</button>
    </div>
  );
}`,
    apiSummary: 'useSessionStorageState<T>(key, defaultVal, { serializer?, onError? })'
  },
  {
    name: '@pareeshy/use-network-status',
    category: 'Browser APIs',
    purpose: 'Detects whether the user is online or offline, and monitors connection speed (4G, 3G, WiFi).',
    description:
      'Listens to the browser\'s internet connection in real-time. If the user loses Wi-Fi or enters an elevator, your app is immediately notified, allowing you to show an offline banner or prevent failed submissions.',
    whenToUse: [
      'Displaying a friendly "You are offline" banner at the top of your app',
      'Disabling payment or submission buttons when there is no internet connection',
      'Lowering video or image quality automatically on slow 2G/3G networks'
    ],
    framework: 'React >=18',
    browserOnly: true,
    bundleSize: '0.9 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { useNetworkStatus } from '@pareeshy/use-network-status';

export function NetworkBanner() {
  const { online, effectiveType, downlink } = useNetworkStatus();

  if (!online) {
    return (
      <div style={{ background: '#ef4444', color: '#fff', padding: 8 }}>
        ⚠️ You are currently offline. Changes will sync once reconnected.
      </div>
    );
  }

  return (
    <div>
      Connected: {effectiveType.toUpperCase()} (~{downlink} Mbps)
    </div>
  );
}`,
    apiSummary: 'useNetworkStatus(): { online: boolean, effectiveType: string, downlink: number, rtt: number }'
  },
  {
    name: '@pareeshy/use-online-queue',
    category: 'Performance',
    purpose: 'Queues actions while offline and automatically executes them with retries when back online.',
    description:
      'An offline-first action queue. When a user clicks "Like", "Send message", or "Submit" while in an offline area, this hook holds those actions safely in storage and automatically syncs them as soon as internet connection is restored.',
    whenToUse: [
      'Chat applications where messages sent offline should auto-deliver when reconnected',
      'Note-taking or todo apps that must work seamlessly without internet',
      'Submitting feedback or analytics without losing data on spotty mobile connections'
    ],
    framework: 'React >=18',
    browserOnly: true,
    bundleSize: '1.8 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { useOnlineQueue } from '@pareeshy/use-online-queue';

export function NoteCreator() {
  const { enqueue, items, isProcessing } = useOnlineQueue<{ id: string; text: string }>({
    storageKey: 'pending_notes',
    onProcess: async (note) => {
      // Syncs to backend server when online
      await fetch('/api/notes', { method: 'POST', body: JSON.stringify(note) });
    }
  });

  return (
    <div>
      <button onClick={() => enqueue({ id: Date.now().toString(), text: 'New Note' })}>
        Create Note
      </button>
      <p>Pending offline items: {items.length} {isProcessing && '(Syncing now...)'}</p>
    </div>
  );
}`,
    apiSummary: 'useOnlineQueue<T>({ onProcess, maxRetries?, retryDelayMs?, storageKey? })'
  },
  {
    name: '@pareeshy/use-idle-detection',
    category: 'Browser APIs',
    purpose: 'Detects when the user is inactive (no mouse, typing, or touch) for a configured duration.',
    description:
      'Monitors user interaction across mouse movements, keyboard presses, touchscreen taps, and tab visibility. If no activity is detected after a specified time (e.g. 5 minutes), you can trigger automatic logout or pause background animations.',
    whenToUse: [
      'Auto-logging out users from secure banking or healthcare dashboards',
      'Pausing autoplaying videos or background audio when the user walks away',
      'Showing an "Are you still there?" confirmation prompt before session timeout'
    ],
    framework: 'React >=18',
    browserOnly: true,
    bundleSize: '1.3 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { useIdleDetection } from '@pareeshy/use-idle-detection';

export function SecurityGuard() {
  const { isIdle, reset } = useIdleDetection({
    timeout: 60000 * 5, // 5 minutes of inactivity
    onIdle: () => console.log('User has been idle for 5 minutes!')
  });

  if (isIdle) {
    return (
      <div className="modal">
        <p>You have been inactive. Click below to continue your session.</p>
        <button onClick={reset}>Keep Me Logged In</button>
      </div>
    );
  }

  return <p>Session active. Watching for user inactivity.</p>;
}`,
    apiSummary: 'useIdleDetection({ timeout, onIdle?, onActive?, events?, idleOnVisibilityHidden? })'
  },
  {
    name: '@pareeshy/use-page-visibility',
    category: 'Browser APIs',
    purpose: 'Detects if the user is actively viewing your tab or has switched to another tab or window.',
    description:
      'Hooks into the browser\'s Page Visibility API. When a user switches to another browser tab or minimizes the window, your app knows instantly. You can pause heavy network polling or media to save the user\'s battery and data.',
    whenToUse: [
      'Pausing real-time WebSocket polling or live timers when the tab is hidden',
      'Pausing video or audio playback when the user switches tabs',
      'Updating the browser title (e.g. "Come back! 👋") when the user leaves'
    ],
    framework: 'React >=18',
    browserOnly: false,
    bundleSize: '0.6 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { usePageVisibility } from '@pareeshy/use-page-visibility';

export function VideoPlayer() {
  const isVisible = usePageVisibility((visible) => {
    console.log(visible ? 'Tab is focused!' : 'User switched tabs or minimized window');
  });

  return (
    <div>
      <p>Tab status: <strong>{isVisible ? 'Active' : 'Hidden in background'}</strong></p>
      {!isVisible && <small>Background polling paused to conserve laptop battery.</small>}
    </div>
  );
}`,
    apiSummary: 'usePageVisibility(onChange?), useDocumentVisibility(onChange?)'
  },
  {
    name: '@pareeshy/use-copy-to-clipboard',
    category: 'Browser APIs',
    purpose: 'Copies text to the clipboard with one function call and provides a temporary "Copied!" confirmation.',
    description:
      'Copies text using the modern Clipboard API with fallback support for older browsers. It gives you a `copied` boolean that stays `true` for 2 seconds (customizable), making it effortless to build "Copy Code" or "Copy Link" buttons.',
    whenToUse: [
      '"Copy to Clipboard" buttons next to code snippets or API keys',
      'One-click "Copy Share Link" buttons for referrals or articles',
      'Copying discount codes or wallet addresses'
    ],
    framework: 'React >=18',
    browserOnly: true,
    bundleSize: '1.1 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { useCopyToClipboard } from '@pareeshy/use-copy-to-clipboard';

export function PromoCode() {
  const { copy, copied } = useCopyToClipboard({ resetTimeout: 2000 });
  const coupon = 'SUMMER2026';

  return (
    <div>
      <code>{coupon}</code>
      <button onClick={() => copy(coupon)}>
        {copied ? '✓ Copied!' : 'Copy Code'}
      </button>
    </div>
  );
}`,
    apiSummary: 'useCopyToClipboard({ resetTimeout? }): { copy, copied, error, reset }'
  },
  {
    name: '@pareeshy/use-media-query',
    category: 'React Hooks',
    purpose: 'Checks CSS media queries (like mobile vs desktop or dark mode) directly in React components.',
    description:
      'Allows you to conditionally render different JSX depending on screen size or user system preferences, without layout flickering or SSR hydration mismatch warnings.',
    whenToUse: [
      'Rendering a mobile bottom bar vs a desktop sidebar navigation',
      'Showing fewer items per row on smaller screens',
      'Detecting user system preferences like (prefers-color-scheme: dark)'
    ],
    framework: 'React >=18',
    browserOnly: false,
    bundleSize: '0.8 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { useMediaQuery } from '@pareeshy/use-media-query';

export function Navigation() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <nav>
      {isMobile ? (
        <button>🍔 Mobile Menu</button>
      ) : (
        <ul><li>Home</li><li>Features</li><li>Pricing</li></ul>
      )}
    </nav>
  );
}`,
    apiSummary: 'useMediaQuery(query, { defaultValue? }), useMediaQueries(queryMap)'
  },
  {
    name: '@pareeshy/use-element-size',
    category: 'UI Utilities',
    purpose: 'Measures the exact pixel width and height of any HTML element in real time using ResizeObserver.',
    description:
      'Attaches an efficient ResizeObserver to any DOM element and returns its exact width and height. When the window or parent container resizes, the dimensions update automatically without causing slow layout thrashing.',
    whenToUse: [
      'Responsive canvas, chart, and SVG visualizations that require exact pixel dimensions',
      'Container queries (changing component layout based on its own width rather than screen width)',
      'Positioning dynamic popovers, tooltips, or dropdown menus'
    ],
    framework: 'React >=18',
    browserOnly: true,
    bundleSize: '1.2 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { useElementSize } from '@pareeshy/use-element-size';

export function ChartContainer() {
  const [ref, { width, height }] = useElementSize();

  return (
    <div ref={ref} style={{ width: '100%', height: 300, border: '1px solid #ccc' }}>
      <p>Element size: {Math.round(width)}px wide × {Math.round(height)}px high</p>
      {/* Pass width/height directly to Chart or SVG */}
    </div>
  );
}`,
    apiSummary: 'useElementSize<E extends HTMLElement>({ box?, initialSize? }): [ref, { width, height }]'
  },
  {
    name: '@pareeshy/use-optimistic-action',
    category: 'State Management',
    purpose: 'Updates the UI instantly before the server responds, and automatically rolls back if the API fails.',
    description:
      'When users click "Like" or "Bookmark" on modern apps like Twitter, the icon fills immediately without waiting for server latency. If the network request fails, the state automatically rolls back and lets the user retry. This hook manages that entire workflow.',
    whenToUse: [
      '"Like", "Upvote", or "Bookmark" buttons in social feeds',
      '"Mark as Done" checkboxes in todo or task managers',
      'Adding or removing items from a cart with immediate UI response'
    ],
    framework: 'React >=18',
    browserOnly: false,
    bundleSize: '1.4 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { useOptimisticAction } from '@pareeshy/use-optimistic-action';

export function LikeButton({ initialLikes }: { initialLikes: number }) {
  const { state: likes, execute, isPending, retry } = useOptimisticAction(
    initialLikes,
    async () => {
      // Real network call
      await fetch('/api/likes', { method: 'POST' });
    },
    {
      // Instantly increment in UI before server responds
      update: (current) => current + 1
    }
  );

  return (
    <button onClick={() => execute()}>
      ❤️ {likes} {isPending && '(saving...)'}
    </button>
  );
}`,
    apiSummary: 'useOptimisticAction(initialState, actionFn, { update, rollback?, onSuccess?, onError? })'
  },
  {
    name: '@pareeshy/use-persisted-state',
    category: 'State Management',
    purpose: 'Advanced storage hook with automatic expiration (TTL) and schema version migrations.',
    description:
      'More powerful than standard storage hooks. It allows you to set an expiration time (e.g. data expires after 1 hour), and schema version numbers so that when you update your data format in a new app release, old cached user data is migrated automatically without crashes.',
    whenToUse: [
      'Caching API response data with a 1-hour expiration time (TTL)',
      'Preserving form drafts that should expire after 24 hours',
      'Migrating user stored settings when your app structure changes across versions'
    ],
    framework: 'React >=18',
    browserOnly: false,
    bundleSize: '1.6 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { usePersistedState } from '@pareeshy/use-persisted-state';

export function UserDashboard() {
  const [profile, setProfile] = usePersistedState('user_profile', { name: 'Guest' }, {
    ttlMs: 1000 * 60 * 60, // Data expires after 1 hour
    version: 2,            // Schema version
    migrate: (oldData, oldVersion) => ({ ...oldData, upgraded: true })
  });

  return <div>Welcome back, {profile.name}!</div>;
}`,
    apiSummary: 'usePersistedState<T>(key, defaultVal, { storage?, ttlMs?, version?, migrate? })'
  },
  {
    name: '@pareeshy/use-infinite-scroll',
    category: 'Performance',
    purpose: 'Automatically loads more items as the user scrolls toward the bottom of the page.',
    description:
      'Uses the modern browser IntersectionObserver to trigger a `loadMore` function right before the user reaches the end of a list. Provides smooth infinite scrolling with zero scroll jitter and no manual scroll event listeners.',
    whenToUse: [
      'Infinite social media feeds (photos, comments, or posts)',
      'E-commerce product catalog search results',
      'Long activity logs or notification lists'
    ],
    framework: 'React >=18',
    browserOnly: true,
    bundleSize: '1.1 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { useInfiniteScroll } from '@pareeshy/use-infinite-scroll';

export function ProductFeed({ items, fetchNextPage, hasMore, isLoading }) {
  const sentinelRef = useInfiniteScroll({
    loadMore: fetchNextPage,
    hasMore,
    loading: isLoading,
    rootMargin: '200px' // Pre-fetch 200px before reaching bottom
  });

  return (
    <div>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
      {/* Invisible anchor element at the bottom */}
      <div ref={sentinelRef}>
        {isLoading ? 'Loading more...' : hasMore ? 'Scroll for more' : 'All caught up!'}
      </div>
    </div>
  );
}`,
    apiSummary: 'useInfiniteScroll({ loadMore, hasMore, loading, root?, rootMargin?, threshold? })'
  },
  {
    name: '@pareeshy/use-previous-value',
    category: 'React Hooks',
    purpose: 'Remembers what a prop or state variable was on the previous render.',
    description:
      'React only provides the current state. When you need to compare what a value was *before* it changed (e.g. did a stock price go up or down? did count increase?), this simple hook gives you the previous value.',
    whenToUse: [
      'Highlighting if a stock or crypto price went UP (green) or DOWN (red)',
      'Detecting when a user status transitions from "offline" to "online"',
      'Triggering animations or sounds only when a specific value changes'
    ],
    framework: 'React >=18',
    browserOnly: false,
    bundleSize: '0.4 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { usePreviousValue } from '@pareeshy/use-previous-value';

export function StockTicker({ price }: { price: number }) {
  const prevPrice = usePreviousValue(price);
  const trend = price > (prevPrice ?? price) ? '📈 UP' : '📉 DOWN';

  return (
    <div>
      <h2>\${price}</h2>
      {prevPrice !== undefined && (
        <small>Was: \${prevPrice} ({trend})</small>
      )}
    </div>
  );
}`,
    apiSummary: 'usePreviousValue<T>(value, initialValue?, { isEqual? })'
  },
  {
    name: '@pareeshy/use-value-history',
    category: 'React Hooks',
    purpose: 'Maintains a chronological history log of the last N values of any state or prop.',
    description:
      'Automatically tracks recent values up to a maximum limit (e.g. last 10 items). Allows you to inspect trends over time, visualize recent transitions, or inspect earlier states.',
    whenToUse: [
      'Drawing mini sparkline charts (e.g. CPU temperature or price trends)',
      'Showing a "Recently selected colors" palette in an image editor',
      'Tracking recent inputs in form debuggers'
    ],
    framework: 'React >=18',
    browserOnly: false,
    bundleSize: '0.9 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React, { useState } from 'react';
import { useValueHistory } from '@pareeshy/use-value-history';

export function ScoreTracker() {
  const [score, setScore] = useState(10);
  const { current, history, clear } = useValueHistory(score, { maxSize: 5 });

  return (
    <div>
      <p>Current Score: {current}</p>
      <button onClick={() => setScore(s => s + 5)}>Add Points</button>
      <p>Score history: {history.join(' → ')}</p>
    </div>
  );
}`,
    apiSummary: 'useValueHistory<T>(val, { maxSize?, isEqual? }): { current, previous, history, clear }'
  },
  {
    name: '@pareeshy/use-permission',
    category: 'Browser APIs',
    purpose: 'Checks and monitors browser permission states (camera, mic, location, notifications).',
    description:
      'Interfaces cleanly with the browser\'s Permissions API. It tells you whether a permission is granted, denied, or in prompt mode, so you can display helpful user instructions instead of letting actions fail silently.',
    whenToUse: [
      'Showing an "Enable Microphone" banner before joining a video call',
      'Checking if Web Push notifications are allowed or blocked in settings',
      'Displaying location-based features only when Geolocation permission is granted'
    ],
    framework: 'React >=18',
    browserOnly: true,
    bundleSize: '1.0 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { usePermission } from '@pareeshy/use-permission';

export function LocationWidget() {
  const { state, isSupported } = usePermission('geolocation');

  if (!isSupported) return <p>Geolocation is not supported by your browser.</p>;
  if (state === 'denied') return <p>⚠️ Location access was blocked in browser settings.</p>;
  if (state === 'granted') return <p>✅ Location permission is active!</p>;

  return (
    <button onClick={() => navigator.geolocation.getCurrentPosition(() => {})}>
      📍 Allow Location Access
    </button>
  );
}`,
    apiSummary: 'usePermission(permissionName): { state: PermissionState, isSupported: boolean, isLoading: boolean }'
  },
  {
    name: '@pareeshy/use-web-worker',
    category: 'Performance',
    purpose: 'Runs heavy computations in a background Web Worker thread without freezing the React UI.',
    description:
      'JavaScript runs on a single thread, so heavy computations (like sorting 100,000 items or calculating hashes) will freeze the browser and make buttons unresponsive. This hook offloads that work to a separate Web Worker thread effortlessly.',
    whenToUse: [
      'Parsing large CSV, JSON, or Excel files without freezing the user\'s screen',
      'Running image manipulation, cryptography, or hashing in the background',
      'Sorting and filtering massive datasets with thousands of rows'
    ],
    framework: 'React >=18',
    browserOnly: true,
    bundleSize: '1.5 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { useWebWorker } from '@pareeshy/use-web-worker';

export function PrimeCalculator() {
  // Offloads calculation into a separate background thread!
  const { post, data, loading } = useWebWorker<number, number>((num) => {
    let count = 0;
    for (let i = 2; i < num * 50000; i++) count += i;
    return count;
  });

  return (
    <div>
      <button disabled={loading} onClick={() => post(20)}>
        {loading ? 'Calculating in background...' : 'Run Heavy Calculation'}
      </button>
      {data !== null && <p>Worker Output: {data}</p>}
    </div>
  );
}`,
    apiSummary: 'useWebWorker<TIn, TOut>(workerOrFn): { post, data, error, loading, terminate }'
  },
  {
    name: '@pareeshy/use-undo-redo',
    category: 'State Management',
    purpose: 'Adds full Undo (Ctrl+Z) and Redo (Ctrl+Y) functionality to any state with history limits.',
    description:
      'Maintains a history timeline for your state. Whenever state updates, earlier snapshots are saved on an undo stack. It provides `undo()`, `redo()`, `canUndo`, and `canRedo` ready to connect to toolbar buttons.',
    whenToUse: [
      'Text editors, markdown previewers, or canvas drawing tools',
      'Complex forms with "Revert change" features',
      'Customizable dashboard widget layouts'
    ],
    framework: 'React >=18',
    browserOnly: false,
    bundleSize: '1.3 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { useUndoRedo } from '@pareeshy/use-undo-redo';

export function NoteEditor() {
  const [text, setText, { undo, redo, canUndo, canRedo }] = useUndoRedo('Initial note');

  return (
    <div>
      <button disabled={!canUndo} onClick={undo}>↩ Undo</button>
      <button disabled={!canRedo} onClick={redo}>↪ Redo</button>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
      />
    </div>
  );
}`,
    apiSummary: 'useUndoRedo<T>(initial, { maxHistory? }): [state, setState, { undo, redo, canUndo, canRedo, clear }]'
  },
  {
    name: '@pareeshy/auto-ellipsis',
    category: 'UI Utilities',
    purpose: 'Truncates multi-line text cleanly (e.g. 3 lines) with an accessible "Read more / Read less" toggle.',
    description:
      'Standard CSS line-clamp often cuts words awkwardly or lacks dynamic measurement. This component measures text in real-time, displays an ellipsis only when text actually overflows, and provides a smooth expandable toggle.',
    whenToUse: [
      'Product descriptions and review cards that shouldn\'t occupy too much vertical space',
      'Blog post cards or news feed summary snippets',
      'User comments with an expandable "Read more" toggle'
    ],
    framework: 'React >=18',
    browserOnly: true,
    bundleSize: '1.7 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { AutoEllipsis } from '@pareeshy/auto-ellipsis';

export function ProductReview({ reviewText }: { reviewText: string }) {
  return (
    <div style={{ maxWidth: 400, border: '1px solid #e2e8f0', padding: 16 }}>
      <h4>Customer Review</h4>
      {/* Clamps to 3 lines and renders a "Read more" button only if text overflows */}
      <AutoEllipsis text={reviewText} lines={3} expandable />
    </div>
  );
}`,
    apiSummary: '<AutoEllipsis text lines expandable? onToggle? />, useAutoEllipsis({ lines })'
  },
  {
    name: '@pareeshy/smart-search',
    category: 'Search & Data',
    purpose: 'Fuzzy search with typo tolerance, highlighted matching letters, and keyboard navigation.',
    description:
      'Enables lightning-fast in-memory client-side search across product catalogs, users, or articles. Even if a user makes a typo (e.g. "hedphones" instead of "headphones"), fuzzy matching finds the item, highlights the matching characters, and supports Up/Down arrow keys.',
    whenToUse: [
      'Command palettes and modal search menus (Cmd+K)',
      'Product and user search dropdowns with live match highlighting',
      'Searchable select inputs with keyboard arrow navigation'
    ],
    framework: 'Framework Agnostic / React',
    browserOnly: false,
    bundleSize: '1.8 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { useSmartSearch, highlightMatches } from '@pareeshy/smart-search';

export function ItemSearch({ items }) {
  const { query, setQuery, results, selectedIndex, onKeyDown } = useSmartSearch({
    items,
    keys: ['name', 'category'],
    debounceMs: 150
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search items (typo-tolerant)..."
      />
      <ul>
        {results.map(({ item }, i) => (
          <li key={item.id} style={{ background: i === selectedIndex ? '#e0f2fe' : 'transparent' }}>
            {highlightMatches(item.name, query).map((part, idx) => (
              <span key={idx} style={{ backgroundColor: part.isMatch ? '#fef08a' : 'transparent' }}>
                {part.text}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    apiSummary: 'useSmartSearch({ items, keys, debounceMs? }), fuzzyMatch(target, query), highlightMatches(text, query)'
  },
  {
    name: '@pareeshy/file-validator',
    category: 'Files & Images',
    purpose: 'Validates files client-side before upload (size limits, real MIME types via magic bytes, dimensions).',
    description:
      'Never let users wait for a huge file upload only for the server to reject it! This checks file size, inspects the true file type using "magic byte signatures" (preventing users from renaming an .exe to .png), and verifies image dimensions before uploading.',
    whenToUse: [
      'Avatar uploads (must be under 2MB and at least 300x300 pixels)',
      'Document portals allowing only real PDF or Word files',
      'Preventing corrupted, disguised, or oversized files from wasting server bandwidth'
    ],
    framework: 'Framework Agnostic',
    browserOnly: true,
    bundleSize: '2.2 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { validateFiles } from '@pareeshy/file-validator';

export function FileUploader() {
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const { valid, rejected } = await validateFiles(files, {
      maxSize: 5 * 1024 * 1024, // 5MB limit
      allowedMimeTypes: ['image/jpeg', 'image/png']
    });

    if (rejected.length > 0) {
      alert(\`File rejected: \${rejected[0].reason}\`);
    } else {
      console.log('Ready to upload:', valid);
    }
  };

  return <input type="file" multiple onChange={onFileChange} />;
}`,
    apiSummary: 'validateFiles(files, { maxSize?, allowedMimeTypes?, minWidth?, maxWidth? })'
  },
  {
    name: '@pareeshy/image-compressor',
    category: 'Files & Images',
    purpose: 'Shrinks image file sizes in the browser using HTML5 Canvas before uploading to your server.',
    description:
      'Modern smartphones take 10MB to 20MB photos. Uploading these wastes user mobile data and server storage. This utility resizes and compresses JPEG, PNG, or WebP images client-side in milliseconds, often reducing a 10MB image down to 400KB with virtually no visible loss in quality.',
    whenToUse: [
      'Compressing photos taken on mobile cameras before sending to cloud storage',
      'Avatar and profile photo uploads',
      'Saving server bandwidth and speeding up upload times on slow connections'
    ],
    framework: 'Framework Agnostic',
    browserOnly: true,
    bundleSize: '1.9 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { compressImage } from '@pareeshy/image-compressor';

export function AvatarUploader() {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const original = e.target.files?.[0];
    if (!original) return;

    // Resizes to max 1920px width/height and 80% quality
    const { file: compressed, compressionRatio } = await compressImage(original, {
      maxWidth: 1920,
      quality: 0.8,
      mimeType: 'image/webp'
    });

    console.log(\`Original: \${(original.size / 1024).toFixed(0)} KB\`);
    console.log(\`Compressed: \${(compressed.size / 1024).toFixed(0)} KB (\${compressionRatio}% smaller)\`);
  };

  return <input type="file" accept="image/*" onChange={handleUpload} />;
}`,
    apiSummary: 'compressImage(source, { quality?, maxWidth?, maxHeight?, mimeType? })'
  },
  {
    name: '@pareeshy/image-dimensions',
    category: 'Files & Images',
    purpose: 'Extracts image width, height, aspect ratio, and orientation before uploading.',
    description:
      'Quickly inspects an image file or URL without displaying it on screen. Gives you exact pixel dimensions and orientation (portrait, landscape, or square).',
    whenToUse: [
      'Validating header banners (e.g. "Header image must be 16:9 ratio")',
      'Enforcing minimum resolution requirements (e.g. "At least 800x600 pixels")',
      'Setting image placeholder dimensions to prevent layout shifts (Cumulative Layout Shift)'
    ],
    framework: 'Framework Agnostic',
    browserOnly: true,
    bundleSize: '0.8 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { getImageDimensions } from '@pareeshy/image-dimensions';

export function ImageInspector() {
  const checkDimensions = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { width, height, aspectRatio, orientation } = await getImageDimensions(file);
    console.log(\`\${width}x\${height} (\${orientation}, ratio: \${aspectRatio.toFixed(2)})\`);

    if (width < 1200) {
      alert('Image must be at least 1200px wide for banners!');
    }
  };

  return <input type="file" accept="image/*" onChange={checkDimensions} />;
}`,
    apiSummary: 'getImageDimensions(source: File | Blob | string): Promise<{ width, height, aspectRatio, orientation }>'
  },
  {
    name: '@pareeshy/browser-storage',
    category: 'State Management',
    purpose: 'One unified, simple API to read/write from localStorage, sessionStorage, memory, or IndexedDB.',
    description:
      'Different browser storage mechanisms have inconsistent APIs (some synchronous, IndexedDB is event-based and complex). This library gives you one clean `get()`, `set()`, and `remove()` interface that works across any storage backend you choose.',
    whenToUse: [
      'Storing large datasets (>5MB) in IndexedDB with an easy key-value interface',
      'Switching between localStorage and in-memory storage during automated testing',
      'Building offline storage adapters for client-side caching'
    ],
    framework: 'Framework Agnostic',
    browserOnly: true,
    bundleSize: '2.1 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import { createBrowserStorage } from '@pareeshy/browser-storage';

// Works with 'local', 'session', 'memory', or 'indexeddb'
const db = createBrowserStorage('indexeddb', { dbName: 'app_data' });

async function saveProjects() {
  await db.set('projects', [{ id: '1', title: 'Library Ecosystem' }]);
  const data = await db.get('projects');
  console.log('Stored projects:', data);
}`,
    apiSummary: 'createBrowserStorage(type: "local" | "session" | "memory" | "indexeddb", options?)'
  },
  {
    name: '@pareeshy/safe-json',
    category: 'Developer Experience',
    purpose: 'Safely parse and stringify JSON without ever throwing crash errors or choking on circular references.',
    description:
      'Standard `JSON.parse()` crashes your entire app with an unhandled exception if given invalid or corrupted JSON. `safeParse` guarantees your app never crashes, returning a fallback default value and a clear `{ success, data }` result instead.',
    whenToUse: [
      'Parsing untrusted data stored in localStorage or received from third-party APIs',
      'Replacing repetitive try/catch blocks across your codebase',
      'Stringifying complex objects that may contain circular references (e.g. DOM nodes or event objects)'
    ],
    framework: 'Framework Agnostic',
    browserOnly: false,
    bundleSize: '0.7 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import { safeParse, safeStringifyCircular } from '@pareeshy/safe-json';

// 1. Parsing untrusted data with guaranteed fallback:
const badData = '{ corrupted json string...';
const { success, data } = safeParse(badData, { theme: 'dark' });
// App never crashes! If invalid, data is { theme: 'dark' } and success is false.

// 2. Stringifying complex or circular objects safely:
const obj: any = { name: 'App' };
obj.self = obj; // Circular reference!
const jsonString = safeStringifyCircular(obj);`,
    apiSummary: 'safeParse<T>(raw, fallback), safeParseValue<T>(raw, fallback), safeStringifyCircular(obj)'
  },
  {
    name: '@pareeshy/url-state',
    category: 'State Management',
    purpose: 'Syncs React state with URL search parameters (?page=2&tab=settings) so pages are shareable.',
    description:
      'When users filter a table or change pages, they expect copying and sharing the URL link to take a teammate to the exact same view. This hook synchronizes state directly with the browser\'s URL query string while handling types (numbers, booleans, arrays) automatically.',
    whenToUse: [
      'Pagination and sort orders (?page=2&sort=asc)',
      'Search filters and category checkboxes on e-commerce listings',
      'Shareable active tab selection in dashboards'
    ],
    framework: 'React >=18',
    browserOnly: false,
    bundleSize: '1.5 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { useUrlState } from '@pareeshy/url-state';

export function ProductCatalog() {
  // Automatically synchronizes with '?page=1' in the browser address bar
  const [page, setPage] = useUrlState('page', 1);

  return (
    <div>
      <p>Current page in URL: <strong>{page}</strong></p>
      <button onClick={() => setPage(page - 1)} disabled={page <= 1}>Previous</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}`,
    apiSummary: 'useUrlState<T>(key, defaultVal, { historyMode?: "push" | "replace", serialize?, deserialize? })'
  },
  {
    name: '@pareeshy/form-dirty-state',
    category: 'UI Utilities',
    purpose: 'Tracks whether form fields were modified by the user, and warns before leaving with unsaved changes.',
    description:
      'Performs deep comparison between your form\'s current values and original values. It tells you if the form is "dirty" (edited), lists exactly which fields were changed, and can trigger the browser\'s "Leave site? Unsaved changes will be lost" confirmation prompt.',
    whenToUse: [
      'Disabling the "Save Changes" button until the user has actually modified something',
      'Warning the user if they try to close the tab or navigate away with unsaved work',
      'Showing a visual indicator dot next to inputs that were edited'
    ],
    framework: 'React >=18',
    browserOnly: false,
    bundleSize: '1.2 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React, { useState } from 'react';
import { useFormDirtyState } from '@pareeshy/form-dirty-state';

export function EditProfile({ user }) {
  const [form, setForm] = useState(user);

  const { isDirty, dirtyFields, resetBaseline } = useFormDirtyState(form, user, {
    warnOnBeforeUnload: true // Warns user if they try to close the tab!
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); resetBaseline(form); }}>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      {dirtyFields.includes('name') && <span>(Edited)</span>}
      <button disabled={!isDirty}>Save Changes</button>
    </form>
  );
}`,
    apiSummary: 'useFormDirtyState<T>(current, baseline, { isEqual?, warnOnBeforeUnload? })'
  },
  {
    name: '@pareeshy/scroll-lock',
    category: 'UI Utilities',
    purpose: 'Locks body scrolling when a modal is open, preventing page scroll without layout shifting.',
    description:
      'When you open a popup modal, scrolling your mouse wheel often scrolls the background page underneath it. Simple CSS `overflow: hidden` causes an ugly layout jump when the browser scrollbar disappears. This hook locks scrolling cleanly and compensates for scrollbar width.',
    whenToUse: [
      'Modal dialogs and popups',
      'Mobile slide-out navigation drawers',
      'Fullscreen image preview lightboxes'
    ],
    framework: 'Framework Agnostic / React',
    browserOnly: true,
    bundleSize: '1.0 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React, { useState } from 'react';
import { useScrollLock } from '@pareeshy/scroll-lock';

export function Modal() {
  const [open, setOpen] = useState(false);

  // Prevents the background page from scrolling while modal is open
  useScrollLock(open);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)' }}>
          <div style={{ background: '#fff', color: '#000', margin: '100px auto', padding: 24, maxWidth: 400 }}>
            <h3>Modal Dialog</h3>
            <p>Background page scrolling is completely locked!</p>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}`,
    apiSummary: 'useScrollLock(locked: boolean, target?), lockScroll(target?), unlockScroll(target?), isScrollLocked()'
  },
  {
    name: '@pareeshy/react-confirm-action',
    category: 'UI Utilities',
    purpose: 'Replaces ugly browser window.confirm() with beautiful, promise-based confirmation dialogs.',
    description:
      'Traditional `window.confirm("Are you sure?")` freezes the browser and looks outdated. This library lets you trigger accessible, customizable confirmation dialogs with `const ok = await confirm(...)` right inside your event handlers.',
    whenToUse: [
      '"Are you sure you want to delete this account/item?" confirmation prompts',
      'Irreversible actions like "Discard unsaved draft"',
      'Bulk action approvals ("Delete 15 selected files?")'
    ],
    framework: 'React >=18',
    browserOnly: false,
    bundleSize: '1.6 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { ConfirmProvider, useConfirmAction } from '@pareeshy/react-confirm-action';

export function DeleteButton() {
  const confirm = useConfirmAction();

  const handleDelete = async () => {
    // Awaits the user's decision in a clean custom dialog!
    const confirmed = await confirm({
      title: 'Delete Project?',
      message: 'This action cannot be undone. Are you sure you want to proceed?'
    });

    if (confirmed) {
      console.log('User clicked Confirm! Deleting...');
    }
  };

  return <button onClick={handleDelete}>🗑️ Delete Project</button>;
}`,
    apiSummary: '<ConfirmProvider customDialog?>, useConfirmAction(): (options: ConfirmOptions) => Promise<boolean>'
  },
  {
    name: '@pareeshy/react-shortcuts',
    category: 'Developer Experience',
    purpose: 'Easy keyboard shortcut manager (Ctrl+S, Cmd+K, Escape) with Mac/Windows key normalization.',
    description:
      'Easily register hotkeys across your app. It automatically normalizes `mod+s` so it means `Cmd+S` on Mac and `Ctrl+S` on Windows, and safely ignores shortcuts when the user is typing inside an `<input>` or `<textarea>`.',
    whenToUse: [
      'Ctrl+S / Cmd+S to save the active document',
      'Cmd+K or / to open a global search bar or command palette',
      'Escape key to close open modals, popups, or tooltips'
    ],
    framework: 'React >=18',
    browserOnly: true,
    bundleSize: '1.4 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { useShortcut } from '@pareeshy/react-shortcuts';

export function DocumentEditor() {
  // 'mod' automatically adapts to 'Cmd' on Mac and 'Ctrl' on Windows!
  useShortcut('mod+s', (e) => {
    e.preventDefault();
    console.log('Saved document!');
  });

  useShortcut('escape', () => {
    console.log('Escape key pressed: closing panel');
  });

  return <div>Press <strong>Ctrl+S</strong> (or <strong>Cmd+S</strong>) to save!</div>;
}`,
    apiSummary: 'useShortcut(combo: string, handler: (e) => void, { enabled?, preventDefault?, ignoreInputs? })'
  },
  {
    name: '@pareeshy/react-error-boundary-lite',
    category: 'Developer Experience',
    purpose: 'Catches runtime JavaScript errors in components and displays a fallback UI instead of a blank white page.',
    description:
      'When an unhandled runtime error happens in React, the entire screen can crash to a blank white page. An Error Boundary catches the crash, renders a friendly "Something went wrong" card with a "Try Again" button, and logs the error to your analytics.',
    whenToUse: [
      'Wrapping widget cards or third-party embeds so a single crash doesn\'t break the whole app',
      'Top-level application crash recovery with user-friendly retry buttons',
      'Reporting frontend errors to monitoring tools like Sentry'
    ],
    framework: 'React >=18',
    browserOnly: false,
    bundleSize: '1.1 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { ErrorBoundary } from '@pareeshy/react-error-boundary-lite';

export function App() {
  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }) => (
        <div style={{ padding: 24, border: '1px solid #ef4444', borderRadius: 8 }}>
          <h3>⚠️ Something went wrong</h3>
          <p>{error.message}</p>
          <button onClick={resetErrorBoundary}>Try Again</button>
        </div>
      )}
    >
      <MainDashboard />
    </ErrorBoundary>
  );
}`,
    apiSummary: '<ErrorBoundary fallback resetKeys? onError? onReset?>, useErrorHandler()'
  },
  {
    name: '@pareeshy/react-file-dropzone-lite',
    category: 'UI Utilities',
    purpose: 'Creates drag-and-drop file upload zones with visual hover feedback, file filters, and accessibility.',
    description:
      'Provides a headless hook to turn any container into a drag-and-drop file upload area. It manages dragging states (`isDragActive`), file extension filters, and keyboard Enter/Space triggers without imposing styling constraints.',
    whenToUse: [
      'Drag-and-drop photo, avatar, or receipt upload boxes',
      'Document submission areas restricting uploads to PDF or Word files',
      'Multi-file attachment pickers'
    ],
    framework: 'React >=18',
    browserOnly: true,
    bundleSize: '1.7 KB',
    dependencies: '0',
    status: 'Stable',
    exampleSnippet: `import React from 'react';
import { useFileDropzone } from '@pareeshy/react-file-dropzone-lite';

export function Dropzone() {
  const { getRootProps, getInputProps, isDragActive } = useFileDropzone({
    accept: 'image/*',
    onDrop: (accepted, rejected) => {
      console.log('Accepted files:', accepted);
    }
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: \`2px dashed \${isDragActive ? '#38bdf8' : '#64748b'}\`,
        padding: 40,
        textAlign: 'center',
        cursor: 'pointer'
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the image here!</p> : <p>Drag & drop photos here, or click to browse</p>}
    </div>
  );
}`,
    apiSummary: 'useFileDropzone({ onDrop, accept?, multiple?, minSize?, maxSize?, maxFiles? })'
  }
];
