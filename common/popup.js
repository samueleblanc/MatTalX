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
    defaultDict,
    spaceCommand,
    errorHeader,
    resetErrors,
    reportError
} from "./core.js";

import {
    defaultSettings,
    loadSettings,
    saveSettings,
    conversionSettings,
    takeInstallReason
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
// Can be accessed with a keyboard shortcut (Alt+C by default) or by clicking the button
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
const setCompletionKey = document.getElementById("shortCompletionK");
const setCompletionLetter = document.getElementById("shortCompletionL");
const showCompletionBtn = document.getElementById("showCompletionBtn");

// The shortcut that opens MatTalX belongs to the browser, not to MatTalX, so the Settings box
// can only show it and open the page where the browser lets the user change it
const settingsOpenShortcut = document.getElementById("settingsOpenShortcut");
const settingsInlineShortcut = document.getElementById("settingsInlineShortcut");
const changeShortcutBtn = document.getElementById("changeShortcutBtn");
changeShortcutBtn.onclick = function() {openShortcutSettings()};

// Commands & Operators
const buildCommandsBtn = document.getElementById("buildNewCommand");
buildCommandsBtn.onclick = function() {buildNewCommand()};
const commandsBuilt = document.getElementById("commandsBuilt");

//-----------------------------------------------------//


/** Other **/

// Used in the subsection 'Completion box' to recognize on which word is the cursor
const wordsDelimiters = [" ", "", "\u000A", "\\", "^", "_", "(", ")", "[", "]", "{", "}", ".", ",", "/", "-", "+", "=", "<", ">", "|", "?", "!", "$"];
const wordsDelimitersWOB = [" ", "", "\u000A", "^", "_", "(", ")", "[", "]", "{", "}", ".", ",", "/", "-", "+", "=", "<", ">", "|", "?", "!", "$"]; // Without backslash





// Colors

// Index 0 is for light mode and 1 is for dark mode
const mainColors = {
    "body" : ["white", "rgb(39,39,39)"],
    "text" : {
        "color" : ["black", "whitesmoke"],
        "background" : ["whitesmoke", "rgb(83,83,83)"],
        "border" : ["rgb(231,231,231)", "rgb(83,83,83)"]
    },
    "infoBtn" : ["white", "rgb(39,39,39)"],
    "shortcuts" : ["black", "whitesmoke"],
    "dropdown" : ["whitesmoke", "rgb(31,31,31)"],
    "btnDropdown" : {
        "color" : ["black", "whitesmoke"],
        "background" : ["whitesmoke", "rgb(31,31,31)"],
        "hover" : ["lightgrey", "rgb(41,41,41)"]
    },
    "mainBtn" : {
        "color" : ["black", "whitesmoke"],
        "background" : ["rgb(230,229,229)", "rgb(53,53,53)"],
        "hover" : ["lightgrey", "rgb(61,61,61)"]
    },
    "mistakes" : ["black", "whitesmoke"],
    "completion" : {
        "border" : ["rgb(238,238,238)", "rgb(31,31,31)"],
        "backgroundTrTd" : ["white", "rgb(39,39,39)"]
    },
    "settingsBox" : {
        "background" : ["rgba(245,245,245,0.7)", "rgba(31,31,31,0.7)"],
        "backgroundBackup" : ["whitesmoke", "rgb(31,31,31)"]
    },
    "settingsContent" : {
        "color" : ["black", "whitesmoke"],
        "background" : ["whitesmoke", "rgb(31,31,31)"],
        "input" : {
            "color" : ["black", "whitesmoke"],
            "background" : ["white", "rgb(61,61,61)"]
        },
        "inputBtn" : {
            "color" : ["black", "whitesmoke"],
            "background" : ["rgb(230,229,229)", "rgb(53,53,53)"],
            "hover" : ["lightgrey", "rgb(61,61,61)"]
        }
    }
};


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
        "completion_key" : setCompletionKey.value,
        "completion_letter" : setCompletionLetter.value,
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
    setCompletionKey.value = settings["completion_key"];
    setCompletionLetter.value = settings["completion_letter"];

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
        [setCopyInputKey.value, "+", setCopyInputLetter.value.toUpperCase()].join(""),
        [setCopyOutputKey.value, "+", setCopyOutputLetter.value.toUpperCase()].join(""),
        [setCompletionKey.value, "+", setCompletionLetter.value.toUpperCase()].join("")
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
    setCompletionKey.value = defaultSettings["completion_key"];
    setCompletionLetter.value = defaultSettings["completion_letter"];
    showCompletionBtn.checked = defaultSettings["completion_button"];

    updateMainColors();
    applySettings();
};

function updateMainColors() {
    // Updates the colors (light or dark mode) of the popup
    const titleLight = document.getElementById("title_light");
    const titleDark = document.getElementById("title_dark");
    const infoBtnLight = document.getElementById("infoButton_light");
    const infoBtnDark = document.getElementById("infoButton_dark");
    const infoImgLight = document.getElementById("info_light");
    const infoImgDark = document.getElementById("info_dark");
    const dropdownInfo = document.getElementById("dropdownInfo");
    const docsBtn = document.getElementById("docs");
    const gitBtn = document.getElementById("git");
    const adjustSpacesBtn = document.getElementById("adjustSpaces");
    const changeFontBtn = document.getElementById("changeFont");
    const changeModeBtn = document.getElementById("changeMode");
    const settingsContent = document.getElementById("settingsContent");
    const settingsContentInp = settingsContent.getElementsByTagName("input");
    const settingsContentSel = settingsContent.getElementsByTagName("select");

    const i = (darkMode.checked) ? 1 : 0;
    document.body.style.backgroundColor = mainColors["body"][i];
    textIn.style.color = mainColors["text"]["color"][i];
    textIn.style.backgroundColor = mainColors["text"]["background"][i];
    textIn.style.border = "2px solid " + mainColors["text"]["border"][i];
    textOut.style.color = mainColors["text"]["color"][i];
    textOut.style.backgroundColor = mainColors["text"]["background"][i];
    textOut.style.border = "2px solid " + mainColors["text"]["border"][i];
    dropdownInfo.style.backgroundColor = mainColors["dropdown"][i];

    docsBtn.style.color = mainColors["btnDropdown"]["color"][i];
    docsBtn.style.backgroundColor = mainColors["btnDropdown"]["background"][i];
    docsBtn.addEventListener("mouseenter", (e) => {
        docsBtn.style.backgroundColor = mainColors["btnDropdown"]["hover"][i];
    });
    docsBtn.addEventListener("mouseleave", (e) => {
        docsBtn.style.backgroundColor = mainColors["btnDropdown"]["background"][i];
    });
    gitBtn.style.color = mainColors["btnDropdown"]["color"][i];
    gitBtn.style.backgroundColor = mainColors["btnDropdown"]["background"][i];
    gitBtn.addEventListener("mouseenter", (e) => {
        gitBtn.style.backgroundColor = mainColors["btnDropdown"]["hover"][i];
    });
    gitBtn.addEventListener("mouseleave", (e) => {
        gitBtn.style.backgroundColor = mainColors["btnDropdown"]["background"][i];
    });
    adjustSpacesBtn.style.color = mainColors["btnDropdown"]["color"][i];
    adjustSpacesBtn.style.backgroundColor = mainColors["btnDropdown"]["background"][i];
    adjustSpacesBtn.addEventListener("mouseenter", (e) => {
        adjustSpacesBtn.style.backgroundColor = mainColors["btnDropdown"]["hover"][i];
    });
    adjustSpacesBtn.addEventListener("mouseleave", (e) => {
        adjustSpacesBtn.style.backgroundColor = mainColors["btnDropdown"]["background"][i];
    });
    changeFontBtn.style.color = mainColors["btnDropdown"]["color"][i];
    changeFontBtn.style.backgroundColor = mainColors["btnDropdown"]["background"][i];
    changeFontBtn.addEventListener("mouseenter", (e) => {
        changeFontBtn.style.backgroundColor = mainColors["btnDropdown"]["hover"][i];
    });
    changeFontBtn.addEventListener("mouseleave", (e) => {
        changeFontBtn.style.backgroundColor = mainColors["btnDropdown"]["background"][i];
    });
    changeModeBtn.style.color = mainColors["btnDropdown"]["color"][i];
    changeModeBtn.style.backgroundColor = mainColors["btnDropdown"]["background"][i];
    changeModeBtn.addEventListener("mouseenter", (e) => {
        changeModeBtn.style.backgroundColor = mainColors["btnDropdown"]["hover"][i];
    });
    changeModeBtn.addEventListener("mouseleave", (e) => {
        changeModeBtn.style.backgroundColor = mainColors["btnDropdown"]["background"][i];
    });
    settingsBtn.style.color = mainColors["btnDropdown"]["color"][i];
    settingsBtn.style.backgroundColor = mainColors["btnDropdown"]["background"][i];
    settingsBtn.addEventListener("mouseenter", (e) => {
        settingsBtn.style.backgroundColor = mainColors["btnDropdown"]["hover"][i];
    });
    settingsBtn.addEventListener("mouseleave", (e) => {
        settingsBtn.style.backgroundColor = mainColors["btnDropdown"]["background"][i];
    });
    convertButton.style.color = mainColors["mainBtn"]["color"][i];
    convertButton.style.backgroundColor = mainColors["mainBtn"]["background"][i];
    convertButton.addEventListener("mouseenter", (e) => {
        convertButton.style.backgroundColor = mainColors["mainBtn"]["hover"][i];
    });
    convertButton.addEventListener("mouseleave", (e) => {
        convertButton.style.backgroundColor = mainColors["mainBtn"]["background"][i];
    });
    resetButton.style.color = mainColors["mainBtn"]["color"][i];
    resetButton.style.backgroundColor = mainColors["mainBtn"]["background"][i];
    resetButton.addEventListener("mouseenter", (e) => {
        resetButton.style.backgroundColor = mainColors["mainBtn"]["hover"][i];
    });
    resetButton.addEventListener("mouseleave", (e) => {
        resetButton.style.backgroundColor = mainColors["mainBtn"]["background"][i];
    });
    copyButton.style.color = mainColors["mainBtn"]["color"][i];
    copyButton.style.backgroundColor = mainColors["mainBtn"]["background"][i];
    copyButton.addEventListener("mouseenter", (e) => {
        copyButton.style.backgroundColor = mainColors["mainBtn"]["hover"][i];
    });
    copyButton.addEventListener("mouseleave", (e) => {
        copyButton.style.backgroundColor = mainColors["mainBtn"]["background"][i];
    });
    completionBtn.style.color = mainColors["mainBtn"]["color"][i];
    completionBtn.style.backgroundColor = mainColors["mainBtn"]["background"][i];
    completionBtn.addEventListener("mouseenter", (e) => {
        completionBtn.style.backgroundColor = mainColors["mainBtn"]["hover"][i];
    });
    completionBtn.addEventListener("mouseleave", (e) => {
        completionBtn.style.backgroundColor = mainColors["mainBtn"]["background"][i];
    });

    mistakesBox.style.color = mainColors["mistakes"][i];
    completionPopup.style.border = "1px solid " + mainColors["completion"]["border"][i];
    completionPopup.style.backgroundColor = mainColors["completion"]["border"][i];
    settingsBox.style.backgroundColor = mainColors["settingsBox"]["backgroundBackup"][i];
    settingsBox.style.backgroundColor = mainColors["settingsBox"]["background"][i];
    settingsContent.style.color = mainColors["settingsContent"]["color"][i];
    settingsContent.style.backgroundColor = mainColors["settingsContent"]["background"][i];
    resetSettingsButton.addEventListener("mouseenter", (e) => {
        resetSettingsButton.style.backgroundColor = mainColors["settingsContent"]["inputBtn"]["hover"][i];
    });
    resetSettingsButton.addEventListener("mouseleave", (e) => {
        resetSettingsButton.style.backgroundColor = mainColors["settingsContent"]["inputBtn"]["background"][i];
    });
    buildCommandsBtn.addEventListener("mouseenter", (e) => {
        buildCommandsBtn.style.backgroundColor = mainColors["settingsContent"]["inputBtn"]["hover"][i];
    });
    buildCommandsBtn.addEventListener("mouseleave", (e) => {
        buildCommandsBtn.style.backgroundColor = mainColors["settingsContent"]["inputBtn"]["background"][i];
    });
    changeShortcutBtn.addEventListener("mouseenter", (e) => {
        changeShortcutBtn.style.backgroundColor = mainColors["settingsContent"]["inputBtn"]["hover"][i];
    });
    changeShortcutBtn.addEventListener("mouseleave", (e) => {
        changeShortcutBtn.style.backgroundColor = mainColors["settingsContent"]["inputBtn"]["background"][i];
    });

    let j;
    for (j=0; j<settingsContentInp.length; j++) {
        if ((settingsContentInp[j].type == "number") || (settingsContentInp[j].type == "text")) {
            settingsContentInp[j].style.color = mainColors["settingsContent"]["input"]["color"][i];
            settingsContentInp[j].style.backgroundColor = mainColors["settingsContent"]["input"]["background"][i];
        } else if (settingsContentInp[j].type == "button") {
            settingsContentInp[j].style.color = mainColors["settingsContent"]["inputBtn"]["color"][i];
            settingsContentInp[j].style.backgroundColor = mainColors["settingsContent"]["inputBtn"]["background"][i];
        };
    };
    for (j=0; j<settingsContentSel.length; j++) {
        settingsContentSel[j].style.color = mainColors["settingsContent"]["input"]["color"][i];
        settingsContentSel[j].style.backgroundColor = mainColors["settingsContent"]["input"]["background"][i];
    };

    if (darkMode.checked) {
        titleDark.style.display = "inline-block";
        titleDark.style.width = "25%";
        titleDark.style.height = "25%";
        titleDark.style.marginLeft = "37%";
        titleDark.style.marginRight = "37%";
        titleLight.style.display = "none";
        infoBtnDark.style.display = "inline-block";
        infoBtnDark.style.border = "none";
        infoBtnDark.style.float = "right";
        infoBtnDark.style.backgroundColor = mainColors["infoBtn"][i];
        infoBtnLight.style.display = "none";
        infoImgDark.style.display = "inline-block";
        infoImgDark.style.width = "15px";
        infoImgDark.style.height = "15px";
        infoImgDark.style.cursor = "default";
        infoImgDark.style.float = "right";
        infoImgLight.style.display = "none";
    } else {
        titleLight.style.display = "inline-block";
        titleLight.style.width = "25%";
        titleLight.style.height = "25%";
        titleLight.style.marginLeft = "37%";
        titleLight.style.marginRight = "37%";
        titleDark.style.display = "none";
        infoBtnLight.style.display = "inline-block";
        infoBtnLight.style.border = "none";
        infoBtnLight.style.float = "right";
        infoBtnLight.style.backgroundColor = mainColors["infoBtn"][i];
        infoBtnDark.style.display = "none";
        infoImgLight.style.display = "inline-block";
        infoImgLight.style.width = "15px";
        infoImgLight.style.height = "15px";
        infoImgLight.style.cursor = "default";
        infoImgLight.style.float = "right";
        infoImgDark.style.display = "none";
    };
};

darkMode.addEventListener("click", (e) => {
    updateMainColors();
});

document.addEventListener("keydown", (keyPressed) => {
    // Listens for keydown to open completion popup, copy the input text or copy the output
    if (((keyPressed.key === setCompletionLetter.value.toLowerCase()) || (keyPressed.key === setCompletionLetter.value.toUpperCase())) && 
         (
          (keyPressed.altKey && ("Alt" === setCompletionKey.value)) || 
          (keyPressed.ctrlKey && ("Ctrl" === setCompletionKey.value)) || 
          (keyPressed.altKey && keyPressed.shiftKey && ("Alt+Shift" === setCompletionKey.value)) ||
          (keyPressed.ctrlKey && keyPressed.shiftKey && ("Ctrl+Shift" === setCompletionKey.value))
          ) &&
         (textIn == document.activeElement)) {
        // Shows completion but closes the popup if the completion box is already opened
        getCompletion();
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
            if (keyPressed.key === "Backspace") {
                completionPopup.textContent = "";
                let word = findWord(textIn.value, textIn.selectionEnd - 1, "Backspace");
                completion(word);
            } else if (keyPressed.code === "Space") {
                closeCompletion();
            } else if (keyPressed.key.length === 1) {  // i.e. A letter
                completionPopup.textContent = "";
                let word = findWord(textIn.value, textIn.selectionEnd - 1, keyPressed.key);
                completion(word);
            } else if ((keyPressed.key === "ArrowUp") || (keyPressed.key === "ArrowRight") || (keyPressed.key === "ArrowLeft") || (keyPressed.key === "ArrowDown")) {
                completionPopup.textContent = "";
                const arrows = {"ArrowUp": 0, "ArrowRight": 1, "ArrowLeft": -1, "ArrowDown": 0};
                let word = findWord(textIn.value, (textIn.selectionEnd - 1 + arrows[keyPressed.key]));  // Only adjusts the cursor position for right and left arrows
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
    const darkModeInt = (darkMode.checked) ? 1 : 0;

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
    selectCmdType.style.color = mainColors["settingsContent"]["input"]["color"][darkModeInt];
    selectCmdType.style.backgroundColor = mainColors["settingsContent"]["input"]["background"][darkModeInt];
    typeInput.appendChild(selectCmdType);
    row1.appendChild(typeInput);

    row1.appendChild(curlyBracketsLeftCN);

    // newCommandName is the command name *to be* used
    let newCommandName = document.createElement("td");
    let inputNewCommandName = document.createElement("input");
    inputNewCommandName.type = "text";
    inputNewCommandName.style.color = mainColors["settingsContent"]["input"]["color"][darkModeInt];
    inputNewCommandName.style.backgroundColor = mainColors["settingsContent"]["input"]["background"][darkModeInt];
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
    numArgs.style.color = mainColors["settingsContent"]["input"]["color"][darkModeInt];
    numArgs.style.backgroundColor = mainColors["settingsContent"]["input"]["background"][darkModeInt];
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
    inputDefaultCommandArg.style.color = mainColors["settingsContent"]["input"]["color"][darkModeInt];
    inputDefaultCommandArg.style.backgroundColor = mainColors["settingsContent"]["input"]["background"][darkModeInt];
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
    deleteCommandBtn.style.color = mainColors["settingsContent"]["inputBtn"]["color"][darkModeInt];
    deleteCommandBtn.style.backgroundColor = mainColors["settingsContent"]["inputBtn"]["background"][darkModeInt];

    // Commented out since it leads to a bug. The color chosen now "sticks" to the button. Therefore, if the user changes 
    // the color mode, the button won't have the right color when hover.
    /*
    deleteCommandBtn.addEventListener("mouseenter", (e) => {
        deleteCommandBtn.style.backgroundColor = mainColors["settingsContent"]["inputBtn"]["hover"][darkModeInt];
    });
    deleteCommandBtn.addEventListener("mouseleave", (e) => {
        deleteCommandBtn.style.backgroundColor = mainColors["settingsContent"]["inputBtn"]["background"][darkModeInt];
    });
    */

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

function findWord(text, cursorPosition, addedLetter="") {
    // Used in the completion popup
    // Finds the word that is touched by the cursor
    if (addedLetter.length === 1) {  // ie a letter
        text = text.split("");
        text[cursorPosition] += addedLetter;
        text = text.join("");
    } else if (addedLetter === "Backspace") {
        text = text.split("");
        text[cursorPosition] = "";
        text = text.join("");
        --cursorPosition;
    };
    let word = "";
    while (!(wordsDelimiters.includes(text.charAt(cursorPosition + 1)))) {
        ++cursorPosition;
    };
    while (!(wordsDelimitersWOB.includes(text.charAt(cursorPosition)))) {
        if (text.charAt(cursorPosition) === "\\") {
            word = text.charAt(cursorPosition) + word;
            break;
        } else {
            word = text.charAt(cursorPosition) + word;
            --cursorPosition;
        }
    };
    return word;
};

function completion(command) {
    // Outputs list of other commands that are similar to the one currently being written
    const btnBackColor = mainColors["completion"]["backgroundTrTd"][(darkMode.checked) ? 1 : 0];
    const btnFontColor = (darkMode.checked) ? "whitesmoke" : "black";
    if (command === "") {
        closeCompletion();
    } else if (command[0] !== "\\") {
        let row = completionPopup.insertRow(-1);
        let cell = row.insertCell(0);
        cell.textContent = "The first character of the command must be a backslash (\\). Superscript starts with ^ and subscript with _";
        cell.style.color = btnFontColor;
    } else {
        command = command.substring(1, command.length);  // Erases the backslash so that, for instance, \arrow will also show \rightarrow, etc.
        for (let keys in defaultDict) {
            // Puts commands in button form, so they can be clicked on to replace the command being written
            if (keys.toLowerCase().indexOf(command.toLowerCase()) !== -1) {
                let row = completionPopup.insertRow(-1);
                let cell = row.insertCell(0);
                let btn = document.createElement("button");
                btn.name = showCommand(keys);
                btn.textContent = toReplaceCommand(keys);
                btn.value = toReplaceCommand(keys);  // Value is unchanged

                // Button style
                btn.style.width = "145px";  // Would be cleaner with something like 'fit-content', but is way to slow
                btn.style.height = "17px";
                btn.style.backgroundColor = btnBackColor
                btn.style.border = "1px solid " + btnBackColor;
                btn.style.color = btnFontColor;
                btn.style.borderRadius = "3px";
                btn.type = "button";
                btn.tabIndex = "0";

                cell.style.border = "1px solid " + btnBackColor;
                cell.style.backgroundColor = btnBackColor;

                // Complete the command if the user clicks on that command
                btn.addEventListener("click", () => {
                    textIn.value = semiAutoCompletion(textIn.value, textIn.selectionEnd, btn.value);
                    closeCompletion();
                    textIn.focus();
                });

                // Shows what the command ouputs on mouseover, return to normal on mouseout
                btn.addEventListener("mouseover", () => {
                    let tmp = btn.textContent;
                    btn.textContent = btn.name;
                    btn.name = tmp;
                });
                btn.addEventListener("mouseout", () => {
                    let tmp = btn.textContent;
                    btn.textContent = btn.name;
                    btn.name = tmp;
                });
                cell.appendChild(btn);
            };
        };
    };
};

function semiAutoCompletion(textIn, cursorPosition, command) {
    // Replace the command being written by the selected suggestion
    let textOut = textIn;
    // Find end of word
    while (!(wordsDelimiters.includes(textIn.charAt(cursorPosition)))) {
        ++cursorPosition;
    };
    // Deletes word
    while (textIn.charAt(cursorPosition - 1) !== "\\") {
        textOut = textOut.substring(0, cursorPosition - 1) + textOut.substring(cursorPosition);
        --cursorPosition;
    };
    // Replace by selected suggestion
    textOut = textOut.substring(0, cursorPosition - 1) + command + textOut.substring(cursorPosition);
    return textOut;
};

function showCommand(key) {
    // Used in completion
    // Changes what's seen when the user hovers on a command in the completion popup
    if (typeof defaultDict[key] == "function") {
        if (key == "\\sqrt") {
            return "\\sqrt[n]{x} \u2192 ⁿ√𝑥";
        } else if (key == "\\frac") {
            return "\\frac{1}{2} \u2192 ¹∕₂";
        } else if (key == "\\frac*") {
            return "\\frac*{1}{2} \u2192 ½";
        } else if ((key == "\\overset") || (key == "\\underset") || (key == "\\stackrel") || (key == "\\hspace") || (key == "\\vskip")) {
            return key + "{}";
        } else if ((key == "_") || (key == "^")) {
            return "x" + key + "{a1} \u2192 𝑥" + spaceCommand((defaultDict[key]([["a", "1"]], key)).join(""));
        } else if (key == "\\pmod") {
            return key + "{n} \u2192 " + spaceCommand(defaultDict[key]([["n"]], key).join(""));
        } else if (key == "\\matrix") {
            return key + "{[a,b]} \u2192 " + spaceCommand(defaultDict[key](["[a,b]".split("")], key).join(""));
        } else {
            return key + "{abc} \u2192 " + spaceCommand((defaultDict[key]([["a", "b", "c"]], key)).join(""));
        };
    } else {
        if (key == "\\:") {
            return "1 space";
        } else if ((key == "\\;") || ((key == "\\quad") || (key == "\\qquad"))) {
            return defaultDict[key].length + " spaces";
        } else if (key === "\\!") {
            return "Remove a space";
        } else if ((key == "\\id2") || (key == "\\id3") || (key == "\\id4") || (key == "\\idn")) {
            const M = {
                "\\id2": "⎡ 1 0 ⎤\u000A⎣ 0 1 ⎦",
                "\\id3" : "⎡ 1 0 0 ⎤\u000A⎢ 0 1 0 ⎥\u000A⎣ 0 0 1 ⎦",
                "\\id4" : "⎡ 1 0 0 0 ⎤\u000A⎢ 0 1 0 0 ⎥\u000A⎢ 0 0 1 0 ⎥\u000A⎣ 0 0 0 1 ⎦",
                "\\idn" : "⎡ 1 0 ⋯ 0 ⎤\u000A⎢ 0 1 ⋯ 0 ⎥\u000A⎢  ⋮  ⋮  ⋱  ⋮ ⎥\u000A⎣ 0 0 ⋯ 1 ⎦"
            }
            return M[key];
        } else {
            return spaceCommand(defaultDict[key]);
        };
    };
};

function toReplaceCommand(key) {
    // Used in completion
    // Changes what the user sees when the completion popup is opened
    if (typeof defaultDict[key] == "function") {
        if (key == "\\sqrt") {
            return "\\sqrt[]{}";
        } else if (key == "\\frac") {
            return "\\frac{}{}";
        } else if (key == "\\frac*") {
            return "\\frac*{}{}";
        } else {
            return key + "{}";
        };
    } else {
        return key
    };
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