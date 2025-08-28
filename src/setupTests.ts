import '@testing-library/jest-dom';

// Мок IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  root: null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];

  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
};

// Мок ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Мок window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // устарело
    removeListener: jest.fn(), // устарело
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});
