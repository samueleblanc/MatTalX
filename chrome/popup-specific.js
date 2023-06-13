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
    chrome.storage.sync.set({"dark_mode" : darkMode.checked});
    chrome.storage.sync.set({"font_size" : fontSize.value});
    chrome.storage.sync.set({"font_family" : fontFamily.value});
    chrome.storage.sync.set({"copy_input_key" : setCopyInputKey.value});
    chrome.storage.sync.set({"copy_input_letter" : setCopyInputLetter.value});
    chrome.storage.sync.set({"copy_output_key" : setCopyOutputKey.value});
    chrome.storage.sync.set({"copy_output_letter" : setCopyOutputLetter.value});
    chrome.storage.sync.set({"completion_key" : setCompletionKey.value});
    chrome.storage.sync.set({"completion_letter" : setCompletionLetter.value});
    chrome.storage.sync.set({"completion_button" : showCompletionBtn.checked});
    chrome.storage.sync.set({"built_commands" : storeCommands()});
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
    chrome.commands.getAll().then(
        // Show the right shortcut used to open and close MatTalX
        // Function is different from the other since this shortcut can be modified from 
        // the browser settings, not directly from MatTalX
        (commands) => {
            if (commands[0].name == "_execute_action") {
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
    if (completionPopup.style.display === "inline-block") {
        if ((event.target.id !== "text_in") && (event.target.id !== "completionBtn")) {
            closeCompletion();
        };
    } else if (settingsBox.style.display === "block") {
        if (event.target.id === "settingsBox") {
            closeSettings();
        };
    };
});

function getSettings() {
    // For settings in the Settings box
    chrome.storage.sync.get(["dark_mode"], (button) => {
        if (button.dark_mode === true) {
            // Default is false
            darkMode.checked = true;
        } else if (button.dark_mode === undefined) {
            darkMode.checked = prefersDarkMode;
        };
        updateMainColors();
    });
    chrome.storage.sync.get(["font_size"], (text) => {
        if (text.font_size !== undefined) {
            fontSize.value = text.font_size;
        } else {
            fontSize.value = defaultSettings["font_size"];
        };
        textIn.style.fontSize = fontSize.value.toString() + "px";
        textOut.style.fontSize = (parseInt(fontSize.value)+1).toString() + "px";
    });
    chrome.storage.sync.get(["font_family"], (text) => {
        if (text.font_family !== undefined) {
            fontFamily.value = text.font_family;
        }  else {
            fontFamily.value = defaultSettings["font_family"];
        };
        textIn.style.fontFamily = fontFamily.value;
        textOut.style.fontFamily = fontFamily.value;
    });
    chrome.storage.sync.get(["copy_input_key"], (text) => {
        if (text.copy_input_key !== undefined) {
            setCopyInputKey.value = text.copy_input_key;
        } else {
            setCopyInputKey.value = defaultSettings["copy_input_key"];
        };
        textCopyInputKey.textContent = setCopyInputKey.value;
    });
    chrome.storage.sync.get(["copy_input_letter"], (text) => {
        if (text.copy_input_letter !== undefined) {
            setCopyInputLetter.value = text.copy_input_letter;
        } else {
            setCopyInputLetter.value = defaultSettings["copy_input_letter"];
        };
        textCopyInputLetter.textContent = setCopyInputLetter.value.toUpperCase();
    });
    chrome.storage.sync.get(["copy_output_key"], (text) => {
        if (text.copy_output_key !== undefined) {
            setCopyOutputKey.value = text.copy_output_key;
        } else {
            setCopyOutputKey.value = defaultSettings["copy_output_key"];
        };
        textCopyOutputKey.textContent = setCopyOutputKey.value;
    });
    chrome.storage.sync.get(["copy_output_letter"], (text) => {
        if (text.copy_output_letter !== undefined) {
            setCopyOutputLetter.value = text.copy_output_letter;
        } else {
            setCopyOutputLetter.value = defaultSettings["copy_output_letter"];
        };
        textCopyOutputLetter.textContent = setCopyOutputLetter.value.toUpperCase();
    });
    chrome.storage.sync.get(["completion_key"], (text) => {
        if (text.completion_key !== undefined) {
            setCompletionKey.value = text.completion_key;
        } else {
            setCompletionKey.value = defaultSettings["completion_key"];
        };
        textCompletionKey.textContent = setCompletionKey.value;
    });
    chrome.storage.sync.get(["completion_letter"], (text) => {
        if (text.completion_letter !== undefined) {
            setCompletionLetter.value = text.completion_letter;
        } else {
            setCompletionLetter.value = defaultSettings["completion_letter"];
        };
        textCompletionLetter.textContent = setCompletionLetter.value.toUpperCase();
    });
    chrome.storage.sync.get(["completion_button"], (button) => {
        if (button.completion_button === true) {
            // Default is false
            showCompletionBtn.checked = true;
        };
        completionBtn.style.display = (showCompletionBtn.checked || touchScreen) ? "inline-block" : "none";
    });
    chrome.storage.sync.get(["built_commands"], (list) => {
        const startingRow = commandsBuilt.rows.length;
        for (let i=startingRow; i<list.built_commands.length; i++) {
            buildNewCommand();
            commandsBuilt.rows[i].cells[0].firstChild.value = list.built_commands[i].type;
            commandsBuilt.rows[i].cells[2].firstChild.value = list.built_commands[i].newInput;
            commandsBuilt.rows[i].cells[5].firstChild.value = list.built_commands[i].output;
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

    chrome.storage.sync.set({"dark_mode" : darkMode.checked});
    chrome.storage.sync.set({"font_size" : fontSize.value});
    chrome.storage.sync.set({"font_family" : fontFamily.value});
    chrome.storage.sync.set({"copy_input_key" : setCopyInputKey.value});
    chrome.storage.sync.set({"copy_input_letter" : setCopyInputLetter.value});
    chrome.storage.sync.set({"copy_output_key" : setCopyOutputKey.value});
    chrome.storage.sync.set({"copy_output_letter" : setCopyOutputLetter.value});
    chrome.storage.sync.set({"completion_key" : setCompletionKey.value});
    chrome.storage.sync.set({"completion_letter" : setCompletionLetter.value});
    chrome.storage.sync.set({"completion_button" : showCompletionBtn.checked});
    chrome.storage.sync.set({"built_commands" : storeCommands()});
    
    applySettings();

    settingsBox.style.display = "none";
};