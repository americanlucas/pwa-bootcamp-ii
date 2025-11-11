import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'firefox',
      use: { 
        browserName: 'firefox',
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'webkit',
      use: { 
        browserName: 'webkit',
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'mobile-chrome',
      use: {
        browserName: 'chromium',
        viewport: { width: 375, height: 667 },
        isMobile: true
      }
    }
  ],

  webServer: {
    command: 'docker-compose up',
    url: 'http://localhost:8080',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI
  }
});