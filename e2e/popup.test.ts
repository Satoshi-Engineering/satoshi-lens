import { test, expect } from './util/fixtures'
import { numberToGermanString } from './util/numberToGermanString'

test('popup displays bitcoin rates', async ({ page, extensionId, btcFiatRates }) => {
  await page.goto(`chrome-extension://${extensionId}/iconmenu/main.html`)

  const list = page.locator('#list')
  await expect(list).toContainText(`${numberToGermanString(btcFiatRates.EUR)} EUR`)
  await expect(list).toContainText(`${numberToGermanString(btcFiatRates.USD)} USD`)
})
