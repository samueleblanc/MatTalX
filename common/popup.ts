/*
    Front-end stuff
*/

import { Str } from "./types";
import { mathDictionary } from "./unicode/mathsymbols";
import { findWord, showCommand, toReplaceCommand, semiAutoCompletion } from "./suggestions";


// GLOBAL VARIABLES

// Submit button ('Convert' is what's seen by the users)
const submit: HTMLButtonElement = <HTMLButtonElement>document.getElementById("convert");
submit.onclick = function() {main()};

// Copy button
const copyButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("copy");
copyButton.onclick = function() {copyTextOut()};

// Clear button
const resetButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("reset");
resetButton.onclick = function() {clear()};

// Remove spaces button
const spacesButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("adjust");

// Originally hidden
// Can be accessed with a keyboard shortcut (Alt+S or Alt+C on chrome or firefox respectively) or by clicking the button (android)
const suggestionsPopup: HTMLTableElement = <HTMLTableElement>document.getElementById("suggestions");

// First and second text box
const textIn: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById("text_in");
const textOut: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById("text_out");

const mistakesBox: HTMLElement = <HTMLElement>document.getElementById("mistakes");

const settingBtn: HTMLInputElement = <HTMLInputElement>document.getElementById("settingBtn");
const settingBox: HTMLElement = <HTMLElement>document.getElementById("settingBox");
const settingText: HTMLElement = <HTMLElement>document.getElementById("settingText");


// FUNCTIONS

settingBtn.addEventListener("click", () => {
    // Show settings if user clicks on the setting button
    settingBox.style.display = "block";
    settingText.focus();
});

function suggestions(command: string): void {
    // Outputs list of other commands that are similar to the one currently being written
    let row: HTMLTableRowElement;
    let cell: HTMLTableCellElement;
    let btn: HTMLButtonElement;
    if (command === "") {
        closeSuggestions();
    } else if (command[0] !== "\\") {
        row = suggestionsPopup.insertRow(-1);
        cell = row.insertCell(0);
        cell.textContent = "The first character of the command must be a backslash (\\). Superscript starts with ^ and subscript with _";
    } else {
        command = command.substring(1, command.length);  // Erases the backslash so that, for instance, \arrow will also show \rightarrow, etc.
        let keys: string;
        for (keys in mathDictionary) {
            // Puts commands in button form, so they can be clicked on to replace the command being written
            if (keys.toLowerCase().indexOf(command.toLowerCase()) !== -1) {
                row = suggestionsPopup.insertRow(-1);
                cell = row.insertCell(0);
                btn = document.createElement("button");
                btn.value = showCommand(keys);
                btn.textContent = toReplaceCommand(keys);
                btn.style.width = "145px";  // Would be cleaner with something like 'fit-content', but is way to slow
                btn.style.height = "17px";
                btn.style.backgroundColor = "white";
                btn.style.border = "1px solid white";
                btn.style.borderRadius = "3px";
                btn.type = "button";
                btn.addEventListener("click", () => {
                    textIn.value = semiAutoCompletion(textIn.value, textIn.selectionEnd, btn.value);
                    closeSuggestions();
                    textIn.focus();
                });
                // Shows what the command ouputs on mouseover, return to normal on mouseout
                btn.addEventListener("mouseover", () => {
                    let x: string = Str(btn.textContent);
                    btn.textContent = btn.value;
                    btn.value = x;
                });
                btn.addEventListener("mouseout", () => {
                    let x: string = Str(btn.textContent);
                    btn.textContent = btn.value;
                    btn.value = x;
                });
                cell.appendChild(btn);
            };
        };
    };
};

function closeSuggestions(): void {
    // Close and empties the suggestion popup
    suggestionsPopup.style.display = "none";
    suggestionsPopup.textContent = "";
};

function copyTextOut(): void {
    // Copy second box (output) to clipboard
    if (textOut.disabled === false) {
        navigator.clipboard.writeText(textOut.value);
        copyButton.value = "Copied!";
        copyButton.style.cursor = "default";
        textOut.style.border = "2px solid black";

        setTimeout(() => {
            copyButton.value = "Copy text";
            copyButton.style.cursor = "pointer";
            textOut.style.border = "1px solid black";
        }, 2500)  // Returns to initial copyButton
    };
};

function copyTextIn(): void {
    // Copy first box (input) to clipboard
    navigator.clipboard.writeText(textIn.value);
    textIn.style.border = "2px solid black";
    setTimeout(() => {
        textIn.style.border = "1px solid black";
    }, 2500);
};

function clear(): void {
    // Clears everything
    copyButton.value = "Copy text";
    copyButton.style.cursor = "pointer";
    mistakesBox.textContent = "";
    textOut.disabled = true;
    suggestionsPopup.style.display = "none";
    suggestionsPopup.textContent = "";
};

function main(): void {
    // Takes the original text (input) and outputs the new one, with the converted symbols

    mistakesBox.textContent = "";  // Starts with an empty box for errors

    let fullText: string = textIn.value;
    fullText = fullText.replace(/\u000A/g, " "); // Cancels the line skipped by pressing "enter", use "\\" instead

    // fullText = convert(fullText + " ");
    textOut.value = fullText;
    textOut.disabled = false;
};