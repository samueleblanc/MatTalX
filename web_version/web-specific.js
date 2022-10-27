
// If the device is screen only, the suggestion/completion popup can be opened with the click of an on-screen button

// Checks if the media used is screen only
const touchScreen = ('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0);

// Only available if the device is screen only
const suggestionsBtn = document.getElementById("suggestionsBtn");
if (touchScreen) {
    suggestionsBtn.style.display === "inline-block";
};

suggestionsBtn.onclick = () => {
    const textIn = document.getElementById("text_in");
    if (suggestionsPopup.style.display !== "inline-block") { 
        suggestionsPopup.textContent = "";
        let word = findWord(textIn.value, textIn.value.length - 1);
        suggestionsPopup.style.display = "inline-block";
        suggestions(word);
    } else {
        closeSuggestions();
    };
};

window.addEventListener("keydown", (keyPressed) => {
    // Listens for Alt+S to show suggestions, Alt+I to copy text of the first box (input) and Alt+O to copy text in the second box (output)
    const textIn = document.getElementById("text_in");
    // Alt+S to shows suggestions but closes the popup if the suggestion box is already opened
    if ((keyPressed.key === "s") && keyPressed.altKey && (textIn == document.activeElement)) {
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
