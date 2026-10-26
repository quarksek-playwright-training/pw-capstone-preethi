
import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',

    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,

    timeout: 90_000,
    expect: { timeout: 10_000 },
    reporter: 'html',

    use: {
        baseURL: 'https://www.automationexercise.com',
        testIdAttribute: 'data-qa',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        navigationTimeout: 30_000,
        actionTimeout: 15_000,
    },

    projects: [
        // Creates or reuses both accounts and saves their sessions.
        {
            name: 'setup',
            testDir: './auth',
            testMatch: '**/auth.setup.ts',
            use: {
                ...devices['Desktop Chrome'],
            },
        },

        // Scenario 1: independent login test.
        // This project does not depend on the shared auth setup.
        {
            name: 'login-independent',
            testMatch: '**/login.spec.ts',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
                {
            name: 'login-independent-firefox',
            testMatch: '**/login.spec.ts',
            use: {
                ...devices['Desktop Firefox'],
            },
        },
        {
            name: 'login-independent-webkit',
            testMatch: '**/login.spec.ts',
            use: {
                ...devices['Desktop Safari'],
            },
        },


        // Remaining scenarios use the shared setup.
        {
            name: 'chromium',
            testIgnore: '**/login.spec.ts',
            dependencies: ['setup'],
            use: {
                ...devices['Desktop Chrome'],
            },
        },

        {
            name: 'firefox',
            testIgnore: '**/login.spec.ts',
            dependencies: ['setup'],
            use: {
                ...devices['Desktop Firefox'],
            },
        },
            {
      name: 'webkit',
       testIgnore: '**/login.spec.ts',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },


       
    ],
});
