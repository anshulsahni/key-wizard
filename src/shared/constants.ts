import type { KeyBinding } from './types';

export const SELECTORS = {
  RESULT_CONTAINER: '[data-rpos]',
  RESULT_LINK: '[data-rpos] a[href]',
  SEARCH_INPUT: 'input[name="q"]',
  // Claude.ai selectors (to be refined based on actual DOM structure)
  // Note: Using generic element detection in handlers, but placeholders for future specific selectors
  CLAUDE_MODEL_DROPDOWN: '[data-model]',
  CLAUDE_RESEARCH_TOGGLE: '[data-research]',
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

