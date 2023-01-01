/*
    Functions specific to Firefox (Android version)
    
    This file is copy-pasted in popup.js (popup.ts before compilation).
    Therefore, a special attention to variable names is needed.
*/

document.getElementsByClassName("shortcuts").style.display = "none";

window.addEventListener("blur", () => {
    // Saves the text in the first box so it doesn't disappear if you change page or close MatTalX
    browser.storage.local.set({
        "box1" : textIn.value,
        "check" : spacesButton.checked,
        "boxparam" : parametersText.value
    });
});

window.addEventListener("focus", () => {
    // Retreives the text when the popup reopens
    browser.storage.local.get("box1", (text) => {
        if (text.box1 !== undefined) {
            textIn.value = text.box1;
        };
    });
    browser.storage.local.get("check", (button) => {
        // Default is true
        if (button.check === false) {
            spacesButton.checked = false;
        };
    })
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

// Only available if the device is screen only
document.getElementById("suggestionsBtn").style.display = "inline-block";

function openParameters() {
    const baseParams = "% Parameters \n" +
                       "\\documentclass{mathmode}\n" +
                       "\\usepackage[style]{font}\n" + 
                       "\\usepackage{stdshorts}\n";
    browser.storage.local.get("boxparam", (text) => {
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
    browser.storage.local.set({
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

window.addEventListener("keydown", (keyPressed) => {
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
});