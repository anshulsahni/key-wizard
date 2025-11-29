import type { Settings } from './types';
import { DEFAULT_BINDINGS, STORAGE_KEYS } from './constants';

/**
 * Get default settings
 */
export function getDefaultSettings(): Settings {
  return {
    bindings: DEFAULT_BINDINGS,
    enabled: true,
  };
}

/**
 * Load settings from Chrome storage, merging with defaults
 */
export async function getSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(STORAGE_KEYS.SETTINGS, (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error loading settings:', chrome.runtime.lastError);
        resolve(getDefaultSettings());
        return;
      }

      const stored = result[STORAGE_KEYS.SETTINGS] as Settings | undefined;
      
      if (stored) {
        // Merge with defaults to ensure all bindings are present
        const defaultSettings = getDefaultSettings();
        resolve({
          ...defaultSettings,
          ...stored,
          bindings: stored.bindings || defaultSettings.bindings,
        });
      } else {
        resolve(getDefaultSettings());
      }
    });
  });
}

/**
 * Save settings to Chrome storage
 */
export async function saveSettings(settings: Settings): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(
      { [STORAGE_KEYS.SETTINGS]: settings },
      () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      }
    );
  });
}

