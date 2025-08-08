import { BtcFiatConverter } from './util/BtcFiatConverter'
import { test, expect } from './util/fixtures'
import { numberToGermanString as $n } from './util/numberToGermanString'

const getPages = async (context, extensionId) => {
  const page = await context.newPage()
  await page.goto('http://localhost:4173/hmbtc-tests')
  const popupPage = await context.newPage()
  await popupPage.goto(`chrome-extension://${extensionId}/iconmenu/main.html`)
  return { page, popupPage }
}

test('is enabled by default', async ({ context, extensionId }) => {
  const { page, popupPage } = await getPages(context, extensionId)
  
  await expect(popupPage.getByTestId('toggle')).toBeChecked()
  await expect(page.getByTestId('simple-cases-list')).toContainText('German Format - 12,35 BTC')
})

test('will not convert if disabled', async ({ context, extensionId }) => {
  const { page, popupPage } = await getPages(context, extensionId)
  await popupPage.getByTestId('toggle').uncheck()

  await expect(page.getByTestId('simple-cases-list')).toContainText('German Format - 1.234.567,89 EUR')
})

test('will convert if enabled', async ({ context, extensionId }) => {
  const { page, popupPage } = await getPages(context, extensionId)
  await popupPage.getByTestId('toggle').check()

  await expect(page.getByTestId('simple-cases-list')).toContainText('German Format - 12,35 BTC')
})

test('will convert if enabled after page load', async ({ context, extensionId }) => {
  const { page, popupPage } = await getPages(context, extensionId)

  await expect(page.getByTestId('simple-cases-list')).toContainText('German Format - 12,35 BTC')

  await popupPage.getByTestId('toggle').uncheck()

  await expect(page.getByTestId('simple-cases-list')).toContainText('German Format - 1.234.567,89 EUR')
})

test('will remove conversion if disabled after page load', async ({ context, extensionId }) => {
  const { page, popupPage } = await getPages(context, extensionId)

  await expect(page.getByTestId('simple-cases-list')).toContainText('German Format - 12,35 BTC')

  await popupPage.getByTestId('toggle').uncheck()

  await expect(page.getByTestId('simple-cases-list')).toContainText('German Format - 1.234.567,89 EUR')
})
