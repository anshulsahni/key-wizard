import { Navigator } from './navigator';
import { getSettings } from '../shared/storage';
import type { KeyBinding } from '../shared/types';
import './styles.css';

let navigator: Navigator | null = null;
let settingsLoaded = false;

/**
 * Check if user is currently typing in an input field
 */
function isInputFocused(): boolean {
  const activeElement = document.activeElement;
  if (!activeElement) {
    return false;
  }

  const tagName = activeElement.tagName.toLowerCase();
  const isInput = tagName === 'input' || tagName === 'textarea';
  const isContentEditable = activeElement.hasAttribute('contenteditable');

  return isInput || isContentEditable;
}

/**
 * Check if a key matches a binding for a specific action
 */
function matchesBinding(
  key: string,
  bindings: KeyBinding[],
  action: 'next' | 'previous' | 'activate'
): boolean {
  const binding = bindings.find((b) => b.action === action);
  if (!binding) {
    return false;
  }

  return binding.keys.includes(key);
}

/**
 * Handle keyboard events
 */
function handleKeyDown(event: KeyboardEvent): void {
  // Skip if settings aren't loaded yet
  if (!settingsLoaded || !navigator) {
    return;
  }

  // Skip if user is typing in an input field
  if (isInputFocused()) {
    return;
  }

  const key = event.key;

  const currentSettings = navigator.getSettings();

  // Check each action and handle accordingly
  if (matchesBinding(key, currentSettings.bindings, 'next')) {
    event.preventDefault();
    event.stopPropagation();
    navigator.next();
  } else if (matchesBinding(key, currentSettings.bindings, 'previous')) {
    event.preventDefault();
    event.stopPropagation();
    navigator.previous();
  } else if (matchesBinding(key, currentSettings.bindings, 'activate')) {
    event.preventDefault();
    event.stopPropagation();
    navigator.activate();
  }
}

/**
 * Initialize the extension
 */
async function init(): Promise<void> {
  try {
    console.log('Key Wizard: Initializing...');
    const settings = await getSettings();

    if (!settings.enabled) {
      console.log('Key Wizard: Extension is disabled');
      return;
    }

    // Create navigator instance
    navigator = new Navigator(settings);

    // Initial scan for results
    const results = navigator.scanResults();
    console.log(`Key Wizard: Found ${results.length} search results`);

    if (results.length === 0) {
      console.warn('Key Wizard: No search results found. Make sure you are on a Google search results page.');
    }

    // Attach keyboard event listener
    document.addEventListener('keydown', handleKeyDown, true);
    console.log('Key Wizard: Keyboard listener attached');

    // Re-scan results when DOM changes (for infinite scroll, etc.)
    const observer = new MutationObserver(() => {
      if (navigator) {
        const newResults = navigator.scanResults();
        if (newResults.length > 0 && newResults.length !== results.length) {
          console.log(`Key Wizard: Results updated, now ${newResults.length} results`);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    settingsLoaded = true;
    console.log('Key Wizard: Initialization complete. Press j/k to navigate, Enter to activate.');
  } catch (error) {
    console.error('Error initializing Key Wizard:', error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

