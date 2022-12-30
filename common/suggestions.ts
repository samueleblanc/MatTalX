/*
    Functions used in suggestion (common/popup.ts)
*/

import { dict, Fct, Str } from "types";
import { mathDictionary } from "unicode/mathsymbols";

const wordsDelimiters: string[] = [" ", "", "\u000A", "\\", "^", "_", "(", ")", "[", "]", "{", "}", ",", "/", "-", "+", "=", "<", ">", "|", "?", "!"];
const wordsDelimitersWOB: string[] = [" ", "", "\u000A", "^", "_", "(", ")", "[", "]", "{", "}", ",", "/", "-", "+", "=", "<", ">", "|", "?", "!"]; // Without backslash

function findWord(text: string, cursorPosition: number, addedLetter=""): string {
    // Finds the word that is touched by the cursor
    let t: string[];
    if (addedLetter.length === 1) {  // ie a letter
        t = text.split("");
        t[cursorPosition] += addedLetter;
        text = t.join("");
    } else if (addedLetter === "Backspace") {
        t = text.split("");
        t[cursorPosition] = "";
        text = t.join("");
        cursorPosition -= 1;
    };
    let word: string = "";
    while (!(wordsDelimiters.includes(text.charAt(cursorPosition + 1)))) {
        cursorPosition += 1;
    };
    while (!(wordsDelimitersWOB.includes(text.charAt(cursorPosition)))) {
        if (text.charAt(cursorPosition) === "\\") {
            word = text.charAt(cursorPosition) + word;
            break;
        } else {
            word = text.charAt(cursorPosition) + word;
            cursorPosition -= 1;
        }
    };
    return word;
};

function semiAutoCompletion(textIn: string, cursorPosition: number, command: string): string {
    // Replace the command being written by the selected suggestion
    let textOut: string = textIn;
    // Find end of word
    while (!(wordsDelimiters.includes(textIn.charAt(cursorPosition)))) {
        cursorPosition += 1;
    };
    // Deletes word
    while (textIn.charAt(cursorPosition - 1) !== "\\") {
        textOut = textOut.substring(0, cursorPosition - 1) + textOut.substring(cursorPosition);
        cursorPosition -= 1;
    };
    // Replace by selected suggestion
    textOut = textOut.substring(0, cursorPosition - 1) + command + textOut.substring(cursorPosition);
    return textOut;
};

function showCommand(key: string): string {
    // Used in suggestions
    // Changes what's seen when the user hovers on a command in the suggestion popup
    if (typeof mathDictionary[key] === "function") {
        if (key === "\\sqrt") {
            return "\\sqrt[n]{x} \u2192 ⁿ√𝑥";
        } else if (key === "\\sqrt*") {
            return "\\sqrt[n]* \u2192 ⁿ√";
        } else if (key === "\\frac") {
            return "\\frac{1}{2} \u2192 ¹∕₂";
        } else if (key === "\\frac*") {
            return "\\frac*{1}{2} \u2192 ½";
        } else if ((key === "\\above") || (key === "\\below") || (key === "\\hspace") || (key === "\\vskip")) {
            return key + "{}";
        } else if ((key === "_") || (key === "^")) {
            return "x" + key + "{a1} \u2192 𝑥" + (Fct(mathDictionary[key])(["a", "1"], mathDictionary[key])).join("");
        } else {
            return key + "{abc} \u2192 " + (Fct(mathDictionary[key])(["a", "b", "c"], mathDictionary[key])).join("");
        };
    } else {
        if (key === "\\:") {
            return "1 space";
        } else if ((key === "\\;") || ((key === "\\quad") || (key === "\\qquad"))) {
            return Str(mathDictionary[key]).length + " spaces";
        } else if ((key === "\\id2") || (key === "\\id3") || (key === "\\id4") || (key === "\\idn")) {
            const M: dict = {
                "\\id2": "⎡ 1 0 ⎤\u000A⎣ 0 1 ⎦",
                "\\id3" : "⎡ 1 0 0 ⎤\u000A⎢ 0 1 0 ⎥\u000A⎣ 0 0 1 ⎦",
                "\\id4" : "⎡ 1 0 0 0 ⎤\u000A⎢ 0 1 0 0 ⎥\u000A⎢ 0 0 1 0 ⎥\u000A⎣ 0 0 0 1 ⎦",
                "\\idn" : "⎡ 1 0 ⋯ 0 ⎤\u000A⎢ 0 1 ⋯ 0 ⎥\u000A⎢  ⋮  ⋮  ⋱  ⋮ ⎥\u000A⎣ 0 0 ⋯ 1 ⎦"
            }
            return M[key];
        } else {
            return Str(mathDictionary[key])
        };
    };
};

function toReplaceCommand(key: string): string {
    // Used in suggestions
    // Changes what the user sees when the suggestion popup is opened
    if (typeof mathDictionary[key] === "function") {
        if (key === "\\sqrt") {
            return "\\sqrt[]{}";
        } else if (key === "\\sqrt*") {
            return "\\sqrt[]*";
        } else if (key === "\\frac") {
            return "\\frac{}{}";
        } else if (key === "\\frac*") {
            return "\\frac*{}{}";
        } else {
            return key + "{}";
        };
    } else {
        return key
    };
};


export { findWord, semiAutoCompletion, showCommand, toReplaceCommand };