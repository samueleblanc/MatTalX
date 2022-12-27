/*
    Functions specific to Firefox (computer version)
    
    This file is copy-pasted in popup.ts (popup.js after compilation).
    Therefore, a special attention to variable names is needed.
*/

document.getElementById("short_open_mattalx").textContent = "Alt+M : Open/Close MatTalX";
document.getElementById("short_copy_input").textContent = "Alt+I : Copy input (first box)";
document.getElementById("short_copy_output").textContent = "Alt+O : Copy ouput (second box)";
document.getElementById("short_open_suggestions").textContent = "Alt+C : Open/Close completion";

document.getElementById("suggestionsBtn").style.display = "none";

window.addEventListener("blur", () => {
    // Saves the text in the first box so it doesn't disappear if you change page or close MatTalX
    browser.storage.local.set({
        "box1" : document.getElementById("text_in").value,
        "check" : spacesButton.checked
    });
});

window.addEventListener("focus", () => {
    // Retreives the text when the popup reopens
    const textIn = document.getElementById("text_in");
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

document.addEventListener("keydown", (keyPressed) => {
    // Listens for Alt+C to show suggestions, Alt+I to copy text of the first box (input) and Alt+O to copy text in the second box (output)
    const textIn = document.getElementById("text_in");
    if ((keyPressed.key === "c") && keyPressed.altKey && (textIn == document.activeElement)) {
        // Alt+C to shows suggestions but closes the popup if the suggestion box is already opened
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
