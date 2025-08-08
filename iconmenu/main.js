async function loaded() {
    chrome.storage.sync.get(['rates'], function(result) {
        console.log(result.rates);

        const updatedDate = new Date(result.rates.update);
        const datetimeText = updatedDate.getDate() + "." + (updatedDate.getMonth()+1)
            + "." + updatedDate.getFullYear() + " "
            + updatedDate.getHours() + ":"
            + updatedDate.getMinutes() + ":" + updatedDate.getSeconds();

        document.getElementById("updated").innerText = datetimeText;

        const listDiv = document.getElementById("list");
        for (const [key, rate] of Object.entries(result.rates)) {
            if (key === "update") continue;

            var div = document.createElement("div");
            div.innerText = rate.toLocaleString('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " " + key.toUpperCase();
            listDiv.appendChild(div);
        }
    });

    initToggle();
}

const initToggle = async () => {
    const toggle = document.getElementById('toggle')

    // Load saved state
    const { enabled = true } = await chrome.storage.sync.get('enabled')
    toggle.checked = enabled

    // Listen for toggle changes
    toggle.addEventListener('change', async () => {
      await chrome.storage.sync.set({ enabled: toggle.checked })
      chrome.runtime.sendMessage({ type: 'TOGGLE_EXTENSION', enabled: toggle.checked })
    })
}

document.addEventListener('DOMContentLoaded', loaded);
