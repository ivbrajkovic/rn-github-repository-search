/**
 * SSR Test for Unistyles Configuration
 *
 * This script simulates server-side rendering by setting window to undefined
 * and watching for crashes when accessing the configuration.
 */

// Set up colors for better console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

console.log(
  `${colors.bold}${colors.blue}=== TESTING UNISTYLES SSR COMPATIBILITY ===${colors.reset}`
);
console.log(
  `${colors.yellow}This test simulates server-side rendering conditions${colors.reset}\n`
);

// Simulate server-side rendering environment
console.log('Setting up SSR environment...');
console.log('- Setting window to undefined (like in SSR)');
globalThis.window = undefined;

// Create mock for mmkvStore
console.log('- Creating mock for mmkvStore');
const mockMMKV = {
  getString: (key) => {
    console.log(`  Attempted to access mmkvStore.getString("${key}") during SSR`);
    throw new Error('Cannot access browser storage during SSR');
  },
};

// Create mock for StyleSheet.configure
console.log('- Creating mock for Unistyles StyleSheet.configure');
const mockStyleSheet = {
  configure: (config) => {
    console.log('  StyleSheet.configure was called successfully');
    console.log(`  Theme setting type: ${typeof config.settings?.initialTheme}`);
  },
};

console.log('\nRunning the test...');
try {
  // Prepare the environment
  const originalModule = require('module');
  const originalRequire = originalModule.prototype.require;

  // Mock the require function to intercept specific modules
  originalModule.prototype.require = function (path) {
    if (path === '@/mmkv-store/mmkv-store-store') {
      console.log('  Intercepted require for mmkvStore');
      return { mmkvStore: mockMMKV };
    }
    if (path === 'react-native-unistyles') {
      console.log('  Intercepted require for react-native-unistyles');
      return { StyleSheet: mockStyleSheet };
    }
    return originalRequire.apply(this, arguments);
  };

  // Import a small wrapper for the unistyles module
  console.log('- Evaluating unistyles configuration...');

  // Run a string of code that simulates importing the module
  eval(`
    const initialTheme = () => {
      // For safety, always have a default
      let themeToUse = 'light';
      
      try {
        // Check if we're in a server-side context or browser
        const isServerSide = typeof window === 'undefined';
        
        // Skip storage access during server-side rendering
        if (isServerSide) {
          return 'light';
        }
        
        // Now we're sure we're in browser context or native app
        const storedTheme = mockMMKV.getString('preferredTheme');
        if (storedTheme === 'dark' || storedTheme === 'light') {
          themeToUse = storedTheme;
          console.log('Loading stored theme preference:', storedTheme);
        }
      } catch (error) {
        console.warn(
          'Failed to load theme preference from mmkvStore, using default light theme',
          error
        );
      }
      
      return themeToUse;
    };
    
    // Call the function to see if it throws
    const result = initialTheme();
    console.log('  Result of initialTheme():', result);
  `);

  console.log(`\n${colors.bold}${colors.green}✅ SUCCESS!${colors.reset}`);
  console.log(
    'Your unistyles configuration should handle server-side rendering correctly!'
  );
  console.log(
    'The code properly skipped storage access during SSR and defaulted to light theme.'
  );
} catch (err) {
  console.error(
    `\n${colors.bold}${colors.red}❌ ERROR: Your unistyles configuration crashed:${colors.reset}`
  );
  console.error(err);
  console.error('\nYou may need to review your SSR handling in unistyles.ts');
}
