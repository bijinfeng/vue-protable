import Antd from 'ant-design-vue';
import { beforeEach } from 'vitest';
import { config } from '@vue/test-utils';

// Register Ant Design Vue globally for all tests
config.global.plugins = [Antd];

// Mock localStorage and sessionStorage for tests
const createStorage = () => {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      for (const key of Object.keys(store)) {
        delete store[key];
      }
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
  };
};

// Initialize storage before each test
beforeEach(() => {
  if (
    typeof globalThis.localStorage === 'undefined' ||
    typeof globalThis.localStorage.clear !== 'function'
  ) {
    Object.defineProperty(globalThis, 'localStorage', {
      value: createStorage(),
      writable: true,
      configurable: true,
    });
  }
  if (
    typeof globalThis.sessionStorage === 'undefined' ||
    typeof globalThis.sessionStorage.clear !== 'function'
  ) {
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: createStorage(),
      writable: true,
      configurable: true,
    });
  }
});
