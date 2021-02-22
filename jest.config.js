module.exports = {
  preset: 'jest-preset-angular',
  moduleNameMapper: {
    '^@app(.*)$': '<rootDir>/src/app$1',
    '^@env(.*)$': '<rootDir>/src/environments$1',
    '^@core(.*)$': '<rootDir>/src/app/core$1',
    '^@model(.*)$': '<rootDir>/src/app/models$1'
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/cypress/',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/src/test.ts'
  ],
  coverageDirectory: '<rootDir>/reports/coverage'
};
