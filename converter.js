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
    let digits = 2;

    // If smaller then 1 Million Satoshis
    if (btc >= 0.01) {
        let btcText = btc.toLocaleString('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: digits});
        return btcText + " BTC";
    } else {
        let sats = btc * 100000000.0;
        if (sats >= 1) digits = 0;
        sats = sats.toLocaleString('de-DE', {minimumFractionDigits: 0, maximumFractionDigits: digits});
        return sats + " Satoshi";
    }
}
