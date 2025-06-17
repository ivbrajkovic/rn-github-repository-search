module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    // Special regex is needed for pnpm package manger
    'node_modules/(?!.*(@react-native|react-native|expo|@expo|unimodules|@unimodules|sentry-expo|react-redux|@reduxjs/toolkit|@react-navigation|react-native-unistyles))',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
