/*
    Functions specific to Firefox
    
    This file is copy-pasted in popup.js
    Therefore, a special attention to variable names is needed.

    These functions differs from their Chrome counterpart as the API for storing data is slightly different
    and because shortcuts are different
*/

document.getElementById("short_open_mattalx").textContent = "Alt+M : Open/Close MatTalX";
document.getElementById("short_copy_input").textContent = "Alt+I : Copy input (first box)";
document.getElementById("short_copy_output").textContent = "Alt+O : Copy ouput (second box)";
document.getElementById("short_open_suggestions").textContent = "Alt+C : Open/Close completion";

window.addEventListener("blur", () => {
    // Saves the text in the first box so it doesn't disappear if you change page or close MatTalX
    browser.storage.local.set({
        "box1" : textIn.value,
        "spaces" : spacesButton.checked,
        "font" : changeFontButton.checked,
        "mode" : changeModeButton.checked
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

document.addEventListener("keydown", (keyPressed) => {
    // Listens for Alt+C to show suggestions, Alt+I to copy text of the first box (input) and Alt+O to copy text in the second box (output)
    if ((keyPressed.key === srtCompletionLetter.value) && keyPressed.altKey && (textIn == document.activeElement)) {
        // Alt+C to shows suggestions but closes the popup if the suggestion box is already opened
        getSuggestion();
    } else if ((keyPressed.key === srtCopyInputLetter.value) && keyPressed.altKey) {
        copyTextIn();
    } else if ((keyPressed.key === srtCopyOutputKey.value) && keyPressed.altKey) {
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

function openSettings() {
    if ((settingsBox.style.display === "none") || (settingsBox.style.display === "")) {
        browser.storage.local.get("font_size", (text) => {
            if (text.font_size !== undefined) {
                fontSize.value = text.font_size;
            };
        });
        browser.storage.local.get("copy_input_key", (text) => {
            if (text.copy_input_key !== undefined) {
                srtCopyInputKey.value = text.copy_input_key;
            };
        });
        browser.storage.local.get("copy_input_letter", (text) => {
            if (text.copy_input_letter !== undefined) {
                srtCopyInputLetter.value = text.copy_input_letter;
            };
        });
        browser.storage.local.get("copy_output_key", (text) => {
            if (text.copy_output_key !== undefined) {
                srtCopyOutputKey.value = text.copy_output_key;
            };
        });
        browser.storage.local.get("copy_output_letter", (text) => {
            if (text.copy_output_letter !== undefined) {
                srtCopyOutputLetter.value = text.copy_output_letter;
            };
        });
        browser.storage.local.get("completion_key", (text) => {
            if (text.completion_key !== undefined) {
                srtCompletionKey.value = text.completion_key;
            };
        });
        browser.storage.local.get("completion_letter", (text) => {
            if (text.completion_letter !== undefined) {
                srtCompletionLetter.value = text.completion_letter;
            };
        });
        settingsBox.style.display = "block";
    };
};

function closeSettings() {
    if (settingsBox.style.display === "block") {
        browser.storage.local.set({
            "font_size" : fontSize.value,
            "copy_input_key" : srtCopyInputKey.value,
            "copy_input_letter" : srtCopyInputLetter.value,
            "copy_output_key" : srtCopyOutputKey.value,
            "copy_output_letter" : srtCopyOutputLetter.value,
            "completion_key" : srtCompletionKey.value,
            "completion_letter" : srtCompletionLetter.value
        });
        settingsBox.style.display = "none";
    };
};