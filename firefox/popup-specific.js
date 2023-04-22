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
        "font_family" : fontFamily.value,
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
    browser.commands.getAll().then(
        // Show the right shortcut used to open and close MatTalX
        // Function is different from the other since this shortcut can be modified from 
        // the browser settings, not directly from MatTalX
        (commands) => {
            if (commands[0].name == "_execute_browser_action") {
                textOpenMatTalX.textContent = commands[0].shortcut;
            };
        },
        () => {
            textOpenMatTalX.textContent = defaultSettings["open_mattalx_shortcut"];
        }
    );
    getSettings();
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
    // For settings in the Settings box
    browser.storage.local.get("font_size", (text) => {
        if (text.font_size !== undefined) {
            fontSize.value = text.font_size;
        } else {
            fontSize.value = defaultSettings["font_size"];
        };
        textIn.style.fontSize = fontSize.value.toString() + "px";
        textOut.style.fontSize = (parseInt(fontSize.value)+1).toString() + "px";
    });
    browser.storage.local.get("font_family", (text) => {
        if (text.font_family !== undefined) {
            fontFamily.value = text.font_family;
        } else {
            fontFamily.value = defaultSettings["font_family"];
        };
        textIn.style.fontFamily = fontFamily.value;
        textOut.style.fontFamily = fontFamily.value;
    });
    browser.storage.local.get("copy_input_key", (text) => {
        if (text.copy_input_key !== undefined) {
            setCopyInputKey.value = text.copy_input_key;
        } else {
            setCopyInputKey.value = defaultSettings["copy_input_key"];
        };
        textCopyInputKey.textContent = setCopyInputKey.value;
    });
    browser.storage.local.get("copy_input_letter", (text) => {
        if (text.copy_input_letter !== undefined) {
            setCopyInputLetter.value = text.copy_input_letter;
        } else {
            setCopyInputLetter.value = defaultSettings["copy_input_letter"];
        };
        textCopyInputLetter.textContent = setCopyInputLetter.value.toUpperCase();
    });
    browser.storage.local.get("copy_output_key", (text) => {
        if (text.copy_output_key !== undefined) {
            setCopyOutputKey.value = text.copy_output_key;
        } else {
            setCopyOutputKey.value = defaultSettings["copy_output_key"];
        };
        textCopyOutputKey.textContent = setCopyOutputKey.value;
    });
    browser.storage.local.get("copy_output_letter", (text) => {
        if (text.copy_output_letter !== undefined) {
            setCopyOutputLetter.value = text.copy_output_letter;
        } else {
            setCopyOutputLetter.value = defaultSettings["copy_output_letter"];
        };
        textCopyOutputLetter.textContent = setCopyOutputLetter.value.toUpperCase();
    });
    browser.storage.local.get("completion_key", (text) => {
        if (text.completion_key !== undefined) {
            setCompletionKey.value = text.completion_key;
        } else {
            setCompletionKey.value = defaultSettings["completion_key"];
        };
        textCompletionKey.textContent = setCompletionKey.value;
    });
    browser.storage.local.get("completion_letter", (text) => {
        if (text.completion_letter !== undefined) {
            setCompletionLetter.value = text.completion_letter;
        } else {
            setCompletionLetter.value = defaultSettings["completion_letter"];
        };
        textCompletionLetter.textContent = setCompletionLetter.value.toUpperCase();
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
        "font_family" : fontFamily.value,
        "copy_input_key" : setCopyInputKey.value,
        "copy_input_letter" : setCopyInputLetter.value,
        "copy_output_key" : setCopyOutputKey.value,
        "copy_output_letter" : setCopyOutputLetter.value,
        "completion_key" : setCompletionKey.value,
        "completion_letter" : setCompletionLetter.value
    });

    applySettings();

    settingsBox.style.display = "none";
};