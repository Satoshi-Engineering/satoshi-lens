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
    let btc = currency / factor;

    // If smaller then 1 Million Satoshis
    if (btc >= 0.01) {
        btc = btc.toLocaleString('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: 2});

        return btc + " BTC";
    } else {

        btc *= 100000000.0;
        btc = btc.toLocaleString('de-DE', {minimumFractionDigits: 0, maximumFractionDigits: 0});
        return btc + " Satoshi";
    }
}
