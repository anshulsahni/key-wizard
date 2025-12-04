import { getSettings } from "../shared/storage";
import type { SiteType } from "../shared/types";
import { ShortcutRegistry } from "./shortcut-registry";
import {
  openModelDropdown,
  toggleResearchOption,
  navigateToProjects,
  navigateToNewProject,
} from "./claude-handlers";
import { handleGoogleKeyDown, initGoogleNavigation } from "./google-handlers";
import "./styles.css";

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

  if (hostname.includes("claude.ai")) {
    return "claude";
  }

  return "unknown";
}

/**
 * Check if user is currently typing in an input field
 * TODO: Re-enable this function later if input focus checks are needed
 */
// function isInputFocused(): boolean {
//   const activeElement = document.activeElement;
//   if (!activeElement) {
//     return false;
//   }
//
//   const tagName = activeElement.tagName.toLowerCase();
//   const isInput = tagName === 'input' || tagName === 'textarea';
//   const isContentEditable = activeElement.hasAttribute('contenteditable');
//
//   return isInput || isContentEditable;
// }

/**
 * Handle keyboard events
 */
function handleKeyDown(event: KeyboardEvent): void {
  // Skip if settings aren't loaded yet
  if (!settingsLoaded) {
    return;
  }

  const site = detectSite();

  // Handle Claude.ai shortcuts via registry
  if (site === "claude" && shortcutRegistry) {
    const matchedShortcut = shortcutRegistry.matches(event);
    if (matchedShortcut) {
      // Navigation shortcuts should work even when input is focused
      // const isNavigationShortcut =
      //   matchedShortcut.id === "navigate-projects" ||
      //   matchedShortcut.id === "navigate-new-project";

      // Skip other shortcuts if user is typing in an input field
      // TODO: Re-enable input focus check later if needed
      // if (!isNavigationShortcut && isInputFocused()) {
      //   return;
      // }

      event.preventDefault();
      event.stopPropagation();
      matchedShortcut.handler();
      return;
    }
  }

  // Skip if user is typing in an input field (for Google search navigation)
  // TODO: Re-enable input focus check later if needed
  // if (isInputFocused()) {
  //   return;
  // }

  // Handle Google search navigation
  if (site === "google") {
    handleGoogleKeyDown(event);
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

  // Register Ctrl+Shift+P / Cmd+Shift+P to navigate to projects page
  shortcutRegistry.register({
    id: "navigate-projects",
    description: "Navigate to projects page",
    combos: [
      { key: "P", ctrl: true, shift: true }, // Ctrl+Shift+P (Windows/Linux)
      { key: "P", meta: true, shift: true }, // Cmd+Shift+P (Mac)
    ],
    handler: navigateToProjects,
  });

  // Register Ctrl+Shift+O / Cmd+Shift+O to navigate to new project page
  shortcutRegistry.register({
    id: "navigate-new-project",
    description: "Navigate to new project page",
    combos: [
      { key: "O", ctrl: true, shift: true }, // Ctrl+Shift+O (Windows/Linux)
      { key: "O", meta: true, shift: true }, // Cmd+Shift+O (Mac)
    ],
    handler: navigateToNewProject,
  });

  console.log("Key Wizard: Claude.ai shortcuts registered");
  console.log("Key Wizard: Press Ctrl+M (Cmd+' on Mac) to open model dropdown");
  console.log(
    "Key Wizard: Press Ctrl+Shift+. (Cmd+Shift+. on Mac) to toggle research option"
  );
  console.log(
    "Key Wizard: Press Ctrl+Shift+P (Cmd+Shift+P on Mac) to navigate to projects"
  );
  console.log(
    "Key Wizard: Press Ctrl+Shift+O (Cmd+Shift+O on Mac) to navigate to new project"
  );
}

/**
 * Initialize the extension
 */
async function init(): Promise<void> {
  try {
    console.log("Key Wizard: Initializing...");
    const site = detectSite();
    console.log(`Key Wizard: Detected site: ${site}`);

    const settings = await getSettings();

    if (!settings.enabled) {
      console.log("Key Wizard: Extension is disabled");
      return;
    }

    // Initialize based on site type
    if (site === "claude") {
      initClaudeShortcuts();
    } else if (site === "google") {
      initGoogleNavigation(settings);
    } else {
      console.warn(
        "Key Wizard: Unknown site. Extension may not work correctly."
      );
    }

    // Attach keyboard event listener
    document.addEventListener("keydown", handleKeyDown, true);
    console.log("Key Wizard: Keyboard listener attached");

    settingsLoaded = true;
    console.log("Key Wizard: Initialization complete.");
  } catch (error) {
    console.error("Error initializing Key Wizard:", error);
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
