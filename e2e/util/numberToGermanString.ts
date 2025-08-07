export const numberToGermanString = (value: number, digits = 2) => {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}
