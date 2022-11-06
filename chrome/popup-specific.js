
// Functions specific to Chrome

window.addEventListener("blur", () => {
    // Saves the text in the first box so it doesn't disappear if you change page or close MatTalX
    chrome.storage.sync.set({"box1" : document.getElementById("text_in").value});
    chrome.storage.sync.set({"check" : spacesButton.checked});
});

window.addEventListener("focus", () => {
    // Retreives the text when the popup reopens
    const textIn = document.getElementById("text_in");
    chrome.storage.sync.get(["box1"], (text) => {
        if (text.box1 !== undefined) {
            textIn.value = text.box1;
        };
    });
    chrome.storage.sync.get(["check"], (button) => {
        // Default is true
        if (button.check === false) {
            spacesButton.checked = false;
        };
    })
    textIn.focus();
});

window.addEventListener("DOMContentLoaded", () => {
    // Listens for 'message' from background.js
    const manifest = chrome.runtime.getManifest();
    chrome.storage.local.get("reason", (details) => {
        if (details.reason === "install") {
            firstMessage(manifest.version);
        } else if (details.reason === "update") {
            updateMessage(manifest.version);
        };
    });
    chrome.storage.local.remove("reason");
});

document.addEventListener("keydown", (keyPressed) => {
    // Listens for Alt+S to show suggestions, Alt+I to copy text of the first box (input) and Alt+O to copy text in the second box (output)
    const textIn = document.getElementById("text_in");
    if ((keyPressed.key === "s") && keyPressed.altKey && (textIn == document.activeElement)) {
        // Alt+S to shows suggestions but closes the popup if the suggestion box is already opened
        if (suggestionsPopup.style.display !== "inline-block") { 
            suggestionsPopup.textContent = "";
            let word = findWord(textIn.value, (textIn.selectionEnd - 1));
            suggestionsPopup.style.display = "inline-block";
            suggestions(word);
        } else {
            closeSuggestions();
        };
    } else if ((keyPressed.key === "i") && keyPressed.altKey) {
        copyTextIn();
    } else if ((keyPressed.key === "o") && keyPressed.altKey) {
        copyTextOut();
    } else {
        // If any key is pressed while the suggestion popup is opened, it adjusts the suggestions
        // The word must be adjusted "by hand" because the eventListener is synchronous
        if (suggestionsPopup.style.display === "inline-block") {
            if (keyPressed.key === "Backspace") {
                suggestionsPopup.textContent = "";
                let word = findWord(textIn.value, textIn.selectionEnd - 1, "Backspace");
                suggestions(word);
            } else if (keyPressed.key.length === 1) {
                suggestionsPopup.textContent = "";
                let word = findWord(textIn.value, textIn.selectionEnd - 1, keyPressed.key);
                suggestions(word);
            } else if ((keyPressed.key === "ArrowUp") || (keyPressed.key === "ArrowRight") || (keyPressed.key === "ArrowLeft") || (keyPressed.key === "ArrowDown")) {
                suggestionsPopup.textContent = "";
                const arrows = {"ArrowUp": 0, "ArrowRight": 1, "ArrowLeft": -1, "ArrowDown": 0};
                let word = findWord(textIn.value, (textIn.selectionEnd - 1 + arrows[keyPressed.key]));  // Only adjusts the cursor position for right and left arrows
                suggestions(word);
            } else if ((keyPressed.code === "Space") || (keyPressed.code === "Tab")) {
                closeSuggestions();
            };
        };
    };
});
