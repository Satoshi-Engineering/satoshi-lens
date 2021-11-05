const ALARM_RATES = "ratesRefresh";
const currencies = {
    "eur": {
        "kraken" : "https://api.kraken.com/0/public/Ticker?pair=BTCEUR"
        },
    "usd": {
        "kraken" : "https://api.kraken.com/0/public/Ticker?pair=BTCUSD"
    }
};

let storageRates = {
    update: Date.now()
};

function updateRates() {
    console.log(`Starting Rate Update!`);
    let updateIndex = 0;

    function nextRate() {
        const keys = Object.keys(currencies);
        if (updateIndex >= keys.length) {
            console.log(`Currency Rate Update finished!`);
            return;
        }

        let activeCurrency = keys[updateIndex];
        getCurrentRate(activeCurrency, currencies[activeCurrency]);
        updateIndex++;
    }

    function saveCurrentRate(currencyKey, rate) {
        console.log(`Saving Rate ${rate} for ${currencyKey}`);
        const rateAsNumber = parseFloat(rate);
        storageRates[currencyKey] = rateAsNumber;
        storageRates.update = Date.now()

        chrome.storage.sync.set({ rates: storageRates}, function() {
            console.log(`Saved Rate ${rateAsNumber} for ${currencyKey}`);
        });

        nextRate();
    }

    function getCurrentRate(currencyKey, config) {
        if (config.kraken) {
            var requestOptions = { method: 'GET' };

            fetch(config.kraken, requestOptions)
                .then(response => response.text())
                .then(result => {
                    const data = JSON.parse(result);
                    const keys = Object.keys(data.result);
                    const rate = data.result[keys[0]].c[0];
                    saveCurrentRate(currencyKey, rate);
                }).catch(error => console.error(`Error getting ${currencyKey}`, error));
        }
    }

    // Start
    nextRate();
}

//chrome.storage.onChanged.addListener(updateSettings);
chrome.runtime.onInstalled.addListener(() => {
    console.log('HMBTC Installed!');
    chrome.alarms.create(ALARM_RATES, { periodInMinutes: 1 });
    updateRates();
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === ALARM_RATES) {
        updateRates();
    }
});
