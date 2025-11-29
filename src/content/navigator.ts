import type { SearchResult, Settings } from '../shared/types';
import { SELECTORS, CSS_CLASSES } from '../shared/constants';

export class Navigator {
  private results: SearchResult[] = [];
  private currentIndex: number = -1;
  private settings: Settings;

  constructor(settings: Settings) {
    this.settings = settings;
  }

  /**
   * Scan the DOM for search results and cache them
   */
  scanResults(): SearchResult[] {
    // Try multiple selectors for Google search results (Google changes their DOM structure)
    const selectors = [
      'div.g', // Standard Google results
      'div[data-ved]', // Results with data-ved attribute
      'div.tF2Cxc', // Alternative class name
      'div[jscontroller]', // Results with jscontroller
    ];

    let containers: NodeListOf<HTMLElement> | null = null;
    for (const selector of selectors) {
      containers = document.querySelectorAll<HTMLElement>(selector);
      if (containers.length > 0) {
        console.log(`Key Wizard: Using selector "${selector}"`);
        break;
      }
    }

    if (!containers || containers.length === 0) {
      this.results = [];
      return this.results;
    }

    this.results = [];

    containers.forEach((container, index) => {
      // Look for link in various ways
      const linkElement = container.querySelector<HTMLAnchorElement>('a[href]') ||
                         container.closest('a[href]') as HTMLAnchorElement;
      const h3Element = container.querySelector('h3') ||
                       container.querySelector('h2') ||
                       container.querySelector('[role="heading"]');

      // Only include results that have both a link and a title
      if (linkElement && h3Element && linkElement.href && !linkElement.href.includes('google.com/search')) {
        this.results.push({
          element: container,
          link: linkElement,
          index,
        });
      }
    });

    return this.results;
  }

  /**
   * Move to the next result
   */
  next(): void {
    if (this.results.length === 0) {
      this.scanResults();
    }

    if (this.results.length === 0) {
      return;
    }

    this.currentIndex = (this.currentIndex + 1) % this.results.length;
    this.highlight(this.currentIndex);
  }

  /**
   * Move to the previous result
   */
  previous(): void {
    if (this.results.length === 0) {
      this.scanResults();
    }

    if (this.results.length === 0) {
      return;
    }

    this.currentIndex = this.currentIndex <= 0 
      ? this.results.length - 1 
      : this.currentIndex - 1;
    this.highlight(this.currentIndex);
  }

  /**
   * Activate (navigate to) the current result
   */
  activate(): void {
    if (this.currentIndex >= 0 && this.currentIndex < this.results.length) {
      const result = this.results[this.currentIndex];
      if (result && result.link) {
        result.link.click();
      }
    }
  }

  /**
   * Highlight a specific result by index
   */
  private highlight(index: number): void {
    if (index < 0 || index >= this.results.length) {
      return;
    }

    // Clear all highlights first
    this.clearHighlight();

    // Apply highlight to current result
    const result = this.results[index];
    if (result && result.element) {
      result.element.classList.add(CSS_CLASSES.HIGHLIGHT);
      
      // Scroll into view
      result.element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }

  /**
   * Clear all highlight classes
   */
  private clearHighlight(): void {
    document.querySelectorAll(`.${CSS_CLASSES.HIGHLIGHT}`).forEach((el) => {
      el.classList.remove(CSS_CLASSES.HIGHLIGHT);
    });
  }

  /**
   * Get current focused index
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Get total number of results
   */
  getResultCount(): number {
    return this.results.length;
  }

  /**
   * Reset navigation state
   */
  reset(): void {
    this.currentIndex = -1;
    this.clearHighlight();
    this.results = [];
  }

  /**
   * Update settings
   */
  updateSettings(settings: Settings): void {
    this.settings = settings;
  }

  /**
   * Get current settings
   */
  getSettings(): Settings {
    return this.settings;
  }
}

