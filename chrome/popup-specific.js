/*
    Functions specific to Chrome

    This file is copy-pasted in popup.js (popup.ts before compilation).
    Therefore, a special attention to variable names is needed.
*/

document.getElementById("short_open_mattalx").textContent = "Ctrl+M : Open/Close MatTalX";
document.getElementById("short_copy_input").textContent = "Alt+I : Copy input (first box)";
document.getElementById("short_copy_output").textContent = "Alt+O : Copy ouput (second box)";
document.getElementById("short_open_suggestions").textContent = "Alt+S : Open/Close suggestions";
document.getElementById("short_open_parameters").textContent = "Alt+P : Open/Close parameters";

// Recognize if the device is screen only
const touchScreen = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
if (!touchScreen) {
    document.getElementById("suggestionsBtn").style.display = "none";
};

window.addEventListener("blur", () => {
    // Saves the text in the first box so it doesn't disappear if you change page or close MatTalX
    chrome.storage.sync.set({"box1" : textIn.value});
    chrome.storage.sync.set({"check" : spacesButton.checked});
    chrome.storage.sync.set({"boxparam" : parametersText.value});
});

window.addEventListener("focus", () => {
    // Retreives the text when the popup reopens
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

function openParameters() {
    const baseParams = "% Parameters \n" +
                       "\\documentclass[style]{mathmode}\n" +
                       "\\usepackage{stdshorts}\n";
    chrome.storage.sync.get("boxparam", (text) => {
        if (text.boxparam !== undefined) {
            parametersText.value = text.boxparam;
        } else {
            parametersText.value = baseParams;
        };
    });
    parametersBox.style.display = "block";
    parametersText.focus();
};

function closeParameters() {
    chrome.storage.sync.set({
        "boxparam" : parametersText.value
    });
    parametersBox.style.display = "none";
    textIn.focus();
};

// parametersBtn is defined in popup.ts
parametersBtn.addEventListener("click", () => {
    // Show settings if user clicks on the setting button
    if ((parametersBox.style.display === "none") || (parametersBox.style.display === "")) {
        openParameters();
    } else {
        closeParameters();
    };
});

window.addEventListener("click", (event) => {
    // Closes the parameters popup if the user clicks outside the textarea
    if (parametersBox.style.display === "block") {
        if (event.target == "[object HTMLDivElement]") {
            closeParameters();
        };
    // Closes the suggestion popup if the users clicks anywhere except on the suggestion popup itself or input box
    } else if (suggestionsPopup.style.display === "inline-block") {
        if (event.target != "[object HTMLTextAreaElement]") {
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
    } else if ((keyPressed.key === "p") && keyPressed.altKey) {
        if ((parametersBox.style.display === "none") || (parametersBox.style.display === "")) {
            openParameters();
        } else {
            closeParameters();
        };
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
