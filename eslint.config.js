// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'jest.setup.js', 'jest.config.js'],
    rules: {
      'no-unused-expressions': ['error', { allowTernary: true, allowShortCircuit: true }],
    },
  },
]);
