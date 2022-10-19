
// Functions specific to Chrome

// Saves the text in the first box so it doesn't disappear if you change page or close MatTalX
window.addEventListener("blur", () => {
    chrome.storage.sync.set({"box1" : document.getElementById("text_in").value});
    chrome.storage.sync.set({"check" : spacesButton.checked});
});

// Retreives the text when the popup reopens
window.addEventListener("focus", () => {
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

// Listens for 'message' from background.js
window.addEventListener("DOMContentLoaded", () => {
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

// Listens for Alt+S to show suggestions, Alt+I to copy text of the first box (input) and Alt+O to copy text in the second box (output)
document.addEventListener("keydown", (keyPressed) => {
    const textIn = document.getElementById("text_in");
    // Alt+S to shows suggestions but closes the popup if the suggestion box is already opened
    if ((keyPressed.key === "s") && keyPressed.altKey && (textIn == document.activeElement)) {
        if (suggestionsPopup.style.display !== "inline-block") { 
            suggestionsPopup.textContent = "";
            let word = findWord(textIn.value, (textIn.selectionEnd - 1));
            suggestionsPopup.style.display = "inline-block";
            suggestions(word);
        } else {
            closeSuggestions();
        };
    } else if (((keyPressed.code === "Space") || (keyPressed.code === "Tab")) && (suggestionsPopup.style.display === "inline-block")) {
        closeSuggestions();
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
            };
        };
    };
});
