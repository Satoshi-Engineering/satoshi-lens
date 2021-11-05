let numbersRegex = "([0-9]+[0-9\\.\\,\\ ]*[0-9]+)";

let Editor = {};

Editor.currencies = {
    eur : {
        symbols : ["Euro", "EUR", "€", "USD", "Dollar"],
        rate : -1
    },
    usd : {
        symbols : ["USD", "US Dollar", "U.S. Dollar"],
        rate : -1
    },
}

Editor.init = (finished) => {
    chrome.storage.sync.get(['rates'], function(result) {
        const ratesKeys = Object.keys(result.rates);
        for (const [key, curr] of Object.entries(Editor.currencies)) {
            if (ratesKeys.includes(key)) {
                Editor.currencies[key].rate = result.rates[key];
            }
        }
        console.log(Editor.currencies );
        finished();
    });
}


Editor.getSymbolRegex = (symbols) => {
    return "(" + symbols.join("|") + ")";
}

Editor.getRateBySymbol = (symbol) => {
    for (const [key, curr] of Object.entries(Editor.currencies)) {
        if (curr.symbols.includes(symbol)) return curr.rate;
    }

    return false;
}

Editor.formatReplacement = (text) => {
    // Not Working because of textnodes
    return text;
    //return `<span style="text-decoration: underline 2px darkorange solid">${text}</span>`;
}

Editor.replaced = 0;
Editor.remove = function(nodes) {
    const activeCurreny = "eur";

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var s = node.data;
        //console.log(`### Data: ${s}`);

        const currDef = Editor.currencies[activeCurreny];

        // Simple e.g. 12.000,00 (Symbol)
        const simpleRegex = new RegExp(numbersRegex + " " + Editor.getSymbolRegex(currDef.symbols),'gm');
        s = s.replace(simpleRegex, function(match, value, symbol) {
            //console.log(`Value:${value} Symbol:${symbol}`);

            let rate = Editor.getRateBySymbol(symbol);
            if (rate === false) {
                console.error(`Couldn't find the symbol: ${symbol} in currency dictionary!`);
                return match;
            }
            let faitValue = Converter.parseNumber(value);
            let btcValue = Converter.toBTC(faitValue, rate);
            Editor.replaced++;

            return Editor.formatReplacement(btcValue);
        });

        // Substantive
        const substantiveRegex = new RegExp(numbersRegex + " ([a-zA-Z]+) " + Editor.getSymbolRegex(currDef.symbols),'gm');
        s = s.replace(substantiveRegex, function(match, value, substantive, symbol) {
            //console.log(`Value:${value} Sub:${substantive} Symbol:${symbol}`);
            let rate = Editor.getRateBySymbol(symbol);
            if (rate === false) {
                console.error(`Couldn't find the symbol: ${symbol} in currency dictionary!`);
                return match;
            }
            let faitValue = Converter.parseNumber(value);
            //console.log(`faitValue:${faitValue}`);

            if (substantive.toLowerCase().includes("millio")) faitValue = faitValue * 1000000.0;
            if (substantive.toLowerCase().includes("millia")) faitValue = faitValue * 1000000000.0;
            if (substantive.toLowerCase().includes("billio")) faitValue = faitValue * 1000000000000.0;
            if (substantive.toLowerCase().includes("billia")) faitValue = faitValue * 1000000000000000.0;

            let btcValue = Converter.toBTC(faitValue, rate);
            Editor.replaced++;

            return Editor.formatReplacement(btcValue);
        });

        if (node.data !== s) {
            node.data = s;
        }
    }
}

Editor.textNodesUnder = function(el) {
    const activeCurreny = "eur";
    const currDef = Editor.currencies[activeCurreny];
    const currRegex = new RegExp(Editor.getSymbolRegex(currDef.symbols),'m');

    let n;
    let result = [];

    // https://developer.mozilla.org/en-US/docs/Web/API/Document/createTreeWalker
    let walker = document.createTreeWalker(
        el,
        NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                //Nodes mit weniger als 5 Zeichen nicht filtern

                if (node.textContent.length < 5) {
                    return NodeFilter.FILTER_REJECT;
                } else {
                    var isUntreatedElement = node.parentNode ? (node.parentNode instanceof HTMLInputElement || node.parentNode instanceof HTMLTextAreaElement || node.parentNode instanceof HTMLScriptElement || node.parentNode instanceof HTMLStyleElement || node.parentNode.nodeName == "CODE" || node.parentNode.nodeName == "NOSCRIPT") : false;
                    var isDivTextbox = (document.activeElement.getAttribute("role") == "textbox" || document.activeElement.getAttribute("contenteditable") == "true") && document.activeElement.contains(node);

                    //Eingabeelemente, <script>, <style>, <code>-Tags nicht filtern
                    if (isUntreatedElement || isDivTextbox) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    //Nur Nodes erfassen, deren Inhalt ungefähr zur späteren Verarbeitung passt
                    else if (currRegex.test(node.textContent)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            }
        },
        false);
    while (node = walker.nextNode()) result.push(node);
    return result;
}
