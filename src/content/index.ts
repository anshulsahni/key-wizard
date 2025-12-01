import { Navigator } from './navigator';
import { getSettings } from '../shared/storage';
import type { KeyBinding, SiteType, Settings } from '../shared/types';
import { ShortcutRegistry } from './shortcut-registry';
import { openModelDropdown, toggleResearchOption } from './claude-handlers';
import './styles.css';

let navigator: Navigator | null = null;
let shortcutRegistry: ShortcutRegistry | null = null;
let settingsLoaded = false;

/**
 * Detect which site the extension is running on
 */
function detectSite(): SiteType {
  const hostname = window.location.hostname.toLowerCase();

  if (hostname.includes("google.com") || hostname.includes("google.")) {
    return "google";
  }

  if (hostname.includes('claude.ai')) {
    return 'claude';
  }

  return 'unknown';
}

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
  if (!settingsLoaded) {
    return;
  }

  // Skip if user is typing in an input field
  if (isInputFocused()) {
    return;
  }

  const site = detectSite();

  // Handle Claude.ai shortcuts via registry
  if (site === 'claude' && shortcutRegistry) {
    const matchedShortcut = shortcutRegistry.matches(event);
    if (matchedShortcut) {
      event.preventDefault();
      event.stopPropagation();
      matchedShortcut.handler();
      return;
    }
  }

  // Handle Google search navigation
  if (site === 'google' && navigator) {
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
}

/**
 * Initialize Claude.ai shortcuts
 */
function initClaudeShortcuts(): void {
  shortcutRegistry = new ShortcutRegistry();

  // Register Ctrl+M / Cmd+' to open model dropdown
  shortcutRegistry.register({
    id: "open-model",
    description: "Open model dropdown",
    combos: [
      { key: "M", ctrl: true }, // Ctrl+M (Windows/Linux)
      { key: "'", meta: true }, // Cmd+' (Mac) - using ' instead of M to avoid minimize conflict
    ],
    handler: openModelDropdown,
  });

  // Register Ctrl+Shift+. / Cmd+Shift+. to toggle research option
  shortcutRegistry.register({
    id: "toggle-research",
    description: "Toggle research option",
    combos: [
      { key: ".", ctrl: true, shift: true }, // Ctrl+Shift+. (Windows/Linux)
      { key: ".", meta: true, shift: true }, // Cmd+Shift+. (Mac)
    ],
    handler: toggleResearchOption,
  });

  console.log("Key Wizard: Claude.ai shortcuts registered");
  console.log("Key Wizard: Press Ctrl+M (Cmd+' on Mac) to open model dropdown");
  console.log(
    "Key Wizard: Press Ctrl+Shift+. (Cmd+Shift+. on Mac) to toggle research option"
  );
}

/**
 * Initialize Google search navigation
 */
function initGoogleNavigation(settings: Settings): void {
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

/**
 * Initialize the extension
 */
async function init(): Promise<void> {
  try {
    console.log('Key Wizard: Initializing...');
    const site = detectSite();
    console.log(`Key Wizard: Detected site: ${site}`);

    const settings = await getSettings();

    if (!settings.enabled) {
      console.log('Key Wizard: Extension is disabled');
      return;
    }

    // Initialize based on site type
    if (site === 'claude') {
      initClaudeShortcuts();
    } else if (site === 'google') {
      initGoogleNavigation(settings);
    } else {
      console.warn('Key Wizard: Unknown site. Extension may not work correctly.');
    }

    // Attach keyboard event listener
    document.addEventListener('keydown', handleKeyDown, true);
    console.log('Key Wizard: Keyboard listener attached');

    settingsLoaded = true;
    console.log('Key Wizard: Initialization complete.');
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

