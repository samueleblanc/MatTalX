/*
    The interface of MatTalX: the popup where the user writes LaTeX commands and reads
    the converted text, which can then be copied and sent via Messenger, Instagram, X, etc.

    The conversion itself lives in core.js, which knows nothing about the DOM.
*/


/*
    CODE STRUCTURE
    
    N.B. Every section header has the format: /// NAME /// and every subsection: * Name *


    /// GLOBALS ///  -> All the global variables
    │
    ├─ HTMLElements
    │   └─ Settings
    ├─ Other
    │
    /// FUNCTIONS ///  -> All the functions
    │
    ├─ Front-end
    ├─ Build commands and operators
    ├─ Completion box
    └─ Main
*/


/**************************************************************************************/

"use strict";

import {
    convert,
    errorHeader,
    resetErrors,
    reportError
} from "./core.js";

import {
    findWord,
    semiAutoCompletion,
    completionList
} from "./completion.js";

import {
    defaultSettings,
    loadSettings,
    saveSettings,
    conversionSettings,
    takeInstallReason,
    isShortcut
} from "./settings.js";

/// GLOBALS ///




//-----------------------------------------------------//


/** HTMLElements **/

// Convert button
const convertButton = document.getElementById("convert");
convertButton.onclick = function() {main()};

// Copy button
const copyButton = document.getElementById("copy");
copyButton.onclick = function() {copyTextOut()};

// Clear button
const resetButton = document.getElementById("reset");
resetButton.onclick = function() {clear()};

// Button to open the completion popup
const completionBtn = document.getElementById("completionBtn");
completionBtn.onclick = function() {getCompletion()};

// Originally hidden
// Can be accessed with a keyboard shortcut (Alt+Shift+C by default) or by clicking the button
const completionPopup = document.getElementById("completion");

// Adjust spaces button
const spacesButton = document.getElementById("adjust");

// Mathematical font button
const changeFontButton = document.getElementById("mathFont");

// Math mode button
const changeModeButton = document.getElementById("mathMode");

// Settings popup
const settingsBtn = document.getElementById("settingsBtn");
settingsBtn.onclick = function() {openSettings()};
const settingsBox = document.getElementById("settingsBox");
const resetSettingsButton = document.getElementById("resetSettingsBtn");
resetSettingsButton.onclick = function() {resetSettings()};

// First and second text box
const textIn = document.getElementById("text_in");
const textOut = document.getElementById("text_out");

const mistakesBox = document.getElementById("mistakes");


// Settings

// Style
const darkMode = document.getElementById("darkMode");
const fontSize = document.getElementById("fontSize");
const fontFamily = document.getElementById("fontFamily");

// Keyboard shortcuts

// Shortcuts settings
const setCopyInputKey = document.getElementById("shortCopyInputK");
const setCopyInputLetter = document.getElementById("shortCopyInputL");
const setCopyOutputKey = document.getElementById("shortCopyOutputK");
const setCopyOutputLetter = document.getElementById("shortCopyOutputL");
const showCompletionBtn = document.getElementById("showCompletionBtn");

// The shortcut that opens MatTalX belongs to the browser, not to MatTalX, so the Settings box
// can only show it and open the page where the browser lets the user change it
const settingsOpenShortcut = document.getElementById("settingsOpenShortcut");
const settingsInlineShortcut = document.getElementById("settingsInlineShortcut");
const settingsCompleteShortcut = document.getElementById("settingsCompleteShortcut");
const changeShortcutBtn = document.getElementById("changeShortcutBtn");
changeShortcutBtn.onclick = function() {openShortcutSettings()};

// Commands & Operators
const buildCommandsBtn = document.getElementById("buildNewCommand");
buildCommandsBtn.onclick = function() {buildNewCommand()};
const commandsBuilt = document.getElementById("commandsBuilt");

//-----------------------------------------------------//


/** Other **/

// The suggestions currently shown, and which one the arrows are on
let suggestions = [];
let chosenSuggestion = 0;







/**************************************************************************************/


/// FUNCTIONS ///

/** Front-end **/

function copyTextOut() {
    // Copy second box (output) to clipboard
    if (textOut.disabled === false) {
        navigator.clipboard.writeText(textOut.value);
        copyButton.value = "Copied!";
        setTimeout(() => {
            copyButton.value = "Copy text";
        }, 2500)  // Returns to initial copyButton
    };
};

function copyTextIn() {
    // Copy first box (input) to clipboard
    navigator.clipboard.writeText(textIn.value);
};

function clear() {
    // Clears everything
    copyButton.value = "Copy text";
    mistakesBox.textContent = "";
    textOut.disabled = true;
    completionPopup.style.display = "none";
    completionPopup.textContent = "";
};

function settingsFromBox() {
    // Everything the interface holds, in the shape settings.js stores
    return {
        "box1" : textIn.value,
        "spaces" : spacesButton.checked,
        "font" : changeFontButton.checked,
        "mode" : changeModeButton.checked,
        "dark_mode" : darkMode.checked,
        "font_size" : fontSize.value,
        "font_family" : fontFamily.value,
        "copy_input_key" : setCopyInputKey.value,
        "copy_input_letter" : setCopyInputLetter.value,
        "copy_output_key" : setCopyOutputKey.value,
        "copy_output_letter" : setCopyOutputLetter.value,
        "completion_button" : showCompletionBtn.checked,
        "built_commands" : storeCommands()
    };
};

function applyTextAndToggles(settings) {
    // The first box and the three checkboxes of the dropdown
    textIn.value = settings["box1"];
    spacesButton.checked = settings["spaces"];
    changeFontButton.checked = settings["font"];
    changeModeButton.checked = settings["mode"];
};

function applySettingsBox(settings) {
    // Everything inside the Settings box
    darkMode.checked = settings["dark_mode"];
    updateMainColors();

    fontSize.value = settings["font_size"];
    textIn.style.fontSize = fontSize.value.toString() + "px";
    textOut.style.fontSize = (parseInt(fontSize.value)+1).toString() + "px";

    fontFamily.value = settings["font_family"];
    textIn.style.fontFamily = fontFamily.value;
    textOut.style.fontFamily = fontFamily.value;

    setCopyInputKey.value = settings["copy_input_key"];
    setCopyInputLetter.value = settings["copy_input_letter"];
    setCopyOutputKey.value = settings["copy_output_key"];
    setCopyOutputLetter.value = settings["copy_output_letter"];

    showCompletionBtn.checked = settings["completion_button"];
    completionBtn.style.display = (showCompletionBtn.checked) ? "inline-block" : "none";

    buildStoredCommands(settings["built_commands"]);
};

function buildStoredCommands(builtCommands) {
    // Adds a row in the Settings box for each command the user built
    for (let i=commandsBuilt.rows.length; i<builtCommands.length; i+=1) {
        buildNewCommand();
        commandsBuilt.rows[i].cells[0].children[0].value = builtCommands[i].type;
        commandsBuilt.rows[i].cells[1].children[1].value = builtCommands[i].newInput;
        // commandsBuilt.rows[i].cells[2].children[1].value = builtCommands[i].numArgs;
        commandsBuilt.rows[i].cells[2].children[1].value = builtCommands[i].output;
    };
};

function showBrowserShortcut(name, shortcut) {
    // Shows a shortcut the browser owns, in the Settings box
    const text = (shortcut) ? shortcut : "Not set";
    if (name === "convert_inline") {
        settingsInlineShortcut.textContent = text;
    } else if (name === "complete_inline") {
        settingsCompleteShortcut.textContent = text;
    } else {
        settingsOpenShortcut.textContent = text;
    };
};

function showErrors(errors) {
    // Writes the errors found by core.js in the box under the output
    mistakesBox.textContent = (errors.length > 0) ? errorHeader + errors : "";
};

function verifySettings(variable, varType) {
    // Makes sure the settings are appropriate
    const restriction = {
        "font" : {
            // Should be fine since 2 char limits in HTML
            min: 1,
            max: 99,
        },
        "letter" : {
            min: "A",
            max: "z",
        }
    };
    if ((variable < restriction[varType].min) || (variable > restriction[varType].max)) {
        const errReason = (varType === "letter") ? "not an accepted character" : "out of range";
        resetErrors();
        showErrors(reportError("Settings", variable + " is " + errReason));
    };
};

function applySettings() {
    // Checks the shortcuts chosen in the Settings box and updates the font
    // Called when MatTalX opens, when the Settings box closes and by resetSettings()

    // Verify if each shortcut is unique
    const listShortcuts = [
        settingsOpenShortcut.textContent,
        settingsInlineShortcut.textContent,
        settingsCompleteShortcut.textContent,
        [setCopyInputKey.value, "+", setCopyInputLetter.value.toUpperCase()].join(""),
        [setCopyOutputKey.value, "+", setCopyOutputLetter.value.toUpperCase()].join("")
    ];
    if ((new Set(listShortcuts)).size !== listShortcuts.length) {
        showErrors(reportError("Settings", "At least two shortcuts are identical"));
    };

    textIn.style.fontSize = fontSize.value.toString() + "px";
    textOut.style.fontSize = (parseInt(fontSize.value)+1).toString() + "px";

    textIn.style.fontFamily = fontFamily.value;
    textOut.style.fontFamily = fontFamily.value;

    completionBtn.style.display = (showCompletionBtn.checked) ? "inline-block" : "none";
};

function resetSettings() {
    // Give each setting its default value
    // Called when the 'Reset' button in the Settings box is clicked
    darkMode.checked = defaultSettings["dark_mode"];
    fontSize.value = defaultSettings["font_size"];
    fontFamily.value = defaultSettings["font_family"];
    setCopyInputKey.value = defaultSettings["copy_input_key"];
    setCopyInputLetter.value = defaultSettings["copy_input_letter"];
    setCopyOutputKey.value = defaultSettings["copy_output_key"];
    setCopyOutputLetter.value = defaultSettings["copy_output_letter"];
    showCompletionBtn.checked = defaultSettings["completion_button"];

    updateMainColors();
    applySettings();
};

function updateMainColors() {
    // Light or dark is one attribute on <html>. Every colour lives in popup_style.css,
    // so nothing here has to know what any of them are.
    // Hover is CSS too, which is what stops a colour sticking to a button after the
    // user changes theme -- the reason the delete button's hover had to be turned off.
    document.documentElement.dataset.theme = (darkMode.checked) ? "dark" : "light";
};

darkMode.addEventListener("click", (e) => {
    updateMainColors();
});

document.addEventListener("keydown", (keyPressed) => {
    // Listens for keydown to open completion popup, copy the input text or copy the output
    // The two shortcuts that work inside a page work here too, on what the popup holds:
    // background.js leaves them alone while the popup is open
    if (isShortcut(keyPressed, settingsCompleteShortcut.textContent) &&
        (textIn == document.activeElement)) {
        // Shows completion but closes the popup if the completion box is already opened
        keyPressed.preventDefault();
        getCompletion();
    } else if (isShortcut(keyPressed, settingsInlineShortcut.textContent)) {
        // Converting the page behind the popup is not what the user is looking at
        keyPressed.preventDefault();
        main();
    } else if (((keyPressed.key === setCopyInputLetter.value.toLowerCase()) || (keyPressed.key === setCopyInputLetter.value.toUpperCase())) && 
        (
        (keyPressed.altKey && ("Alt" === setCopyInputKey.value)) || 
        (keyPressed.ctrlKey && ("Ctrl" === setCopyInputKey.value)) || 
        (keyPressed.altKey && keyPressed.shiftKey && ("Alt+Shift" === setCopyInputKey.value)) ||
        (keyPressed.ctrlKey && keyPressed.shiftKey && ("Ctrl+Shift" === setCopyInputKey.value))
        )) {
        copyTextIn();
    } else if (((keyPressed.key === setCopyOutputLetter.value.toLowerCase()) || (keyPressed.key === setCopyOutputLetter.value.toUpperCase())) && 
        (
        (keyPressed.altKey && ("Alt" === setCopyOutputKey.value)) || 
        (keyPressed.ctrlKey && ("Ctrl" === setCopyOutputKey.value)) || 
        (keyPressed.altKey && keyPressed.shiftKey && ("Alt+Shift" === setCopyOutputKey.value)) ||
        (keyPressed.ctrlKey && keyPressed.shiftKey && ("Ctrl+Shift" === setCopyOutputKey.value))
        )) {
        copyTextOut();
    } else {
        // If any key is pressed while the completion popup is opened, it adjusts the suggestions
        // The word must be adjusted "by hand" because the eventListener is synchronous
        if (completionPopup.style.display === "inline-block") {
            if ((keyPressed.key === "ArrowDown") || (keyPressed.key === "ArrowUp")) {
                keyPressed.preventDefault();
                pickSuggestion(chosenSuggestion + ((keyPressed.key === "ArrowDown") ? 1 : -1));
            } else if (keyPressed.key === "Enter") {
                keyPressed.preventDefault();
                takeSuggestion();
            } else if (keyPressed.key === "Escape") {
                closeCompletion();
            } else if (keyPressed.key === "Backspace") {
                completionPopup.textContent = "";
                let word = findWord(textIn.value, textIn.selectionEnd - 1, "Backspace");
                completion(word);
            } else if (keyPressed.code === "Space") {
                closeCompletion();
            } else if (keyPressed.key.length === 1) {  // i.e. A letter
                completionPopup.textContent = "";
                let word = findWord(textIn.value, textIn.selectionEnd - 1, keyPressed.key);
                completion(word);
            } else if ((keyPressed.key === "ArrowRight") || (keyPressed.key === "ArrowLeft")) {
                completionPopup.textContent = "";
                const arrows = {"ArrowRight": 1, "ArrowLeft": -1};
                let word = findWord(textIn.value, (textIn.selectionEnd - 1 + arrows[keyPressed.key]));
                completion(word);
            };
        };
    };
});

//-----------------------------------------------------//


/** Build commands and operators **/

function buildNewCommand() {
    // Called when 'buildCommandsBtn' is clicked
    // Adds a new command (two new rows) to the 'commandsBuilt' table

    commandsBuilt.style.display = "block";

    // Curly and square brackets are used to mimic the style of \newcommand{}[]{}
    let curlyBracketsLeftCN = document.createElement("span");
    let curlyBracketsRightCN = document.createElement("span");
    let curlyBracketsLeftCA = document.createElement("span");
    let curlyBracketsRightCA = document.createElement("span");
    // let squareBracketLeft = document.createElement("span");
    // let squareBracketRight = document.createElement("span");
    curlyBracketsLeftCN.textContent = "{";
    curlyBracketsRightCN.textContent = "}";
    curlyBracketsLeftCA.textContent = "{";
    curlyBracketsRightCA.textContent = "}";
    // squareBracketLeft.textContent = "[";
    // squareBracketRight.textContent = "]";
    curlyBracketsLeftCN.style.display = "inline";
    curlyBracketsRightCN.style.display = "inline";
    curlyBracketsLeftCA.style.display = "inline";
    curlyBracketsRightCA.style.display = "inline";
    // squareBracketLeft.style.display = "inline";
    // squareBracketRight.style.display = "inline";

    let row1 = document.createElement("tr");
    // let row2 = document.createElement("tr");  // Will be used when multiple arguments are allowed

    // This block builds the select form from which you can select what to build
    let typeInput = document.createElement("td");
    let selectCmdType = document.createElement("select");
    selectCmdType.className = "commandList";
    let newCommandOpt = document.createElement("option");
    let renewCommandOpt = document.createElement("option");
    let declareMathOperatorOpt = document.createElement("option");
    let declareUnicodeCharacterOpt = document.createElement("option");
    newCommandOpt.text = "\\newcommand";
    newCommandOpt.value = "\\newcommand";
    renewCommandOpt.text = "\\renewcommand";
    renewCommandOpt.value = "\\renewcommand";
    declareMathOperatorOpt.text = "\\DeclareMathOperator";
    declareMathOperatorOpt.value = "\\DeclareMathOperator";
    declareUnicodeCharacterOpt.text = "\\DeclareUnicodeCharacter";
    declareUnicodeCharacterOpt.value = "\\DeclareUnicodeCharacter";
    selectCmdType.add(newCommandOpt);
    selectCmdType.add(renewCommandOpt);
    selectCmdType.add(declareMathOperatorOpt);
    selectCmdType.add(declareUnicodeCharacterOpt);
    typeInput.appendChild(selectCmdType);
    row1.appendChild(typeInput);

    row1.appendChild(curlyBracketsLeftCN);

    // newCommandName is the command name *to be* used
    let newCommandName = document.createElement("td");
    let inputNewCommandName = document.createElement("input");
    inputNewCommandName.type = "text";
    inputNewCommandName.style.display = "inline";
    inputNewCommandName.style.width = "80%";
    newCommandName.appendChild(curlyBracketsLeftCN);
    newCommandName.appendChild(inputNewCommandName);
    newCommandName.appendChild(curlyBracketsRightCN);
    row1.appendChild(newCommandName);

    // Number of arguments
    /*
    let numberArgsField = document.createElement("td");
    let numArgs = document.createElement("input");
    numArgs.type = "number";
    numArgs.value = "0";
    numArgs.min = "0";
    numArgs.max = "99";
    numArgs.step = "1";
    numArgs.style.width = "3em";
    numArgs.style.display = "inline";
    numberArgsField.appendChild(squareBracketLeft);
    numberArgsField.appendChild(numArgs);
    numberArgsField.appendChild(squareBracketRight);
    row1.appendChild(numberArgsField);
    */

    // commandsBuilt.appendChild(row1);

    // defaultCommandName is the *old* (or default) command
    let defaultCommandName = document.createElement("td");
    let inputDefaultCommandArg = document.createElement("input");
    inputDefaultCommandArg.type = "text";
    inputDefaultCommandArg.style.width = "80%";
    inputDefaultCommandArg.style.display = "inline";
    defaultCommandName.appendChild(curlyBracketsLeftCA);
    defaultCommandName.appendChild(inputDefaultCommandArg);
    defaultCommandName.appendChild(curlyBracketsRightCA);
    row1.appendChild(defaultCommandName);  // Will be on row2 when multiple arguments are allowed

    // For style
    // let emptyCell = document.createElement("td");
    // row2.appendChild(emptyCell);

    // Button used to delete the command (and remove the rows)
    let deleteCommand = document.createElement("td");
    let deleteCommandBtn = document.createElement("input");
    deleteCommandBtn.type = "button";
    deleteCommandBtn.value = "☒";
    deleteCommandBtn.style.fontSize = "18px";
    deleteCommandBtn.style.borderRadius = "6px";
    deleteCommandBtn.style.padding = "5px";

    // Its hover is in popup_style.css now, so it follows the theme

    deleteCommandBtn.addEventListener("click", () => {
        // Delete the command
        row1.remove();
        // row2.remove();
    });

    deleteCommand.appendChild(deleteCommandBtn);
    row1.appendChild(deleteCommand);

    commandsBuilt.appendChild(row1);
};

function storeCommands() {
    // Loops on all the commands and returns an array containing all the info
    // Called when MatTalX or the settings popup closes
    let commandsList = [];
    for (let i=0; i<commandsBuilt.rows.length; i+=1) {
        if (commandsBuilt.rows[i].cells[0].children[0].value !== undefined && 
            commandsBuilt.rows[i].cells[1].children[1].value !== "" &&
            commandsBuilt.rows[i].cells[2].children[1].value !== ""
            // commandsBuilt.rows[i+1].cells[0].children[1].value !== ""
            )
        {
            commandsList.push({
                type : commandsBuilt.rows[i].cells[0].children[0].value,
                newInput : commandsBuilt.rows[i].cells[1].children[1].value,
                // numArgs : commandsBuilt.rows[i].cells[2].children[1].value,
                output : commandsBuilt.rows[i].cells[2].children[1].value
            });
        };
    };
    return commandsList;
};



//-----------------------------------------------------//


/** Completion box **/

function closeCompletion() {
    // Close and empties the completion popup
    completionPopup.style.display = "none";
    completionPopup.textContent = "";
    suggestions = [];
    chosenSuggestion = 0;
};

function pickSuggestion(i) {
    // Moves the highlight, the way the arrows do in the box drawn inside a page
    if (suggestions.length === 0) {
        return;
    };
    suggestions[chosenSuggestion].classList.remove("chosen");
    chosenSuggestion = (i + suggestions.length) % suggestions.length;
    suggestions[chosenSuggestion].classList.add("chosen");
    suggestions[chosenSuggestion].scrollIntoView({block: "nearest"});
};

function takeSuggestion() {
    // Enter writes the command that is highlighted, which is what clicking it does
    if (suggestions.length > 0) {
        suggestions[chosenSuggestion].click();
    };
};

function getCompletion() {
    // Calls completion() with the word touching the cursor if the popup is closed, else it closes the popup
    if (completionPopup.style.display !== "inline-block") { 
        completionPopup.textContent = "";
        let word = findWord(textIn.value, textIn.selectionEnd - 1);
        completionPopup.style.display = "inline-block";
        completion(word);
    } else {
        closeCompletion();
    };
};


function completion(command) {
    // Outputs list of other commands that are similar to the one currently being written
    // What to suggest is decided in completion.js, which the page uses too, so the two
    // can't end up suggesting different things
    const found = completionList(command, storeCommands(), changeFontButton.checked);
    suggestions = [];
    chosenSuggestion = 0;

    if ((found.note === null) && (found.matches.length === 0)) {
        closeCompletion();
        return;
    };
    if (found.note !== null) {
        let row = completionPopup.insertRow(-1);
        let cell = row.insertCell(0);
        cell.textContent = found.note;
        cell.className = "note";
        return;
    };

    for (const suggestion of found.matches) {
        // Puts commands in button form, so they can be clicked on to replace the command being written
        let row = completionPopup.insertRow(-1);
        let cell = row.insertCell(0);
        let btn = document.createElement("button");
        btn.textContent = suggestion.label;   // The command and what it gives
        btn.value = suggestion.insert;        // What gets written, which is not the same

        btn.type = "button";   // What it looks like is in popup_style.css

        // Complete the command if the user clicks on that command
        btn.addEventListener("click", () => {
            textIn.value = semiAutoCompletion(textIn.value, textIn.selectionEnd, btn.value);
            closeCompletion();
            textIn.focus();
        });

        cell.appendChild(btn);
        suggestions.push(btn);
    };
    pickSuggestion(0);
};


//-----------------------------------------------------//



function main() {
    // Takes the original text (input) and outputs the new one, with the converted symbols
    // Everything the conversion needs to know is passed to core.js as settings

    const result = convert(textIn.value + " ", conversionSettings(settingsFromBox()));

    textOut.value = result.text;
    textOut.disabled = false;
    showErrors(result.errors);
};