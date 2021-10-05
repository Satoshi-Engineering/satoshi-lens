console.log("Content Script");

document.hmbtc = {};


let currencies = {
    eur : 37181.49,
    usd : 43039.42
}

let parseNumber = (text) => {
    console.log("parseNumber Input: " + text);
    text = text.trim();
    if (text.indexOf(",") >= text.length - 3) {
        text = text.replace(".", "");
        text = text.replace(",", ".");
    }

    return parseFloat(text);
}

let convertToBTC = (number) => {
    let btc = number / currencies["eur"];
    btc = btc.toFixed(2);
    return btc + " BTC";
}

let formatDict = [];
let formatSimple = {
    regex : /[0-9\.\,]+ euro[\ \.\,\!\?]/gmi,
    value : "eur",
    convert : (text) => {
        text = text.trim();
        text = text.split(" ");
        text = text[0];
        let number = parseNumber(text);
        return number;
    }
}
formatDict.push(formatSimple);

let formatWithWord = {
    regex : /[0-9]+[0-9\.\,]*[0-9]+ (?:[a-zA-Z]+\ )euro[\ \.\,\!\?]/gmi,
    value : "eur",
    convert : (text) => {
        //return false;

        text = text.trim();
        text = text.split(" ");
        let word = text[1].toLowerCase();
        console.log("Substantive " + word);
        text = text[0];

        let number = parseNumber(text);

        if (word.includes("millio")) number = number * 1000000;
        if (word.includes("millia")) number = number * 1000000000;
        if (word.includes("billio")) number = number * 1000000000000;
        if (word.includes("billia")) number = number * 1000000000000000;

        return number;
    }
}
formatDict.push(formatWithWord);

$("*").filter(function() {
    let element = $(this);

    if (element.children().length !== 0) return false;
    if (element.prop("tagName") == "SCRIPT") return false;
    if (element.prop("tagName") == "STYLE") return false;
    if (element.prop("tagName") == "BR") return false;
    if (element.prop("tagName") == "IFRAME") return false;
    if (element.prop("tagName") == "META") return false;
    if (element.prop("tagName") == "NOSCRIPT") return false;
    if (element.prop("tagName") == "svg") return false;

    if (element.html().includes("<script")) return false;

    formatDict.forEach(format => {
        let matches = element.html().matchAll(format.regex);
        matches = [...matches];
        if (matches.length <= 0) return true;

        let sizechange = 0;

        console.log("ELEMENT FOUND -------");
        console.log(element.html());
        for (let i = 0; i < matches.length; ++i) {
            let match = matches[i];
           console.log(match[0]);
           let value = format.convert(match[0]);
           if (value == false) continue;

           console.log(value);
           let btc = convertToBTC(value);
           console.log(btc);

           let btctext = `<span style="text-decoration: underline 2px darkorange solid">${btc}</span>`;
           btctext+= " ";

           let text = "";
           text = element.html().substring(0, match.index + sizechange);
           text+= btctext;
           text+= element.html().substring(match.index + sizechange + match[0].length);

           element.html(text);

           sizechange += btctext.length - match[0].length;
        };
        console.log(element.html());
        console.log("ELEMENT DONE -------");
    });
    return false;
});
