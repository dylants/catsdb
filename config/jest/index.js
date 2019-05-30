module.exports = {
  automock: false,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: '<rootDir>/coverage/',
  coveragePathIgnorePatterns: [
    '<rootDir>/src/index.js',
    '<rootDir>\\/src\\/(lib|middleware)\\/\\w*\\/index\\.js',
    '<rootDir>/src/models',
    '<rootDir>/node_modules/',
  ],
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  rootDir: '../../',
  testMatch: ['<rootDir>/src/**/*.test.js'],
  verbose: true,
};
