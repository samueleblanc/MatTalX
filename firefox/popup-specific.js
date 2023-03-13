/*
    Functions specific to Firefox
    
    This file is copy-pasted in popup.js
    Therefore, a special attention to variable names is needed.

    These functions differs from their Chrome counterpart as the API for storing data is slightly different
*/

window.addEventListener("blur", () => {
    // Saves the text in the first box so it doesn't disappear if you change page or close MatTalX
    browser.storage.local.set({
        "box1" : textIn.value,
        "spaces" : spacesButton.checked,
        "font" : changeFontButton.checked,
        "mode" : changeModeButton.checked,
        "font_size" : fontSize.value,
        "copy_input_key" : setCopyInputKey.value,
        "copy_input_letter" : setCopyInputLetter.value,
        "copy_output_key" : setCopyOutputKey.value,
        "copy_output_letter" : setCopyOutputLetter.value,
        "completion_key" : setCompletionKey.value,
        "completion_letter" : setCompletionLetter.value
    });
});

window.addEventListener("focus", () => {
    // Retreives the text when the popup reopens
    browser.storage.local.get("box1", (text) => {
        if (text.box1 !== undefined) {
            textIn.value = text.box1;
        };
    });
    browser.storage.local.get("spaces", (button) => {
        // Default is true
        if (button.spaces === false) {
            spacesButton.checked = false;
        };
    });
    browser.storage.local.get("font", (button) => {
        // Default is true
        if (button.font === false) {
            changeFontButton.checked = false;
        };
    });
    browser.storage.local.get("mode", (button) => {
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
    const manifest = browser.runtime.getManifest();
    browser.storage.local.get("reason", (details) => {
        if (details.reason === "install") {
            firstMessage(manifest.version);
        } else if (details.reason === "update") {
            updateMessage(manifest.version);
        };
    });
    browser.storage.local.remove("reason");
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
    browser.storage.local.get("font_size", (text) => {
        if (text.font_size !== undefined) {
            fontSize.value = text.font_size;
        };
    });
    browser.storage.local.get("copy_input_key", (text) => {
        if (text.copy_input_key !== undefined) {
            setCopyInputKey.value = text.copy_input_key;
        };
    });
    browser.storage.local.get("copy_input_letter", (text) => {
        if (text.copy_input_letter !== undefined) {
            setCopyInputLetter.value = text.copy_input_letter;
        };
    });
    browser.storage.local.get("copy_output_key", (text) => {
        if (text.copy_output_key !== undefined) {
            setCopyOutputKey.value = text.copy_output_key;
        };
    });
    browser.storage.local.get("copy_output_letter", (text) => {
        if (text.copy_output_letter !== undefined) {
            setCopyOutputLetter.value = text.copy_output_letter;
        };
    });
    browser.storage.local.get("completion_key", (text) => {
        if (text.completion_key !== undefined) {
            setCompletionKey.value = text.completion_key;
        };
    });
    browser.storage.local.get("completion_letter", (text) => {
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

    browser.storage.local.set({
        "font_size" : fontSize.value,
        "copy_input_key" : setCopyInputKey.value,
        "copy_input_letter" : setCopyInputLetter.value,
        "copy_output_key" : setCopyOutputKey.value,
        "copy_output_letter" : setCopyOutputLetter.value,
        "completion_key" : setCompletionKey.value,
        "completion_letter" : setCompletionLetter.value
    });

    writeSettings();

    settingsBox.style.display = "none";
};