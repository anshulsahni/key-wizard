import type { ShortcutCombo, ShortcutDefinition } from '../shared/types';

/**
 * Keyboard Shortcut Registry
 * 
 * Manages keyboard shortcuts with support for modifier keys (Ctrl, Shift, Alt, Meta).
 * Allows easy registration and unregistration of shortcuts.
 */
export class ShortcutRegistry {
  private shortcuts: Map<string, ShortcutDefinition> = new Map();
  private isMac: boolean;

  constructor() {
    // Detect Mac OS
    this.isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }

  /**
   * Register a new keyboard shortcut
   */
  register(shortcut: ShortcutDefinition): void {
    if (this.shortcuts.has(shortcut.id)) {
      console.warn(`Key Wizard: Shortcut with id "${shortcut.id}" already exists. Overwriting.`);
    }
    this.shortcuts.set(shortcut.id, shortcut);
    console.log(`Key Wizard: Registered shortcut "${shortcut.id}"`);
  }

  /**
   * Unregister a keyboard shortcut by ID
   */
  unregister(id: string): boolean {
    const removed = this.shortcuts.delete(id);
    if (removed) {
      console.log(`Key Wizard: Unregistered shortcut "${id}"`);
    } else {
      console.warn(`Key Wizard: Shortcut "${id}" not found for unregistration`);
    }
    return removed;
  }

  /**
   * Check if a keyboard event matches any registered shortcut
   */
  matches(event: KeyboardEvent): ShortcutDefinition | null {
    for (const shortcut of this.shortcuts.values()) {
      for (const combo of shortcut.combos) {
        if (this.matchesCombo(event, combo)) {
          return shortcut;
        }
      }
    }
    return null;
  }

  /**
   * Check if a keyboard event matches a specific key combination
   */
  private matchesCombo(event: KeyboardEvent, combo: ShortcutCombo): boolean {
    // Normalize key comparison (case-insensitive for letter keys)
    const eventKey = event.key;
    const comboKey = combo.key;
    
    // Handle special keys that need exact match
    const specialKeys = ['Enter', 'Escape', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'];
    const isSpecialKey = specialKeys.includes(comboKey);
    
    let keyMatches: boolean;
    if (isSpecialKey) {
      keyMatches = eventKey === comboKey;
    } else {
      // For regular keys, compare case-insensitively
      keyMatches = eventKey.toLowerCase() === comboKey.toLowerCase();
    }

    if (!keyMatches) {
      return false;
    }

    // Check modifier keys
    // On Mac, meta key is Cmd, on other platforms ctrl is Ctrl
    const ctrlOrCmd = this.isMac ? event.metaKey : event.ctrlKey;
    const expectedCtrlOrCmd = this.isMac ? combo.meta : combo.ctrl;

    if (expectedCtrlOrCmd !== undefined && ctrlOrCmd !== expectedCtrlOrCmd) {
      return false;
    }

    // If ctrl/meta is specified, make sure the other isn't pressed
    if (expectedCtrlOrCmd && this.isMac && event.ctrlKey) {
      return false;
    }
    if (expectedCtrlOrCmd && !this.isMac && event.metaKey) {
      return false;
    }

    if (combo.shift !== undefined && event.shiftKey !== combo.shift) {
      return false;
    }

    if (combo.alt !== undefined && event.altKey !== combo.alt) {
      return false;
    }

    return true;
  }

  /**
   * Get all registered shortcuts
   */
  getAll(): ShortcutDefinition[] {
    return Array.from(this.shortcuts.values());
  }

  /**
   * Get a shortcut by ID
   */
  get(id: string): ShortcutDefinition | undefined {
    return this.shortcuts.get(id);
  }

  /**
   * Clear all registered shortcuts
   */
  clear(): void {
    this.shortcuts.clear();
    console.log('Key Wizard: Cleared all shortcuts');
  }

  /**
   * Get the number of registered shortcuts
   */
  size(): number {
    return this.shortcuts.size;
  }
}

