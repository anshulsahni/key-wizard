import type { KeyBinding } from './types';

export const SELECTORS = {
  RESULT_CONTAINER: 'div.g',
  RESULT_LINK: 'div.g a h3',
  SEARCH_INPUT: 'input[name="q"]',
} as const;

export const DEFAULT_BINDINGS: KeyBinding[] = [
  { action: 'next', keys: ['j', 'ArrowDown'] },
  { action: 'previous', keys: ['k', 'ArrowUp'] },
  { action: 'activate', keys: ['Enter'] },
];

export const CSS_CLASSES = {
  HIGHLIGHT: 'key-wizard-highlight',
} as const;

export const STORAGE_KEYS = {
  SETTINGS: 'key-wizard-settings',
} as const;

