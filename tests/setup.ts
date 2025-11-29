// Test setup file for Vitest
// Chrome API mocks will be imported here

import { vi } from 'vitest';

// Basic Chrome API mock structure
// Full mocks will be in tests/mocks/chrome.ts
global.chrome = {
  storage: {
    sync: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
    },
  },
} as any;

