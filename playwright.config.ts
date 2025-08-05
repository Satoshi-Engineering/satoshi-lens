import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  retries: 0,
  use: {
    headless: false,
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: 'npm run serve:static',
    port: 4173,
    reuseExistingServer: !process.env.CI, // Reuse in local dev
  },
  projects: [
    {
      name: 'chromium',
      use: {
        channel: 'chromium',
      },
    },
  ],
})
