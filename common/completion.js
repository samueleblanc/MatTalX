/*
    The commands MatTalX suggests while the user is writing one.

    Knows nothing about the DOM: the popup and the page both ask for the same list and
    draw it their own way, so what is suggested in one can't drift from the other.
*/

"use strict";

import { convert, defaultDict, spaceCommand } from "./core.js";

// What tells one word from the next, so the completion knows which one the cursor is on
const wordsDelimiters = [" ", "", "\u000A", "\\", "^", "_", "(", ")", "[", "]", "{", "}", ".", ",", "/", "-", "+", "=", "<", ">", "|", "?", "!", "$"];
const wordsDelimitersWOB = [" ", "", "\u000A", "^", "_", "(", ")", "[", "]", "{", "}", ".", ",", "/", "-", "+", "=", "<", ">", "|", "?", "!", "$"]; // Without backslash

export const noBackslash = "The first character of the command must be a backslash (\\). " +
                           "Superscript starts with ^ and subscript with _";

export function findWord(text, cursorPosition, addedLetter="") {
    // Finds the word that is touched by the cursor
    // The letter that was just typed has to be added by hand, since the key is read before
    // the page has had the time to write it
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

export function semiAutoCompletion(textIn, cursorPosition, command) {
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
    // What a suggestion shows when the user hovers on it: the command and what it gives
    if (typeof defaultDict[key] == "function") {
        if (key == "\\sqrt") {
            return "\\sqrt[n]{x} → ⁿ√𝑥";
        } else if (key == "\\frac") {
            return "\\frac{1}{2} → ¹∕₂";
        } else if (key == "\\frac*") {
            return "\\frac*{1}{2} → ½";
        } else if ((key == "\\overset") || (key == "\\underset") || (key == "\\stackrel") || (key == "\\hspace") || (key == "\\vskip")) {
            return key + "{}";
        } else if ((key == "_") || (key == "^")) {
            return "x" + key + "{a1} → 𝑥" + spaceCommand((defaultDict[key]([["a", "1"]], key)).join(""));
        } else if (key == "\\pmod") {
            return key + "{n} → " + spaceCommand(defaultDict[key]([["n"]], key).join(""));
        } else if (key == "\\matrix") {
            return key + "{[a,b]} → " + spaceCommand(defaultDict[key](["[a,b]".split("")], key).join(""));
        } else {
            return key + "{abc} → " + spaceCommand((defaultDict[key]([["a", "b", "c"]], key)).join(""));
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
    // What a suggestion shows, and what it writes in place of the command being typed
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

function builtCommands(customCommands) {
    // The commands the user built themselves, shown like the ones MatTalX already knows
    // What they give is read from the conversion itself, which is the only thing that
    // knows what a command the user wrote yesterday does
    const built = [];
    for (const command of customCommands) {
        if ((!command) || (!command.type) || (!command.newInput) || (!command.output)) {
            continue;
        };
        const name = command.newInput.replace(/ /g, "");
        // An operator is the only one of the four that is written with an argument
        const withArg = (command.type === "\\DeclareMathOperator");
        const written = (withArg) ? name + "{abc}" : name;
        const result = convert(written + " ", {mathMode: true, customCommands: customCommands});
        built.push({
            insert : (withArg) ? name + "{}" : name,
            preview : written + " → " + result.text.replace(/ $/, "")
        });
    };
    return built;
};

export function everyCommand(customCommands=[]) {
    // Every command that can be suggested, the user's own ones first
    // The page is given the whole list at once, so it can narrow it down on its own as
    // the user keeps typing, without asking again
    const own = builtCommands(customCommands);
    const taken = own.map((command) => command.insert.replace("{}", ""));
    const commands = [...own];
    for (const key of Object.keys(defaultDict)) {
        if (taken.includes(key)) {
            continue;  // The user redefined it, so theirs is the one to suggest
        };
        commands.push({insert: toReplaceCommand(key), preview: showCommand(key)});
    };
    return commands;
};

export function matching(commands, word) {
    // The commands to suggest for the word the cursor is on
    // 'note' is there when there is something to say rather than a list to show
    if (word === "") {
        return {note: null, matches: []};
    } else if (word[0] !== "\\") {
        return {note: noBackslash, matches: []};
    };
    // The backslash is dropped so that, for instance, '\arrow' also shows '\rightarrow'
    const looked = word.substring(1).toLowerCase();
    const matches = commands.filter((command) => command.insert.toLowerCase().indexOf(looked) !== -1);
    if (matches.length === 0) {
        return {note: "No command contains '" + word + "'", matches: []};
    };
    return {note: null, matches: matches};
};

export function completionList(word, customCommands=[]) {
    // What the completion box shows for the word the cursor is on
    return matching(everyCommand(customCommands), word);
};
