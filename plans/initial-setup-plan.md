# Key Wizard - Chrome Extension for Keyboard Navigation

## Overview

A Chrome extension that enables keyboard-based navigation through Google search results. Users can navigate between results using configurable keys and activate links without using a mouse.

## Architecture

```
key-wizard/
├── manifest.json              # Manifest V3 config
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── src/
│   ├── content/
│   │   ├── index.ts           # Content script entry
│   │   ├── navigator.ts       # Navigation logic (testable)
│   │   └── styles.css         # Highlight styles
│   ├── background/
│   │   └── service-worker.ts  # Background script
│   └── shared/
│       ├── types.ts           # TypeScript interfaces
│       ├── constants.ts       # Default keys, selectors
│       └── storage.ts         # Chrome storage wrapper (for future use)
├── tests/
│   ├── mocks/
│   │   └── chrome.ts          # Chrome API mocks
│   ├── navigator.test.ts
│   └── storage.test.ts
└── public/
    └── icons/                 # 16, 48, 128px icons
```

## Core Components

### 1. Content Script (`src/content/`)

- Inject into Google search pages (`*://www.google.com/search*`)
- Listen for keyboard events
- Navigate through search results using `div[data-ved] h3` selectors
- Apply highlight styles to focused result
- Trigger navigation on activation key

### 2. Background Service Worker (`src/background/`)

- Initialize default settings on install
- Handle extension lifecycle events

### 3. Shared Utilities (`src/shared/`)

- `types.ts`: `KeyBindings`, `Settings` interfaces
- `constants.ts`: Default bindings (`j`/`k`/`Enter`), DOM selectors
- `storage.ts`: Typed wrappers for `chrome.storage.sync` (for future configuration)

---

## Code Structure and Business Logic

### Types (`src/shared/types.ts`)

```typescript
interface KeyBinding {
  action: 'next' | 'previous' | 'activate';
  keys: string[];  // e.g., ['j', 'ArrowDown']
}

interface Settings {
  bindings: KeyBinding[];
  enabled: boolean;
}

interface SearchResult {
  element: HTMLElement;
  link: HTMLAnchorElement;
  index: number;
}
```

### Navigator Class (`src/content/navigator.ts`)

The Navigator class encapsulates all navigation logic, making it testable independently of Chrome APIs.

```typescript
class Navigator {
  private results: SearchResult[] = [];
  private currentIndex: number = -1;
  private settings: Settings;

  constructor(settings: Settings) { }

  // DOM Operations
  scanResults(): SearchResult[]
  // Queries DOM for search results, caches them

  // Navigation
  next(): void
  // Increment index, wrap to 0 if at end, call highlight()

  previous(): void
  // Decrement index, wrap to end if at 0, call highlight()

  activate(): void
  // Trigger click on current result's link

  // Visual Feedback
  private highlight(index: number): void
  // Remove highlight from previous, add to current, scroll into view

  private clearHighlight(): void
  // Remove all highlight classes

  // State
  getCurrentIndex(): number
  getResultCount(): number
  reset(): void
}
```

### Key Handler (`src/content/index.ts`)

Entry point that wires Navigator to keyboard events.

```typescript
// Initialization flow:
// 1. Load settings from storage (or use defaults)
// 2. Create Navigator instance
// 3. Attach keydown listener to document
// 4. On keydown: check if key matches binding, call navigator method

function handleKeyDown(
  event: KeyboardEvent,
  navigator: Navigator,
  settings: Settings
): void {
  // Skip if user is typing in input/textarea
  if (isInputFocused()) return;

  const key = event.key;

  if (matchesBinding(key, settings.bindings, 'next')) {
    event.preventDefault();
    navigator.next();
  } else if (matchesBinding(key, settings.bindings, 'previous')) {
    event.preventDefault();
    navigator.previous();
  } else if (matchesBinding(key, settings.bindings, 'activate')) {
    event.preventDefault();
    navigator.activate();
  }
}

function matchesBinding(
  key: string,
  bindings: KeyBinding[],
  action: string
): boolean {
  // Find binding for action, check if key is in keys array
}

function isInputFocused(): boolean {
  // Check if activeElement is input, textarea, or contenteditable
}
```

### Storage Utilities (`src/shared/storage.ts`)

```typescript
async function getSettings(): Promise<Settings>
// Load from chrome.storage.sync, merge with defaults (or return defaults if not set)

async function saveSettings(settings: Settings): Promise<void>
// Persist to chrome.storage.sync (for future use)

function getDefaultSettings(): Settings
// Return default key bindings
```

### Constants (`src/shared/constants.ts`)

```typescript
const SELECTORS = {
  RESULT_CONTAINER: 'div.g',
  RESULT_LINK: 'div.g a h3',
  SEARCH_INPUT: 'input[name="q"]',
};

const DEFAULT_BINDINGS: KeyBinding[] = [
  { action: 'next', keys: ['j', 'ArrowDown'] },
  { action: 'previous', keys: ['k', 'ArrowUp'] },
  { action: 'activate', keys: ['Enter'] },
];

const CSS_CLASSES = {
  HIGHLIGHT: 'key-wizard-highlight',
};

const STORAGE_KEYS = {
  SETTINGS: 'key-wizard-settings',
};
```

### Highlight Styles (`src/content/styles.css`)

```css
.key-wizard-highlight {
  outline: 2px solid #4285f4 !important;
  outline-offset: 4px;
  border-radius: 4px;
  background-color: rgba(66, 133, 244, 0.08) !important;
}
```

---

## Data Flow

```
┌─────────────────┐     ┌──────────────┐     ┌────────────┐
│  Keyboard Event │────▶│  Key Handler │────▶│  Navigator │
└─────────────────┘     └──────────────┘     └────────────┘
                               │                    │
                               ▼                    ▼
                        ┌──────────────┐     ┌────────────┐
                        │   Settings   │     │    DOM     │
                        │  (Defaults)  │     │  (Results) │
                        └──────────────┘     └────────────┘
```

1. User presses key → `keydown` event fires
2. Key Handler checks if key matches any configured binding
3. If match found, calls appropriate Navigator method
4. Navigator updates internal state and manipulates DOM
5. Visual highlight applied to current result

---

## Key Files

| File | Purpose |

|------|---------|

| `manifest.json` | Manifest V3: permissions (`storage`), content scripts, service worker |

| `src/content/navigator.ts` | Core navigation class (pure logic, testable) |

| `src/shared/storage.ts` | `getSettings()`, `saveSettings()` functions |

| `tests/mocks/chrome.ts` | Mock `chrome.storage.sync` for Vitest |

## Testing Strategy

- **Vitest** with `happy-dom` for DOM environment
- Mock Chrome APIs in `tests/mocks/chrome.ts`
- Test navigation logic independently from Chrome APIs
- Test storage wrapper functions with mocked storage

## Default Key Bindings

| Action | Default Keys |

|--------|-------------|

| Next Result | `j`, `ArrowDown` |

| Previous Result | `k`, `ArrowUp` |

| Activate Link | `Enter` |

## Build Output

Vite builds to `dist/` with:

- `content.js` + `content.css`
- `service-worker.js`
- `manifest.json` (copied)