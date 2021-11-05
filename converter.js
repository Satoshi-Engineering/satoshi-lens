let Converter = {};

Converter.parseNumber = (input) => {
    let text = input.trim();

    let dotIndex = text.lastIndexOf(".");
    let commaIndex = text.lastIndexOf(",");

    // French Format
    text = text.replaceAll(" ", "");

    // US
    if (dotIndex > commaIndex) {
        text = text.replaceAll(",", "");
    }

    // German
    if (commaIndex > dotIndex) {
        text = text.replaceAll(".", "");
        text = text.replaceAll(",", ".");
    }

    let output = parseFloat(text);
    //console.log(`Converter.parseNumber Input: ${input} to ${text} to ${output}`);

    return output;
}

Converter.toBTC = (currency, factor) => {
    let value = currency / factor;
    let digits = 2;
    let symbol = "BTC";

    // If smaller then 1 Million Satoshis
    if (value < 0.01) {
        value *= 100000000.0;
        if (value >= 1) digits = 0;
        symbol = "Satoshi";
    }

    if (value >= 10000) digits = 0;

    if (value >= 1000000000000) {
        value /= 1000000000000.0;

        symbol = "Bio. " + symbol;
        digits = 2;
    }

    if (value >= 1000000000) {
        value /= 1000000000.0;

        symbol = "Mrd. " + symbol;
        digits = 2;
    }

    if (value >= 1000000) {
        value /= 1000000.0;

        symbol = "Mio. " + symbol;
        digits = 2;
    }

    let valueText = value.toLocaleString('de-DE', {minimumFractionDigits: digits, maximumFractionDigits: digits});

    return valueText + " " + symbol;
}
