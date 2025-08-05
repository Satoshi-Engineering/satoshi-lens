import { test as base, chromium, type BrowserContext } from '@playwright/test'
import { loadRateBtcFiat } from './rateBtcFiat'

const extensionPath = new URL('../../.', import.meta.url).pathname

const mockRates = {
  result: {
    XXBTZEUR: { c: ['98000.10000','0.00020037'] },
    XXBTZUSD: { c: ['113410.80000','0.00032833'] }
  }
}

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
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--disable-web-security',
        '--disable-site-isolation-trials',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
    })

    // ✅ Intercept Kraken API for ALL pages/frames
    await context.route('https://api.kraken.com/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRates),
      })
    })

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
  btcFiatRates: async ({ context }, use) => {
    const rates = await loadRateBtcFiat({ context})
    await use(rates)
  }
})

export const expect = test.expect
