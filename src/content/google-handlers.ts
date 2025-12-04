/**
 * Google Search Action Handlers
 *
 * Functions to handle Google Search keyboard shortcuts and navigation.
 */

import { Navigator } from './navigator';
import type { KeyBinding, Settings } from '../shared/types';

let navigator: Navigator | null = null;

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
 * Handle Google keyboard events
 */
export function handleGoogleKeyDown(event: KeyboardEvent): void {
  if (!navigator) {
    return;
  }

  const key = event.key;
  const currentSettings = navigator.getSettings();

  // Check each action and handle accordingly
  if (matchesBinding(key, currentSettings.bindings, "next")) {
    event.preventDefault();
    event.stopPropagation();
    navigator.next();
  } else if (matchesBinding(key, currentSettings.bindings, "previous")) {
    event.preventDefault();
    event.stopPropagation();
    navigator.previous();
  } else if (matchesBinding(key, currentSettings.bindings, "activate")) {
    event.preventDefault();
    event.stopPropagation();
    navigator.activate();
  }
}

/**
 * Initialize Google search navigation
 */
export function initGoogleNavigation(settings: Settings): void {
  // Create navigator instance
  navigator = new Navigator(settings);

  // Initial scan for results
  const results = navigator.scanResults();
  console.log(`Key Wizard: Found ${results.length} search results`);

  if (results.length === 0) {
    console.warn('Key Wizard: No search results found. Make sure you are on a Google search results page.');
  }

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

  console.log('Key Wizard: Google search navigation initialized. Press j/k to navigate, Enter to activate.');
}
