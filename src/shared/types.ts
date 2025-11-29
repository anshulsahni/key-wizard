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

