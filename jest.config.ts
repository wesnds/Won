import type { Config } from 'jest'
import nextJest from 'next/jest.js'
import path from 'path'

const createJestConfig = nextJest({
  dir: './'
})

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts(x)?',
    '!src/app/**', // should be tested in e2e
    '!src/lib/registry.tsx',
    '!src/types/**',
    '!src/styles/**',
    '!src/**/stories.tsx'
  ],
  coverageDirectory: 'tests/coverage',
  coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],
  coverageProvider: 'babel',
  errorOnDeprecated: true,
  fakeTimers: {
    enableGlobally: true
  },
  maxWorkers: '50%',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  runner: 'jest-runner',
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  modulePaths: ['<rootDir>/src'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        configFile: path.resolve(__dirname, 'babel.config.js')
      }
    ]
  },
  moduleNameMapper: {
    '^styled-components':
      'styled-components/dist/styled-components.browser.cjs.js'
  }
}

export default createJestConfig(config)
