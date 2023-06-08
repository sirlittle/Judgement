import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    maxConcurrency: 1,
    testMatch: ['**/src/tests/**/*.test.ts'],
};

export default config;
