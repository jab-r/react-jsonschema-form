import { setImmediate } from 'timers';
import '@testing-library/jest-native/extend-expect';

// Mock React Native components and APIs
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    // Add platform-specific mocks
    Platform: {
      ...RN.Platform,
      OS: 'ios',
      select: jest.fn(obj => obj.ios),
    },
    // Mock core components
    View: 'View',
    Text: 'Text',
    TextInput: 'TextInput',
    TouchableOpacity: 'TouchableOpacity',
    Pressable: 'Pressable',
    Switch: 'Switch',
    // Add accessibility props
    AccessibilityInfo: {
      ...RN.AccessibilityInfo,
      isScreenReaderEnabled: jest.fn(() => Promise.resolve(false)),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
  };
});

// Setup timers
global.setImmediate = setImmediate;

// Add test IDs to all components for easier querying
jest.mock('react-native/Libraries/Components/TextInput/TextInput', () => {
  const MockTextInput = jest.requireActual('react-native/Libraries/Components/TextInput/TextInput');
  return {
    ...MockTextInput,
    defaultProps: {
      ...MockTextInput.defaultProps,
      testID: 'text-input',
    },
  };
});

// Silence React Native warnings
console.warn = jest.fn();
console.error = jest.fn();
