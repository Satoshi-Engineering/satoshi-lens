const fetchRateBtcFiat = async () => {
  const response = await fetch('https://api.kraken.com/0/public/Ticker?pair=BTCEUR,BTCUSD').then(r => r.json())
  return {
    EUR: parseFloat(response.result.XXBTZEUR.c[0]),
    USD: parseFloat(response.result.XXBTZUSD.c[0]),
  }
}

let rates: Record<'EUR' | 'USD', number> | null = null

export const loadRateBtcFiat = async () => {
  if (!rates) {
    rates = await fetchRateBtcFiat()
  }
  return rates
}
