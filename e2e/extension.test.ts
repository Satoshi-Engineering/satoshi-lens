import { BtcFiatConverter } from './util/BtcFiatConverter'
import { test, expect } from './util/fixtures'

test('popup displays bitcoin rates', async ({ page, extensionId, btcFiatRates }) => {
  // popup syncs the rates on load from the background script, but the background script is not ready immediately
  await new Promise(resolve => setTimeout(resolve, 2 * 1000))

  await page.goto(`chrome-extension://${extensionId}/iconmenu/main.html`)

  const eur = page.locator('#list').getByText('EUR')
  await expect(eur).toBeVisible()
  await expect(eur).toHaveText(`${toGermanString(btcFiatRates.EUR)} EUR`)
  const usd = page.locator('#list').getByText('USD')
  await expect(usd).toBeVisible()
  await expect(usd).toHaveText(`${toGermanString(btcFiatRates.USD)} USD`)
})

test('content script effect', async ({ page, btcFiatRates }) => {
  // the converter converts the btc amounts on load from the background script, but the background script is not ready immediately
  await new Promise(resolve => setTimeout(resolve, 2 * 1000))

  const btcFiatConverter = new BtcFiatConverter(btcFiatRates)
  await page.goto('http://localhost:4173/hmbtc-tests')
  
  await expect(page.locator('body')).toContainText('How Much BTC Test File')
  await expect(page.locator('body')).toContainText(`German Format - ${toGermanString(btcFiatConverter.eurToBtc(1234567.89))} BTC`)
  await expect(page.locator('body')).toContainText(`US Format - ${toGermanString(btcFiatConverter.eurToBtc(1234567.89))} BTC`)
  await expect(page.locator('body')).toContainText(`German Small -  ${toGermanString(btcFiatConverter.eurToSats(567.89), 0)} Satoshi`)
  await expect(page.locator('body')).toContainText(`US Small -  ${toGermanString(btcFiatConverter.eurToSats(567.89), 0)} Satoshi`)
})

const toGermanString = (value: number, digits = 2) => {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}
