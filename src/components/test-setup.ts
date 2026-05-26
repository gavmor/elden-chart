import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement ResizeObserver — stub it for all tests.
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
