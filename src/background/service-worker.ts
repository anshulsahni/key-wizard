import { getDefaultSettings, saveSettings } from '../shared/storage';
import { STORAGE_KEYS } from '../shared/constants';

/**
 * Initialize default settings on extension install
 */
async function initializeSettings(): Promise<void> {
  try {
    // Check if settings already exist
    const result = await chrome.storage.sync.get(STORAGE_KEYS.SETTINGS);
    
    // If no settings exist, initialize with defaults
    if (!result[STORAGE_KEYS.SETTINGS]) {
      const defaultSettings = getDefaultSettings();
      await saveSettings(defaultSettings);
      console.log('Key Wizard: Default settings initialized');
    }
  } catch (error) {
    console.error('Key Wizard: Error initializing settings:', error);
  }
}

/**
 * Handle extension installation
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // First time installation
    await initializeSettings();
    console.log('Key Wizard: Extension installed');
  } else if (details.reason === 'update') {
    // Extension updated
    await initializeSettings();
    console.log('Key Wizard: Extension updated');
  }
});

/**
 * Handle extension startup
 */
chrome.runtime.onStartup.addListener(async () => {
  await initializeSettings();
  console.log('Key Wizard: Extension started');
});

// Log service worker activation
console.log('Key Wizard: Service worker activated');

