messages.js
popup-specific.js
messages.js
popup-specific.js
addon/messages.js
addon/popup-specific.js
addon/messages.js
addon/popup-specific.js
// Message for first time users
function firstMessage(version) {
    // Writes explanation in the two text boxes
    let text = "Welcome to MatTalX version " + version + "! At any moment, you can look at the documentation by putting your mouse above the question mark (?) " + 
    "on the top right corner. MatTalX almost always uses the same command as LaTeX, but there are some differences.";
    let tutorial = "First and foremost, it is important to remember that MatTalX converts the command into text, therefore a command like: \r\n" + 
    "x^{x^{x^{x}}} will give an error, since it can't fit in a line.\r\n \r\n" +
    "Every letter will automatically be converted to a mathematical font, if you do not want that, you can put the text inside the command \\text{}. " + 
    "If you simply want a single letter to not be in the mathematical font, add '\\' before the letter:\r\n" + 
    " a → \u{1d44e} | \\a (or \\text{a}) → a\r\n \r\n" + 
    "As a last tip, if you get an error and the command seems right, the character that you want might not exist in unicode:\r\n" + 
    " x^{y} → 𝑥ʸ | x^{Y} → 𝑥^(𝑌) (ie y exists in superscript but not Y)\r\n \r\n" +
    "But, before jumping to conclusion, please look at the documentation! The command, for various reason, might be different than in LaTeX!";
    document.text_input.text_in.value = text;
    document.text_input.text_out.value = tutorial;
};

// Message after an update
function updateMessage(version) {
    // Writes explanation in the second box
    // To be changed by hand every version
    let majorChanges = "Welcome to MatTalX version " + version + "\r\n \r\n" + 
    "Major changes: \r\n" +
    " 1) Added \\acute{}, \\grave{}, \\hvec{} and \\underharpoon{}\r\n" +
    "  i) \\acute{x} → 𝑥́ \r\n" + 
    "  ii) \\grave{x} → 𝑥̀ \r\n" + 
    "  iii) \\hvec{x} → 𝑥⃑ \r\n" + 
    "  iv) \\underharpoon{x} → 𝑥⃬ \r\n" 
    " 2) 'Ù' and 'ù' can be obtained directly with \\Ù, \\ù or $chem Ù, ù\r\n" + 
    " 3) Added \\lightning, \\square and \\blacksquare\r\n" + 
    "  i) ↯\r\n" +
    "  ii) □\r\n" + 
    "  iii) ■\r\n" + 
    " 4) Added various arrows and letters as argument in the \\above{} and \\below{} commands\r\n" + 
    " 5) Improvements with 'Adjust spaces'";
    document.text_input.text_out.value = majorChanges;
};// Functions specific to Firefox

// Saves the text in the first box so it doesn't disappear if you change page or close MatTalX
window.addEventListener("blur", () => {
    browser.storage.local.set({
        "box1" : document.getElementById("text_in").value,
        "check" : spacesButton.checked
    });
});

// Retreives the text when the popup reopens
window.addEventListener("focus", () => {
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

// Listens for 'message' from background.js
window.addEventListener("DOMContentLoaded", () => {
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

// Listens for Alt+C to show suggestions, Alt+I to copy text of the first box (input) and Alt+O to copy text in the second box (output)
document.addEventListener("keydown", (keyPressed) => {
    const textIn = document.getElementById("text_in");
    // Alt+S to shows suggestions but closes the popup if the suggestion box is already opened
    if ((keyPressed.key === "c") && keyPressed.altKey && (textIn == document.activeElement)) {
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
});// Message for first time users
function firstMessage(version) {
    // Writes explanation in the two text boxes
    let text = "Welcome to MatTalX version " + version + "! At any moment, you can look at the documentation by putting your mouse above the question mark (?) " + 
    "on the top right corner. MatTalX almost always uses the same command as LaTeX, but there are some differences.";
    let tutorial = "First and foremost, it is important to remember that MatTalX converts the command into text, therefore a command like: \r\n" + 
    "x^{x^{x^{x}}} will give an error, since it can't fit in a line.\r\n \r\n" +
    "Every letter will automatically be converted to a mathematical font, if you do not want that, you can put the text inside the command \\text{}. " + 
    "If you simply want a single letter to not be in the mathematical font, add '\\' before the letter:\r\n" + 
    " a → \u{1d44e} | \\a (or \\text{a}) → a\r\n \r\n" + 
    "As a last tip, if you get an error and the command seems right, the character that you want might not exist in unicode:\r\n" + 
    " x^{y} → 𝑥ʸ | x^{Y} → 𝑥^(𝑌) (ie y exists in superscript but not Y)\r\n \r\n" +
    "But, before jumping to conclusion, please look at the documentation! The command, for various reason, might be different than in LaTeX!";
    document.text_input.text_in.value = text;
    document.text_input.text_out.value = tutorial;
};

// Message after an update
function updateMessage(version) {
    // Writes explanation in the second box
    // To be changed by hand every version
    let majorChanges = "Welcome to MatTalX version " + version + "\r\n \r\n" + 
    "Major changes: \r\n" +
    " 1) Added \\acute{}, \\grave{}, \\hvec{} and \\underharpoon{}\r\n" +
    "  i) \\acute{x} → 𝑥́ \r\n" + 
    "  ii) \\grave{x} → 𝑥̀ \r\n" + 
    "  iii) \\hvec{x} → 𝑥⃑ \r\n" + 
    "  iv) \\underharpoon{x} → 𝑥⃬ \r\n" 
    " 2) 'Ù' and 'ù' can be obtained directly with \\Ù, \\ù or $chem Ù, ù\r\n" + 
    " 3) Added \\lightning, \\square and \\blacksquare\r\n" + 
    "  i) ↯\r\n" +
    "  ii) □\r\n" + 
    "  iii) ■\r\n" + 
    " 4) Added various arrows and letters as argument in the \\above{} and \\below{} commands\r\n" + 
    " 5) Improvements with 'Adjust spaces'";
    document.text_input.text_out.value = majorChanges;
};// Functions specific to Firefox

// Saves the text in the first box so it doesn't disappear if you change page or close MatTalX
window.addEventListener("blur", () => {
    browser.storage.local.set({
        "box1" : document.getElementById("text_in").value,
        "check" : spacesButton.checked
    });
});

// Retreives the text when the popup reopens
window.addEventListener("focus", () => {
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

// Listens for 'message' from background.js
window.addEventListener("DOMContentLoaded", () => {
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

// Listens for Alt+C to show suggestions, Alt+I to copy text of the first box (input) and Alt+O to copy text in the second box (output)
document.addEventListener("keydown", (keyPressed) => {
    const textIn = document.getElementById("text_in");
    // Alt+S to shows suggestions but closes the popup if the suggestion box is already opened
    if ((keyPressed.key === "c") && keyPressed.altKey && (textIn == document.activeElement)) {
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
});// Functions specific to Firefox

// Saves the text in the first box so it doesn't disappear if you change page or close MatTalX
window.addEventListener("blur", () => {
    browser.storage.local.set({
        "box1" : document.getElementById("text_in").value,
        "check" : spacesButton.checked
    });
});

// Retreives the text when the popup reopens
window.addEventListener("focus", () => {
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

// Listens for 'message' from background.js
window.addEventListener("DOMContentLoaded", () => {
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

// Listens for Alt+C to show suggestions, Alt+I to copy text of the first box (input) and Alt+O to copy text in the second box (output)
document.addEventListener("keydown", (keyPressed) => {
    const textIn = document.getElementById("text_in");
    // Alt+S to shows suggestions but closes the popup if the suggestion box is already opened
    if ((keyPressed.key === "c") && keyPressed.altKey && (textIn == document.activeElement)) {
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