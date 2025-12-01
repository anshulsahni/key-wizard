export interface KeyBinding {
  action: 'next' | 'previous' | 'activate';
  keys: string[]; // e.g., ['j', 'ArrowDown']
}

export interface Settings {
  bindings: KeyBinding[];
  enabled: boolean;
}

export interface SearchResult {
  element: HTMLElement;
  link: HTMLAnchorElement;
  index: number;
}

export interface ShortcutCombo {
  key: string; // e.g., 'M', '.', 'Enter'
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean; // Cmd on Mac
}

export interface ShortcutDefinition {
  id: string;
  description?: string;
  combos: ShortcutCombo[];
  handler: () => void | Promise<void>;
}

export type SiteType = 'google' | 'claude' | 'unknown';

