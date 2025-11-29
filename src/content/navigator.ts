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
    // Use data-rpos attribute which Google uses to mark search result positions
    const containers = document.querySelectorAll<HTMLElement>(SELECTORS.RESULT_CONTAINER);

    if (containers.length === 0) {
      console.warn('Key Wizard: No elements with data-rpos found. Make sure you are on a Google search results page.');
      this.results = [];
      return this.results;
    }

    console.log(`Key Wizard: Found ${containers.length} elements with data-rpos`);

    this.results = [];

    containers.forEach((container, index) => {
      // Find the main link in the result container
      const linkElement = container.querySelector<HTMLAnchorElement>('a[href]');
      
      // Find the title (h3, h2, or heading role)
      const h3Element = container.querySelector('h3') ||
                       container.querySelector('h2') ||
                       container.querySelector('[role="heading"]');

      // Only include results that have both a link and a title, and exclude Google internal links
      if (linkElement && h3Element && linkElement.href && !linkElement.href.includes('google.com/search')) {
        this.results.push({
          element: container,
          link: linkElement,
          index,
        });
      }
    });

    console.log(`Key Wizard: Parsed ${this.results.length} valid search results`);
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

