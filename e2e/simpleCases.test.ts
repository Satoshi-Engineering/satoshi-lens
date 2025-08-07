import { BtcFiatConverter } from './util/BtcFiatConverter'
import { test, expect } from './util/fixtures'
import { numberToGermanString as $n } from './util/numberToGermanString'

test('simple cases - list', async ({ page, btcFiatRates }) => {
  const converter = new BtcFiatConverter(btcFiatRates)
  await page.goto('http://localhost:4173/hmbtc-tests')
  
  await expect(page.getByTestId('simple-cases-list')).toContainText(`German Format - ${$n(converter.eurToBtc(1234567.89))} BTC`)
  await expect(page.getByTestId('simple-cases-list')).toContainText(`US Format - ${$n(converter.eurToBtc(1234567.89))} BTC`)
  await expect(page.getByTestId('simple-cases-list')).toContainText(`German Small -  ${$n(converter.eurToSats(567.89), 0)} Satoshi`)
  await expect(page.getByTestId('simple-cases-list')).toContainText(`US Small -  ${$n(converter.eurToSats(567.89), 0)} Satoshi`)
  await expect(page.getByTestId('simple-cases-list')).toContainText(`German Format 4 Nachkommastellen -  ${$n(converter.eurToSats(0.0005))} Satoshi`)
  await expect(page.getByTestId('simple-cases-list')).toContainText(`US 4 Nachkommastellen -  ${$n(converter.eurToSats(0.0005))} Satoshi`)

  await expect(page.getByTestId('simple-cases-list')).toContainText(`French Format -  ${$n(converter.eurToBtc(1_234_567.89))} BTC`)
  await expect(page.getByTestId('simple-cases-list')).toContainText(`10k EUR -  ${$n(converter.eurToBtc(10000))} BTC`)
  await expect(page.getByTestId('simple-cases-list')).toContainText(`10k USD -  ${$n(converter.usdToBtc(10000))} BTC`)
  await expect(page.getByTestId('simple-cases-list')).toContainText(`10k EUR -  ${$n(converter.eurToBtc(10000))} BTC`)
  await expect(page.getByTestId('simple-cases-list')).toContainText(`10k USD -  ${$n(converter.usdToBtc(10000))} BTC`)

  await expect(page.getByTestId('simple-cases-list')).toContainText(`ein EUR -  ${$n(converter.eurToSats(1), 0)} Satoshi`)
  await expect(page.getByTestId('simple-cases-list')).toContainText(`ein USD -  ${$n(converter.usdToSats(1), 0)} Satoshi`)
  await expect(page.getByTestId('simple-cases-list')).toContainText(`ein Dollar -  ${$n(converter.usdToSats(1), 0)} Satoshi`)
})

test('simple cases - paragraph', async ({ page, btcFiatRates }) => {
  const converter = new BtcFiatConverter(btcFiatRates)
  await page.goto('http://localhost:4173/hmbtc-tests')
  
  await expect(page.getByTestId('simple-cases-paragraph')).toContainText(`zu wiederhole ${$n(converter.eurToBtc(14444))} BTC n. Wer im`)
  await expect(page.getByTestId('simple-cases-paragraph')).toContainText(`Wer im Monat brutto ${$n(converter.eurToBtc(10_300.33))} BTC verdient und nichts spart`)
  await expect(page.getByTestId('simple-cases-paragraph')).toContainText(`Absicherungen im ${$n(converter.eurToSats(1.00), 0)} Satoshi Falle der Erwerbsunfähigkeit`)
})
