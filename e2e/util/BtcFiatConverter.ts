export class BtcFiatConverter {
  private rates: Record<'EUR' | 'USD', number>

  constructor(rates: Record<'EUR' | 'USD', number>) {
    this.rates = rates
  }
  
  public eurToBtc(value: number) { return value / this.rates.EUR }

  public eurToSats(value: number) { return (value / this.rates.EUR) * 100_000_000 }

  public usdToBtc(value: number) { return value / this.rates.USD }

  public usdToSats(value: number) { return (value / this.rates.USD) * 100_000_000 }
}
