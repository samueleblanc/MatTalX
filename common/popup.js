/*
    The main purpose of this program is to take a text as input (mostly LaTeX commands), 
    to convert them into the desired symbol (UTF) and finally to display them so they can 
    be copied and sent via Messenger, Instagram, Twitter, etc.
*/

import { mathDictionary } from "./unicode/mathsymbols";
import { addSymbol, spaceCommand, prohibitedType, mistakes } from "./convert"




/// Global variables ///



// Submit button ('Convert' is what's seen by the users)
const submit = document.getElementById("button");
submit.onclick = function() {main()};

// Copy button
const copyButton = document.getElementById("copy");
copyButton.onclick = function() {copyTextOut()};

// Clear button
const resetButton = document.getElementById("reset");
resetButton.onclick = function() {clear()};

// Remove spaces button
const spacesButton = document.getElementById("adjust");

// Originally hidden
// Can be accessed with a keyboard shortcut (Alt+S or Alt+C on chrome or firefox respectively)
const suggestionsPopup = document.getElementById("suggestions");

// Every undefined commands
let errorsList = "";

const textIn = document.getElementById("text_in");


/// FUNCTIONS ///

function suggestions(command) {
    // Outputs list of other commands that are similar to the one currently being written
    if (command === "") {
        closeSuggestions();
    } else if (command[0] !== "\\") {
        let row = suggestionsPopup.insertRow(-1);
        let cell = row.insertCell(0);
        cell.textContent = "The first character of the command must be a backslash (\\). Superscript starts with ^ and subscript with _";
    } else {
        command = command.substring(1, command.length);  // Erases the backslash so that, for instance, \arrow will also show \rightarrow, etc.
        for (keys in mathDictionary) {
            // Puts commands in button form, so they can be clicked on to replace the command being written
            if (keys.toLowerCase().indexOf(command.toLowerCase()) !== -1) {
                let row = suggestionsPopup.insertRow(-1);
                let cell = row.insertCell(0);
                let btn = document.createElement("button");
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
                    let x = btn.textContent;
                    btn.textContent = btn.value;
                    btn.value = x;
                });
                btn.addEventListener("mouseout", () => {
                    let x = btn.textContent;
                    btn.textContent = btn.value;
                    btn.value = x;
                });
                cell.appendChild(btn);
            };
        };
    };
};

function closeSuggestions() {
    // Close and empties the suggestion popup
    suggestionsPopup.style.display = "none";
    suggestionsPopup.textContent = "";
};


function copyTextOut() {
    // Copy second box (output) to clipboard
    const copyText = document.getElementById("text_out");
    if (copyText.disabled === false) {
        navigator.clipboard.writeText(copyText.value);
        copyButton.value = "Copied!";
        copyButton.style.cursor = "default";
        copyText.style.border = "2px solid black";

        setTimeout(() => {
            copyButton.value = "Copy text";
            copyButton.style.cursor = "pointer";
            copyText.style.border = "1px solid black";
        }, 2500)  // Returns to initial copyButton
    };
};

function copyTextIn() {
    // Copy first box (input) to clipboard
    navigator.clipboard.writeText(textIn.value);
    textIn.style.border = "2px solid black";
    setTimeout(() => {
        textIn.style.border = "1px solid black";
    }, 2500);
};

function clear() {
    // Clears everything
    copyButton.value = "Copy text";
    copyButton.style.cursor = "pointer";
    document.getElementById("mistakes").textContent = "";
    document.getElementById("text_out").disabled = true;
    suggestionsPopup.style.display = "none";
    suggestionsPopup.textContent = "";
};

function replaceText(fullText, plainTextConverter) {
    // Main function, loops on letters and convert the input into characters
    // TODO: Clean it up, and maybe restructure it completely, a more 'object oriented' way to do it is perhaps better
    let newText = "";
    let temporaryBox = [];  // Stores characters that are in command (e.g. \int -> ['\', 'i', 'n', 't'])
    let temporaryArg = [];  // Stores characters that are in command arguments (e.g. \text{ok} -> ['o', 'k'])
    let commandInArg = [];  // Stores characters that are a command inside arguments (e.g. \dot{\equiv} -> ['\','e','q','u','i','v'])
    let trigger = false;  // true if a command has begun (e.g. input: '\' -> true)
    let arg = false;  // true if there's an argument at the end of a command (e.g. \mathbf + '{' -> true)
    let triggerInArg = false;  // true if there's a command in an argument (e.g. \overline{ + '\' -> true)
    let numberCurly = 0;  // Counts the number of curly brackets (except those used in the text like in 'S = {1,2,3}')
    const parentheses = ["(", ")"];
    const brackets = ["[", "]"];
    const commandStoppers = [" ", ",", "/", "-", "+", "=", "<", ">", "|", "?", "!"];  // parentheses and brackets also stops commands (most of the time)

    for (let char=0; char<fullText.length; char++) {
        if (trigger) {
            if (arg) {
                if (triggerInArg) {
                    if (commandStoppers.includes(fullText[char])) {
                        temporaryArg.push(prohibitedType(mathDictionary[commandInArg.join("")]));
                        temporaryArg.push(plainTextConverter[fullText[char]]);
                        commandInArg = [];
                        triggerInArg = false;
                    } else if (fullText[char] === "}") {
                        if (fullText[char - 1] === "\\") {
                            temporaryArg.push(fullText[char]);
                            triggerInArg = false;
                            commandInArg = [];
                        } else {
                            if (temporaryBox.join("").slice(0, 5) === "\\sqrt") {
                                temporaryArg.push(prohibitedType(mathDictionary[commandInArg.join("")]));
                                newText += addSymbol(mathDictionary["\\sqrt"](temporaryArg, temporaryBox.join("")));
                                mistakes(temporaryBox.join("") + "{" + temporaryArg.join("") + "}", mathDictionary["\\sqrt"], temporaryBox.join(""));
                                temporaryBox = [];
                                temporaryArg = [];
                                commandInArg = [];
                                triggerInArg = false;
                                arg = false;
                                trigger = false;
                                    numberCurly += 1;
                            } else if ((temporaryBox.join("") === "\\frac") || (temporaryBox.join("") === "\\frac*")) {
                                if (temporaryArg.indexOf("}") === -1) {
                                    temporaryArg.push(prohibitedType(mathDictionary[commandInArg.join("")]));
                                    temporaryArg.push(fullText[char]);
                                    commandInArg = [];
                                    triggerInArg = false;
                                } else {
                                    if ((temporaryArg.join("") === "\\frac") || (temporaryArg.join("") === "\\frac*")) {
                                        temporaryArg.push(prohibitedType(mathDictionary[commandInArg.join("")]));
                                        newText += addSymbol(mathDictionary[temporaryBox.join("")](temporaryArg, temporaryBox.join("")));
                                        mistakes(temporaryBox.join("") + "{" + temporaryArg.join("") + "}", undefined, "Embedded \\frac are currently not accepted");
                                        temporaryBox = [];
                                        temporaryArg = [];
                                        commandInArg = [];
                                        triggerInArg = false;
                                        arg = false;
                                        trigger = false;
                                        numberCurly += 1;
                                    } else {
                                        temporaryArg.push(prohibitedType(mathDictionary[commandInArg.join("")]));
                                        newText += addSymbol(mathDictionary[temporaryBox.join("")](temporaryArg, temporaryBox.join("")));
                                        mistakes(temporaryBox.join("") + "{" + temporaryArg.join("") + "}", mathDictionary[temporaryBox.join("")], temporaryBox.join(""));
                                        temporaryBox = [];
                                        temporaryArg = [];
                                        commandInArg = [];
                                        triggerInArg = false;
                                        arg = false;
                                        trigger = false;
                                        numberCurly += 1;
                                    };
                                }
                            } else {
                                temporaryArg.push(prohibitedType(mathDictionary[commandInArg.join("")]));
                                newText += addSymbol(mathDictionary[temporaryBox.join("")](temporaryArg, temporaryBox.join("")));
                                mistakes(temporaryBox.join("") + "{" + temporaryArg.join("") + "}", mathDictionary[temporaryBox.join("")], temporaryBox.join(""));
                                temporaryBox = [];
                                temporaryArg = [];
                                commandInArg = [];
                                triggerInArg = false;
                                arg = false;
                                trigger = false;
                                numberCurly += 1;
                            };
                        };
                    } else if (parentheses.includes(fullText[char])) {
                        if (fullText[char - 1] === "\\") {
                            temporaryArg.push(fullText[char]);
                            triggerInArg = false;
                            commandInArg = [];
                        } else {
                            temporaryArg.push(prohibitedType(mathDictionary[commandInArg.join("")]));
                            temporaryArg.push(fullText[char]);
                            commandInArg = [];
                            triggerInArg = false;
                        };
                    } else if (brackets.includes(fullText[char])) {
                        if (fullText[char - 1] === "\\") {
                            temporaryArg.push(fullText[char]);
                            triggerInArg = false;
                            commandInArg = [];
                        } else {
                            if (commandInArg.join("").slice(0, 5) === "\\sqrt") {
                                commandInArg.push(fullText[char]);
                            } else {
                                temporaryArg.push(prohibitedType(mathDictionary[commandInArg.join("")]));
                                temporaryArg.push(fullText[char]);
                                commandInArg = [];
                                triggerInArg = false;
                            };
                        };
                    } else if (fullText[char] === "{") {
                        if (fullText[char - 1] === "\\") {
                            temporaryArg.push(fullText[char]);
                            triggerInArg = false;
                            commandInArg = [];
                        } else {
                            if ((commandInArg.join("") === "\\frac") || commandInArg.join("") === "\\frac*") {
                                mistakes(temporaryBox.join("") + "{" + temporaryArg.join("") + "}", undefined, "Embedded \\frac are currently not accepted. Try: ^{(y/z)}/_{x} ⇒ ⁽ʸᐟᶻ⁾/ₓ"); 
                            } else {
                                let embCommand = embeddedCommand(commandInArg.join(""), fullText.substring(char), plainTextConverter);
                                for (let i in embCommand[0]) {
                                    temporaryArg.push(embCommand[0][i]);
                                };
                                char += embCommand[1] + 1;
                                triggerInArg = false;
                                commandInArg = [];
                            };
                        };
                    } else if ((fullText[char] === "\\") || (fullText[char] === "^") || (fullText[char] === "_")) {
                        temporaryArg.push(prohibitedType(mathDictionary[commandInArg.join("")]));
                        commandInArg = [fullText[char]];
                    } else {
                        commandInArg.push(fullText[char]);
                    };
                } else {
                    if (fullText[char] === "}") {
                        if (temporaryBox.join("").slice(0, 5) === "\\sqrt") {
                            mistakes(temporaryBox.join("") + "{" + temporaryArg.join("") + "}", mathDictionary["\\sqrt"], temporaryBox.join(""));
                            newText += addSymbol(mathDictionary["\\sqrt"](temporaryArg, temporaryBox.join("")));
                            temporaryBox = [];
                            temporaryArg = [];
                            arg = false;
                            trigger = false;
                            numberCurly += 1;
                        } else if ((temporaryBox.join("") === "\\frac") || (temporaryBox.join("") === "\\frac*")) {
                            if (temporaryArg.indexOf("}") === -1) {
                                temporaryArg.push(fullText[char]);
                            } else {
                                mistakes(temporaryBox.join("") + "{" + temporaryArg.join("") + "}", mathDictionary[temporaryBox.join("")], temporaryBox.join(""));
                                newText += addSymbol(mathDictionary[temporaryBox.join("")](temporaryArg, temporaryBox.join("")));
                                temporaryBox = [];
                                temporaryArg = [];
                                arg = false;
                                trigger = false;
                                numberCurly += 1;
                            };
                        } else {
                            mistakes(temporaryBox.join("") + "{" + temporaryArg.join("") + "}", mathDictionary[temporaryBox.join("")], temporaryBox.join(""));
                            newText += addSymbol(mathDictionary[temporaryBox.join("")](temporaryArg, temporaryBox.join("")));
                            temporaryBox = [];
                            temporaryArg = [];
                            arg = false;
                            trigger = false;
                            numberCurly += 1;
                        };
                    } else if ((fullText[char] === "\\") || (fullText[char] === "^") || (fullText[char] === "_")) {
                        triggerInArg = true;
                        commandInArg.push(fullText[char]);
                    } else {
                        temporaryArg.push(plainTextConverter[fullText[char]]);
                    };
                };
            } else {
                if (fullText[char] == "{") {
                    if (fullText[char - 1] === "\\") {
                        newText += addSymbol(plainTextConverter[fullText[char]]);
                        trigger = false;
                        temporaryBox = [];
                    } else {
                        if ((typeof mathDictionary[temporaryBox.join("")] == "function") || (temporaryBox.join("").slice(0, 5) === "\\sqrt")) {
                            arg = true;
                            numberCurly += 1;
                        } else {
                            if ((typeof mathDictionary[temporaryBox.join("")] == "function") || (temporaryBox.join("").slice(0, 5) === "\\sqrt")) {
                                arg = true;
                                numberCurly += 1;
                            } else {
                                newText += addSymbol(mathDictionary[temporaryBox.join("")]);
                                mistakes(temporaryBox.join(""), mathDictionary[temporaryBox.join("")]);
                                newText += "{";
                                temporaryBox = [];
                                trigger = false;
                            };
                        };
                    };
                } else if (fullText[char] == "}") {
                    if (fullText[char - 1] === "\\") {
                        newText += addSymbol(plainTextConverter[fullText[char]]);
                        trigger = false;
                        temporaryBox = [];
                    } else {
                        newText += addSymbol(mathDictionary[temporaryBox.join("")]);
                        newText += addSymbol(undefined);
                        mistakes(temporaryBox.join("") + "}", undefined, " '" + temporaryBox.join("") + "\\}' and " + "'" + temporaryBox.join("") + " }' ⇒ '" + temporaryBox.join("") + "}' ");
                        temporaryBox = [];
                        trigger = false;
                    }
                } else if (commandStoppers.includes(fullText[char])) {
                    if (temporaryBox.join("").replace(/\[.*\]/g, "") === "\\sqrt*") {
                        newText += addSymbol(mathDictionary["\\sqrt*"](undefined, temporaryBox.join("")));
                        mistakes(temporaryBox.join(""), mathDictionary["\\sqrt*"]);
                        newText += addSymbol(plainTextConverter[fullText[char]]);
                        temporaryBox = [];
                        trigger = false;
                    } else {
                        newText += !(typeof mathDictionary[temporaryBox.join("")] == "function") ? 
                        addSymbol(mathDictionary[temporaryBox.join("")]) + plainTextConverter[fullText[char]] : mistakes(temporaryBox.join("") + "{} needs an argument.", undefined);
                        mistakes(temporaryBox.join(""), mathDictionary[temporaryBox.join("")]);
                        temporaryBox = [];
                        trigger = false;
                    };
                } else if ((fullText[char] === "\\") || (fullText[char] === "^") || fullText[char] === "_") {
                    if (fullText[char - 1] === "\\") {
                        temporaryBox.push(fullText[char]);
                        newText += addSymbol(mathDictionary[temporaryBox.join("")]);
                        trigger = false;
                        temporaryBox = [];
                    } else {
                        if (temporaryBox.join("").replace(/\[.*\]/g, "") === "\\sqrt*") {
                            newText += addSymbol(mathDictionary["\\sqrt*"](undefined, temporaryBox.join("")));
                            mistakes(temporaryBox.join(""), mathDictionary["\\sqrt*"]);
                            temporaryBox = [fullText[char]];
                        } else {
                            newText += !(typeof mathDictionary[temporaryBox.join("")] == "function") ? 
                            addSymbol(mathDictionary[temporaryBox.join("")]) : mistakes(temporaryBox.join("") + "{} needs an argument.", undefined);
                            mistakes(temporaryBox.join(""), mathDictionary[temporaryBox.join("")]);
                            temporaryBox = [fullText[char]];
                        };
                    };
                } else if (parentheses.includes(fullText[char])) {
                    if (temporaryBox.join("").replace(/\[.*\]/g, "") === "\\sqrt*") {
                        newText += addSymbol(mathDictionary["\\sqrt*"](undefined, temporaryBox.join("")));
                        mistakes(temporaryBox.join(""), mathDictionary["\\sqrt*"]);
                        newText += addSymbol(plainTextConverter[fullText[char]]);
                        temporaryBox = [];
                        trigger = false;
                    } else {
                        newText += !(typeof mathDictionary[temporaryBox.join("")] == "function") ? 
                        addSymbol(mathDictionary[temporaryBox.join("")]) : mistakes(temporaryBox.join("") + "{} needs an argument.", undefined);
                        mistakes(temporaryBox.join(""), mathDictionary[temporaryBox.join("")]);
                        newText += addSymbol(plainTextConverter[fullText[char]]);
                        temporaryBox = [];
                        trigger = false;
                    };
                } else if (brackets.includes(fullText[char])) {
                    if (temporaryBox.join("").slice(0,5) === "\\sqrt") {
                        temporaryBox.push(fullText[char]);
                    } else {
                        newText += !(typeof mathDictionary[temporaryBox.join("")] == "function") ? 
                        addSymbol(mathDictionary[temporaryBox.join("")]) : mistakes(temporaryBox.join("") + "{} needs an argument.", undefined);
                        mistakes(temporaryBox.join(""), mathDictionary[temporaryBox.join("")]);
                        newText += addSymbol(plainTextConverter[fullText[char]]);
                        temporaryBox = [];
                        trigger = false;
                    };
                } else {
                    temporaryBox.push(fullText[char]);
                };
            };
        } else {
            if ((fullText[char] === "\\") || (fullText[char] === "^") || (fullText[char] === "_")) {
                temporaryBox.push(fullText[char]);
                trigger = true;
            } else {
                newText += addSymbol(plainTextConverter[fullText[char]]);
                mistakes(fullText[char], plainTextConverter[fullText[char]]);
            }
        };
    };
    if (numberCurly % 2 !== 0) {
        mistakes("Missing curly brackets { }", undefined);
    };
    return newText;
};

function embeddedCommand(command, endOfText, plainTextConverter) {
    // Is called if there is a command as an argument of a command
    let args = [];
    endOfText = endOfText.substring(1);
    for (let c in endOfText) {
        if (endOfText[c] === "}") {
            if (endOfText[c - 1] === "\\") {
                args.splice(-1, 1);
                args.push(endOfText[c]);
            } else {
                if (command.slice(0, 5) === "\\sqrt") {
                    mistakes("Embedded \\sqrt are not best practice, use '\\sqrt[n]* (\\sqrt[k]* x)' instead of '\\sqrt[n]{\\sqrt[k]{x}}'", undefined, "ⁿ√(ᵏ√𝑥)");
                    return [addSymbol(mathDictionary["\\sqrt"](args, command), true), parseInt(c)];
                } else {
                    return [addSymbol(mathDictionary[command](args, command), true), parseInt(c)];
                };
            };
        } else {
            args.push(plainTextConverter[endOfText[c]]);
        };
    };
};



function convert(fullText) {
    // Takes text and convert word by word in the dictionary or in function replaceLetters
    const firstWord = fullText.split(" ")[0];
    if (firstWord === "$chem") {
        // Chemistry package, differs in the automatic conversion of letters and spacing adjustments
        fullText = fullText.replace("$chem", "");
        fullText = replaceText(fullText, lettersChem);
        fullText = adjustSpaceChem(fullText);
    } else if (firstWord === "$matrix") {
        // Matrix package, the input should be of the form [a,b,c][d,e,f]
        fullText = fullText.replace("$matrix", "");
        fullText = matrix(fullText);
    } else {
        // Default package
        fullText = replaceText(fullText, lettersSymbols);
        fullText = adjustSpaces(fullText);
    };
    return fullText;
};

function main() {
    // Takes the original text (input) and outputs the new one, with the converted symbols

    document.getElementById("mistakes").textContent = "";  // Starts with an empty box for errors
    errorsList = "";  // Makes sure it starts empty

    let fullText = document.text_input.text_in.value;
    fullText = fullText.replace(/\u000A/g, " "); // Cancels the line skipped by pressing "enter", use "\\" instead

    fullText = convert(fullText + " ");
    document.text_input.text_out.value = fullText;
    document.getElementById("text_out").disabled = false;
};
