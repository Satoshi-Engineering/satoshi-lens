import { BrowserContext } from "@playwright/test"

export const loadRateBtcFiat = async ({ context }: { context: BrowserContext }) => {
  const response = await context.request.get('https://api.kraken.com/0/public/Ticker?pair=BTCEUR,BTCUSD')
  const data = await response.json()
  return {
    EUR: parseFloat(data.result.XXBTZEUR.c[0]),
    USD: parseFloat(data.result.XXBTZUSD.c[0]),
  }
}
