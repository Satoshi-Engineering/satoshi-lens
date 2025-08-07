let numbersRegex = "([0-9]+[0-9\\.\\,\\ ]*[0-9]+)";
let numbersSimpleRegex = "([0-9]+)";

let Editor = {};

window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

// Carefull, symbols must be regex compatible
Editor.currencies = {
    eur : {
        symbols : ["Euro", "EUR", "€"],
        prefixSymbols : ["€"],
        rate : -1
    },
    usd : {
        symbols : ["USD", "US Dollar", "U.S. Dollar", "\\$"],
        prefixSymbols : [],
        rate : -1
    },
}

Editor.init = (finished) => {
    browser.storage.sync.get(['rates'], function(result) {
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

Editor.getAllSymbolRegexes = () => {
    let allSymbols = [];
    for (const [key, currDef] of Object.entries(Editor.currencies)) {
        allSymbols.push(...currDef.symbols);
    }

    return "(" + allSymbols.join("|") + ")";
}

Editor.getSymbolRegex = (symbols) => {
    return "(" + symbols.join("|") + ")";
}

Editor.formatReplacement = (text) => {
    // Not Working because of textnodes
    return " " + text;
    //return `<span style="text-decoration: underline 2px darkorange solid">${text}</span>`;
}

Editor.replaced = 0;

Editor.remove = function(nodes) {
    for (const [activeCurreny, currDef] of Object.entries(Editor.currencies)) {
        Editor.removeForCurrency(nodes, activeCurreny);
    }
}

Editor.removeForCurrency = function(nodes, activeCurreny) {
    const currDef = Editor.currencies[activeCurreny];
    const rate = currDef.rate;

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var s = node.data;
        //console.log(`### Data: ${s}`);

        // ------------------------- Simple e.g. 12.000,00 (Symbol)
        function simpleReplacer(match, value, symbol) {
            //console.log(`match:${match} Value:${value} Symbol:${symbol}`);

            let faitValue = Converter.parseNumber(value);
            let btcValue = Converter.toBTC(faitValue, rate);
            Editor.replaced++;

            return Editor.formatReplacement(btcValue);
        };

        const simpleRegex = new RegExp(numbersRegex + " " + Editor.getSymbolRegex(currDef.symbols),'gm');
        s = s.replace(simpleRegex, simpleReplacer);

        const simpleSimpleRegex = new RegExp(numbersSimpleRegex + " " + Editor.getSymbolRegex(currDef.symbols),'gm');
        s = s.replace(simpleSimpleRegex, simpleReplacer);

        // ------------------------- Substantive
        function substantiveReplacer (match, value, substantive, symbol) {
            //console.log(`Value:${value} Sub:${substantive} Symbol:${symbol}`);

            let faitValue = Converter.parseNumber(value);
            //console.log(`faitValue:${faitValue}`);

            if (substantive.toLowerCase().includes("mio."))     faitValue = faitValue * 1000000.0;
            if (substantive.toLowerCase().includes("millio"))   faitValue = faitValue * 1000000.0;

            if (substantive.toLowerCase().includes("mrd."))     faitValue = faitValue * 1000000000.0;
            if (substantive.toLowerCase().includes("millia"))   faitValue = faitValue * 1000000000.0;

            if (substantive.toLowerCase().includes("bio."))     faitValue = faitValue * 1000000000000.0;
            if (substantive.toLowerCase().includes("billio"))   faitValue = faitValue * 1000000000000.0;

            if (substantive.toLowerCase().includes("brd."))   faitValue = faitValue * 1000000000000000.0;
            if (substantive.toLowerCase().includes("billia"))   faitValue = faitValue * 1000000000000000.0;

            let btcValue = Converter.toBTC(faitValue, rate);
            Editor.replaced++;

            return Editor.formatReplacement(btcValue);
        }

        // Substantive
        const substantiveRegex = new RegExp(numbersRegex + " ([a-zA-Z\.]+) " + Editor.getSymbolRegex(currDef.symbols),'gm');
        s = s.replace(substantiveRegex, substantiveReplacer);

        // Substantive & Simple Number
        const substantiveSimpleRegex = new RegExp(numbersSimpleRegex + " ([a-zA-Z\.]+) " + Editor.getSymbolRegex(currDef.symbols),'gm');
        s = s.replace(substantiveSimpleRegex, substantiveReplacer);

        // ------------------------- Prefix Symbols
        function prefixReplacer(match, symbol, value) {
            //console.log(`Match:${match} Value:${value} Symbol:${symbol}`);

            let faitValue = Converter.parseNumber(value);
            let btcValue = Converter.toBTC(faitValue, rate);
            Editor.replaced++;

            return Editor.formatReplacement(btcValue);
        };

        if (currDef.prefixSymbols.length > 0) {
            const prefixRegex = new RegExp(Editor.getSymbolRegex(currDef.prefixSymbols) + "\\ ?" + numbersRegex,'gm');
            s = s.replace(prefixRegex, prefixReplacer);

            const prefixSimpleRegex = new RegExp(Editor.getSymbolRegex(currDef.prefixSymbols) + "\\ ?" + numbersSimpleRegex,'gm');
            s = s.replace(prefixSimpleRegex, prefixReplacer);
        }

        if (node.data !== s) {
            node.data = s;
        }
    }
}

Editor.textNodesUnder = function(el) {
    const currRegex = new RegExp(Editor.getAllSymbolRegexes(),'m');

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
