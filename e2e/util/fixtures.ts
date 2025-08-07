import { test as base, chromium, type BrowserContext } from '@playwright/test'
import { mockedKrakenRates, mockKraken } from '../mocks/kraken'

const extensionPath = new URL('../../.', import.meta.url).pathname

export const test = base.extend<{
  context: BrowserContext
  extensionId: string
  btcFiatRates: Record<string, number>
}>({
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      channel: 'chromium',
      args: [
        `--headless=new`,
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--disable-web-security',
        '--disable-site-isolation-trials',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
    })

    // Intercept Kraken API for ALL pages/frames
    await mockKraken({ context })

    // popup syncs the rates on load from the background script, but the background script is not ready immediately
    await new Promise(resolve => setTimeout(resolve, 100))

    await use(context)
    await context.close()
  },
  extensionId: async ({ context }, use) => {
    let sw = context.serviceWorkers()[0]
    if (!sw) {
      sw = await context.waitForEvent('serviceworker')
    }
    const extensionId = new URL(sw.url()).hostname
    await use(extensionId)
  },
  btcFiatRates: async ({}, use) => {
    await use(mockedKrakenRates)
  }
})

export const expect = test.expect
