import { vi } from 'vitest';

/**
 * Comprehensive Chrome API mocks for testing
 */
export const createChromeMock = () => {
  const storageData: Record<string, any> = {};
  
  const chromeMock = {
    storage: {
      sync: {
        get: vi.fn((keys: string | string[] | Record<string, any> | null, callback?: (result: Record<string, any>) => void) => {
          const result: Record<string, any> = {};
          
          if (keys === null) {
            // Get all
            Object.assign(result, storageData);
          } else if (typeof keys === 'string') {
            // Single key
            result[keys] = storageData[keys];
          } else if (Array.isArray(keys)) {
            // Array of keys
            keys.forEach(key => {
              result[key] = storageData[key];
            });
          } else if (typeof keys === 'object') {
            // Object with default values
            Object.keys(keys).forEach(key => {
              result[key] = storageData[key] !== undefined ? storageData[key] : keys[key];
            });
          }
          
          if (callback) {
            callback(result);
          }
          return Promise.resolve(result);
        }),
        set: vi.fn((items: Record<string, any>, callback?: () => void) => {
          Object.assign(storageData, items);
          if (callback) {
            callback();
          }
          return Promise.resolve();
        }),
        remove: vi.fn((keys: string | string[], callback?: () => void) => {
          const keysArray = Array.isArray(keys) ? keys : [keys];
          keysArray.forEach(key => {
            delete storageData[key];
          });
          if (callback) {
            callback();
          }
          return Promise.resolve();
        }),
        clear: vi.fn((callback?: () => void) => {
          Object.keys(storageData).forEach(key => {
            delete storageData[key];
          });
          if (callback) {
            callback();
          }
          return Promise.resolve();
        }),
      },
    },
    runtime: {
      lastError: undefined as chrome.runtime.LastError | undefined,
      onInstalled: {
        addListener: vi.fn(),
        removeListener: vi.fn(),
        hasListener: vi.fn(),
      },
      onStartup: {
        addListener: vi.fn(),
        removeListener: vi.fn(),
        hasListener: vi.fn(),
      },
    },
  };

  return {
    chrome: chromeMock as any,
    storageData, // Expose for test inspection
    reset: () => {
      Object.keys(storageData).forEach(key => delete storageData[key]);
      chromeMock.storage.sync.get.mockClear();
      chromeMock.storage.sync.set.mockClear();
      chromeMock.storage.sync.remove.mockClear();
      chromeMock.storage.sync.clear.mockClear();
    },
  };
};

// Default export for use in setup
export default createChromeMock;

