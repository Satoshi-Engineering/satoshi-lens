import { test, expect } from './util/fixtures'

test('converts german nouns for large numbers to bitcoin', async ({ page, btcFiatRates }) => {
  await page.goto('http://localhost:4173/hmbtc-tests')

  await expect(page.getByTestId('nouns-mio-short')).toContainText('Ein Betrag von 10,00 BTC ist abhanden gekommen.')
  await expect(page.getByTestId('nouns-mio-long')).toContainText('Ein Betrag von 20,00 BTC ist abhanden gekommen.')
  await expect(page.getByTestId('nouns-mrd-long')).toContainText('wiederhole 144.001 BTC\'s')
  await expect(page.getByTestId('nouns-mrd-short')).toContainText('oder kurz 144.001 BTC.')
  await expect(page.getByTestId('nouns-bio-long')).toContainText('25,00 Mio. BTC sind ganz schön viel Geld.')
  await expect(page.getByTestId('nouns-bio-short')).toContainText('Man kann auch sagen: 25,00 Mio. BTCs.')
  await expect(page.getByTestId('nouns-brd-long')).toContainText('Herr Müller hat 10,00 Mio. BTCs')
  await expect(page.getByTestId('nouns-brd-short')).toContainText('kurz 10,00 Mio. BTC')
  await expect(page.getByTestId('nouns-mrd-short-usd')).toContainText('4,4 und 43.200 BTC nach zuvor 48.600 BTC.')
})

test('converts patterns like und/von/of', async ({ page, btcFiatRates }) => {
  await page.goto('http://localhost:4173/hmbtc-tests')

  await expect(page.getByTestId('n-und-n')).toContainText('4,4 und 43.200 BTC')
  await expect(page.getByTestId('n-von-n')).toContainText('4,4 von 4.800 Satoshi\'s')
  await expect(page.getByTestId('n-of-n')).toContainText('4,4 of 43,20 Mio. BTC')
})

test('converts the pattern €XX', async ({ page, btcFiatRates }) => {
  await page.goto('http://localhost:4173/hmbtc-tests')

  await expect(page.getByTestId('euro-xx')).toContainText('an amount of 30.000 Satoshi (ohne Zwischenraum)')
})
