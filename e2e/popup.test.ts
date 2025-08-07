import { test, expect } from './util/fixtures'
import { numberToGermanString } from './util/numberToGermanString'

test('popup displays bitcoin rates', async ({ context, page, extensionId, btcFiatRates }) => {
  await page.goto(`chrome-extension://${extensionId}/iconmenu/main.html`)

  const eur = page.locator('#list').getByText('EUR')
  await expect(eur).toBeVisible()
  await expect(eur).toHaveText(`${numberToGermanString(btcFiatRates.EUR)} EUR`)
  const usd = page.locator('#list').getByText('USD')
  await expect(usd).toBeVisible()
  await expect(usd).toHaveText(`${numberToGermanString(btcFiatRates.USD)} USD`)
})
