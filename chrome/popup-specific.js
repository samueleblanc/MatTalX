/*
    Functions specific to Chrome

    This file is copy-pasted in popup.js
    Therefore, a special attention to variable names is needed.

    These functions differs from their Firefox counterpart as the API for storing data is slightly different
*/

window.addEventListener("blur", () => {
    // Saves the text in the first box so it doesn't disappear if you change page or close MatTalX
    chrome.storage.sync.set({"box1" : textIn.value});
    chrome.storage.sync.set({"spaces" : spacesButton.checked});
    chrome.storage.sync.set({"font" : changeFontButton.checked});
    chrome.storage.sync.set({"mode" : changeModeButton.checked});
    chrome.storage.sync.set({"font_size" : fontSize.value});
    chrome.storage.sync.set({"copy_input_key" : setCopyInputKey.value});
    chrome.storage.sync.set({"copy_input_letter" : setCopyInputLetter.value});
    chrome.storage.sync.set({"copy_output_key" : setCopyOutputKey.value});
    chrome.storage.sync.set({"copy_output_letter" : setCopyOutputLetter.value});
    chrome.storage.sync.set({"completion_key" : setCompletionKey.value});
    chrome.storage.sync.set({"completion_letter" : setCompletionLetter.value});
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
    getSettings();
    writeSettings();
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
    } else if (settingsBox.style.display === "block") {
        if (event.target.id === "settingsBox") {
            closeSettings();
        };
    };
});

function getSettings() {
    chrome.storage.sync.get(["font_size"], (text) => {
        if (text.font_size !== undefined) {
            fontSize.value = text.font_size;
        };
    });
    chrome.storage.sync.get(["copy_input_key"], (text) => {
        if (text.copy_input_key !== undefined) {
            setCopyInputKey.value = text.copy_input_key;
        };
    });
    chrome.storage.sync.get(["copy_input_letter"], (text) => {
        if (text.copy_input_letter !== undefined) {
            setCopyInputLetter.value = text.copy_input_letter;
        };
    });
    chrome.storage.sync.get(["copy_output_key"], (text) => {
        if (text.copy_output_key !== undefined) {
            setCopyOutputKey.value = text.copy_output_key;
        };
    });
    chrome.storage.sync.get(["copy_output_letter"], (text) => {
        if (text.copy_output_letter !== undefined) {
            setCopyOutputLetter.value = text.copy_output_letter;
        };
    });
    chrome.storage.sync.get(["completion_key"], (text) => {
        if (text.completion_key !== undefined) {
            setCompletionKey.value = text.completion_key;
        };
    });
    chrome.storage.sync.get(["completion_letter"], (text) => {
        if (text.completion_letter !== undefined) {
            setCompletionLetter.value = text.completion_letter;
        };
    });
};

function openSettings() {
    if ((settingsBox.style.display === "none") || (settingsBox.style.display === "")) {
        getSettings();
        settingsBox.style.display = "block";
    };
};

function closeSettings() {
    verifySettings(fontSize.value, "font");
    verifySettings(setCopyInputLetter.value, "letter");
    verifySettings(setCopyOutputLetter.value, "letter");
    verifySettings(setCompletionLetter.value, "letter");

    chrome.storage.sync.set({"font_size" : fontSize.value});
    chrome.storage.sync.set({"copy_input_key" : setCopyInputKey.value});
    chrome.storage.sync.set({"copy_input_letter" : setCopyInputLetter.value});
    chrome.storage.sync.set({"copy_output_key" : setCopyOutputKey.value});
    chrome.storage.sync.set({"copy_output_letter" : setCopyOutputLetter.value});
    chrome.storage.sync.set({"completion_key" : setCompletionKey.value});
    chrome.storage.sync.set({"completion_letter" : setCompletionLetter.value});
    
    writeSettings();

    settingsBox.style.display = "none";
};