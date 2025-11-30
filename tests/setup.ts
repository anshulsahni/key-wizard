// Test setup file for Vitest
import { createChromeMock } from './mocks/chrome';

// Set up Chrome API mocks globally
const { chrome: chromeMock } = createChromeMock();
global.chrome = chromeMock;

