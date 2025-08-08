console.log("HMTBC Running");
window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

let nodes = [];

function start() {
    // Entfernen bei erstem Laden der Seite
    let nodes = Editor.textNodesUnder(document);
    Editor.remove(nodes);

    //Entfernen bei Seitenänderungen
    try {
        var observer = new MutationObserver(function(mutations) {
            let insertedNodes = [];
            mutations.forEach(function(mutation) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    insertedNodes = insertedNodes.concat(Editor.textNodesUnder(mutation.addedNodes[i]));
                }
            });

            console.log(`Found Mutations: ${insertedNodes.length}`);
            Editor.remove(insertedNodes);
        });
        observer.observe(document, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    } catch (e) {
        console.error(e);
        chrome.runtime.sendMessage({
            action: 'error',
            page: document.location.hostname,
            source: 'content-script.js',
            error: e
        });
    }
}

const initEditor = () => {
  Editor.init(() => start());
}

chrome.storage.sync.get('enabled', ({ enabled = true }) => {
  if (enabled) {
    initEditor();
  }
})

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    window.location.reload();
  }
});
