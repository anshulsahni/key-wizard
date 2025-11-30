import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Navigator } from '../src/content/navigator';
import { getDefaultSettings } from '../src/shared/storage';
import type { Settings } from '../src/shared/types';

describe('Navigator', () => {
  let settings: Settings;
  let navigator: Navigator;
  let mockContainer: HTMLElement;
  let mockLink: HTMLAnchorElement;
  let mockH3: HTMLHeadingElement;

  beforeEach(() => {
    settings = getDefaultSettings();
    navigator = new Navigator(settings);

    // Create mock DOM elements
    mockContainer = document.createElement('div');
    mockContainer.setAttribute('data-rpos', '0');
    
    mockLink = document.createElement('a');
    mockLink.href = 'https://example.com';
    mockLink.textContent = 'Example Link';
    
    mockH3 = document.createElement('h3');
    mockH3.textContent = 'Example Title';
    
    mockContainer.appendChild(mockLink);
    mockContainer.appendChild(mockH3);
    
    document.body.innerHTML = '';
    document.body.appendChild(mockContainer);
  });

  describe('scanResults', () => {
    it('should find search results with data-rpos attribute', () => {
      const results = navigator.scanResults();

      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('element');
      expect(results[0]).toHaveProperty('link');
      expect(results[0]).toHaveProperty('index');
    });

    it('should return empty array when no results found', () => {
      document.body.innerHTML = '';
      
      const results = navigator.scanResults();

      expect(results).toEqual([]);
    });

    it('should exclude Google internal search links', () => {
      const googleLink = document.createElement('a');
      googleLink.href = 'https://www.google.com/search?q=test';
      const googleContainer = document.createElement('div');
      googleContainer.setAttribute('data-rpos', '1');
      googleContainer.appendChild(googleLink);
      document.body.appendChild(googleContainer);

      const results = navigator.scanResults();

      // Should not include the Google search link
      const hasGoogleLink = results.some(r => r.link.href.includes('google.com/search'));
      expect(hasGoogleLink).toBe(false);
    });

    it('should find results with h2 or role="heading" as title', () => {
      const container2 = document.createElement('div');
      container2.setAttribute('data-rpos', '1');
      const link2 = document.createElement('a');
      link2.href = 'https://example2.com';
      const h2 = document.createElement('h2');
      h2.textContent = 'H2 Title';
      container2.appendChild(link2);
      container2.appendChild(h2);
      document.body.appendChild(container2);

      const results = navigator.scanResults();

      expect(results.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('next', () => {
    it('should move to next result', () => {
      // Add multiple results
      for (let i = 1; i < 3; i++) {
        const container = document.createElement('div');
        container.setAttribute('data-rpos', i.toString());
        const link = document.createElement('a');
        link.href = `https://example${i}.com`;
        const h3 = document.createElement('h3');
        h3.textContent = `Title ${i}`;
        container.appendChild(link);
        container.appendChild(h3);
        document.body.appendChild(container);
      }

      navigator.scanResults();
      const initialIndex = navigator.getCurrentIndex();
      
      navigator.next();
      const newIndex = navigator.getCurrentIndex();

      expect(newIndex).toBeGreaterThan(initialIndex);
    });

    it('should wrap to first result when at the end', () => {
      navigator.scanResults();
      const resultCount = navigator.getResultCount();
      
      // Move to last result
      for (let i = 0; i < resultCount; i++) {
        navigator.next();
      }

      const lastIndex = navigator.getCurrentIndex();
      navigator.next();
      const wrappedIndex = navigator.getCurrentIndex();

      expect(wrappedIndex).toBe(0);
    });

    it('should scan results if none are cached', () => {
      const scanSpy = vi.spyOn(navigator, 'scanResults');
      
      navigator.next();

      expect(scanSpy).toHaveBeenCalled();
    });
  });

  describe('previous', () => {
    it('should move to previous result', () => {
      // Add multiple results
      for (let i = 1; i < 3; i++) {
        const container = document.createElement('div');
        container.setAttribute('data-rpos', i.toString());
        const link = document.createElement('a');
        link.href = `https://example${i}.com`;
        const h3 = document.createElement('h3');
        h3.textContent = `Title ${i}`;
        container.appendChild(link);
        container.appendChild(h3);
        document.body.appendChild(container);
      }

      navigator.scanResults();
      navigator.next(); // Move to index 0
      navigator.next(); // Move to index 1
      const currentIndex = navigator.getCurrentIndex();
      expect(currentIndex).toBe(1);
      
      navigator.previous();
      const newIndex = navigator.getCurrentIndex();

      expect(newIndex).toBe(0);
      expect(newIndex).toBeLessThan(currentIndex);
    });

    it('should wrap to last result when at the beginning', () => {
      navigator.scanResults();
      const resultCount = navigator.getResultCount();
      
      navigator.previous();
      const wrappedIndex = navigator.getCurrentIndex();

      expect(wrappedIndex).toBe(resultCount - 1);
    });
  });

  describe('activate', () => {
    it('should click the link of current result', () => {
      navigator.scanResults();
      navigator.next();
      
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click');
      
      navigator.activate();

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should not throw when no result is selected', () => {
      expect(() => navigator.activate()).not.toThrow();
    });
  });

  describe('getCurrentIndex', () => {
    it('should return -1 initially', () => {
      expect(navigator.getCurrentIndex()).toBe(-1);
    });

    it('should return current index after navigation', () => {
      navigator.scanResults();
      navigator.next();
      
      expect(navigator.getCurrentIndex()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getResultCount', () => {
    it('should return 0 when no results found', () => {
      document.body.innerHTML = '';
      
      expect(navigator.getResultCount()).toBe(0);
    });

    it('should return correct count after scanning', () => {
      navigator.scanResults();
      
      expect(navigator.getResultCount()).toBeGreaterThan(0);
    });
  });

  describe('reset', () => {
    it('should reset navigation state', () => {
      navigator.scanResults();
      navigator.next();
      
      navigator.reset();

      expect(navigator.getCurrentIndex()).toBe(-1);
      expect(navigator.getResultCount()).toBe(0);
    });
  });

  describe('updateSettings and getSettings', () => {
    it('should update and retrieve settings', () => {
      const newSettings: Settings = {
        enabled: false,
        bindings: [
          { action: 'next', keys: ['ArrowDown'] },
        ],
      };

      navigator.updateSettings(newSettings);
      const retrieved = navigator.getSettings();

      expect(retrieved).toEqual(newSettings);
    });
  });
});

