const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  testPathIgnorePatterns: [
    '<rootDir>/login/e2e'
  ],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: ['<rootDir>/login/unit/setup'],
  mapCoverage: true,
  coverageDirectory: '<rootDir>/login/unit/coverage',
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/list.js',
    '!src/router/list.js',
    '!**/node_modules/**'
  ]
}
