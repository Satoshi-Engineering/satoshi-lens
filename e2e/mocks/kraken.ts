import { BrowserContext } from "@playwright/test"

process.env.PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS = '1'

const rates = {
  EUR: '99999.90000',
  USD: '111111.10000',
}

export const mockedKrakenRates = {
  EUR: parseInt(rates.EUR, 10),
  USD: parseInt(rates.USD, 10),
}

export const mockKraken = async ({ context }: { context: BrowserContext }) => {
  // Intercept Kraken API for ALL pages/frames
  await context.route('https://api.kraken.com/0/public/Ticker?pair=BTCUSD', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        result: {
          XXBTZUSD: { c: [mockedKrakenRates.USD, '1'] },
        },
      }),
    })
  })

  await context.route('https://api.kraken.com/0/public/Ticker?pair=BTCEUR', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        result: {
          XXBTZEUR: { c: [mockedKrakenRates.EUR, '1'] },
        },
      }),
    })
  })

  await context.route('https://api.kraken.com/0/public/Ticker?pair=BTCEUR,BTCUSD', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        result: {
          XXBTZEUR: { c: [mockedKrakenRates.EUR, '1'] },
          XXBTZUSD: { c: [mockedKrakenRates.USD, '1'] },
        },
      }),
    })
  })
}
