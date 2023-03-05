/*
    Functions specific to Chrome

    This file is copy-pasted in popup.js
    Therefore, a special attention to variable names is needed.

    These functions differs from their Firefox counterpart as the API for storing data is slightly different
    and because shortcuts are different
*/

document.getElementById("short_open_mattalx").textContent = "Ctrl+M : Open/Close MatTalX";
document.getElementById("short_copy_input").textContent = "Alt+I : Copy input (first box)";
document.getElementById("short_copy_output").textContent = "Alt+O : Copy ouput (second box)";
document.getElementById("short_open_suggestions").textContent = "Alt+S : Open/Close suggestions";

window.addEventListener("blur", () => {
    // Saves the text in the first box so it doesn't disappear if you change page or close MatTalX
    chrome.storage.sync.set({"box1" : textIn.value});
    chrome.storage.sync.set({"spaces" : spacesButton.checked});
    chrome.storage.sync.set({"font" : changeFontButton.checked});
    chrome.storage.sync.set({"mode" : changeModeButton.checked});
});

window.addEventListener("focus", () => {
    // Retreives the text when the popup reopens
    chrome.storage.sync.get(["box1"], (text) => {
        if (text.box1 !== undefined) {
            textIn.value = text.box1;
        };
    });
    chrome.storage.sync.get(["spaces"], (button) => {
        // Default is true
        if (button.spaces === false) {
            spacesButton.checked = false;
        };
    });
    chrome.storage.sync.get(["font"], (button) => {
        // Default is true
        if (button.font === false) {
            changeFontButton.checked = false;
        };
    });
    chrome.storage.sync.get(["mode"], (button) => {
        // Default is true
        if (button.mode === false) {
            changeModeButton.checked = false;
        };
    });
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

window.addEventListener("click", (event) => {
    // Closes the suggestion popup if the users clicks anywhere except on the suggestion popup itself or input box
    if (suggestionsPopup.style.display === "inline-block") {
        if ((event.target.id !== "text_in") && (event.target.id !== "suggestionsBtn")) {
            closeSuggestions();
        };
    };
});

document.addEventListener("keydown", (keyPressed) => {
    // Listens for Alt+S to show suggestions, Alt+I to copy text of the first box (input) and Alt+O to copy text in the second box (output)
    if ((keyPressed.key === "s") && keyPressed.altKey && (textIn == document.activeElement)) {
        // Alt+S to shows suggestions but closes the popup if the suggestion box is already opened
        getSuggestion();
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
            } else if ((keyPressed.code === "Space") || (keyPressed.code === "Tab")) {
                closeSuggestions();
            } else if (keyPressed.key.length === 1) {  // i.e. A letter
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
