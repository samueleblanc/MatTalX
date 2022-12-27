import { Superscript, Subscript } from "./unicode/sub_super"
import { dict, Str } from "./types";

function replaceLetters(letters: string[], dict: dict, initialCommand: string, checkMistakes=true): string[] {
    // Used by a lot of functions to convert every letter in a string of characters
    let newtext: string[] = [];
    let symbol: string | string[];
    let i: number;
    for (i=0; i<letters.length; i++) {
        // TODO: Push symbol if it's a combining symbol
        newtext.push(Str(addSymbol(dict[letters[i]])));
        if (checkMistakes) {
            mistakes(initialCommand + "{" + letters.join("") + "}", dict[letters[i]], letters[i]);
        };
    };
    return newtext;
};

function spaceCommand(text: string): string {
    // Add spaces ("\:" command)
    // Internally, spaces that are kept even if 'Adjust spaces' is on are represented as \u2710
    // this commands changes them back to spaces
    text = text.replace(/\u2710/g, " ");
    return text;
};

function addSymbol(command: string[] | string | undefined, keepArray=false): string | string[] {
    // Return the command if it's defined, if not it returns a bold "err" with two "x" under it
    if ((typeof command === "object") && !(keepArray)) {
        // Changes an array of characters into a string
        command = command.join("");
    };
    return (command !== undefined) ? command : "\u{1D41E}\u0353\u{1D42B}\u0353\u{1D42B}";
};

function addSymbolArray(args: string[], command: string, checkMistakes=true): string {
    // Differs from the function above as it returns an array instead of a string
    let output: string = "";
    let i: number;
    for (i=0; i<args.length; i++) {
        output += (args[i] !== undefined) ? args[i] : "\u{1D41E}\u0353\u{1D42B}\u0353\u{1D42B}";
        if (checkMistakes) {
            mistakes(command, args[i], "A symbol does not exist or can't be shown");
        };
    };
    return output;
};

// TODO: Make this function useless with more proper type checking
function prohibitedType(command: string, type="function"): string {
    // Make sure the command is of the right type. Most of the time "function" is the one to watch
    return (typeof command !== type) ? command : "\u{1D41E}\u0353\u{1D42B}\u0353\u{1D42B}";
};


let errorsList: string = "";

function mistakes(textInput: string, textOutput: string | undefined, letter=""): string {
    // Writes every errors in a box, so it's easier for the user to find them

    // TODO: x^{\error} outputs: x^{} -> try: 'x^{{}}' which is obviously a bad error message

    const popup: HTMLElement = <HTMLElement>document.getElementById("mistakes");
    const text: string = "\u{1D404}\u{1D42B}\u{1D42B}\u{1D428}\u{1D42B}\u{1D42C}: \r\n";  // "Errors" in bold
    if (textOutput === undefined) {
        if (letter != "") {
            if (letter !== "\u{1D41E}\u0353\u{1D42B}\u0353\u{1D42B}") {  // Only add to errorsList once
                if (letter.includes("\u2710")) {  // i.e. Spaces
                    if (textInput.substring(0,5) == "\\text") {
                        errorsList += spaceCommand(textInput + " \u2192 Spaces are kept inside '" + textInput.replace(/{.*}/g, "") + "{}', no need for a spacing command") + "\r\n";
                    } else if ((textInput[0] === "^") || (textInput[0] === "_") || (textInput.substring(0,5) == "\\frac")) {
                        const initialSpaceCommand: string[] = ["\\:", "\\;", "\\quad", "\\qquad"];
                        errorsList += spaceCommand(textInput + " \u2192 Replace '" + initialSpaceCommand[letter.length-1] + "' by '\\hspace{" + letter.length + "}'") + "\r\n";
                    } else {
                        errorsList += spaceCommand(textInput + " \u2192 " + '"' + letter + '" \r\n');
                    };
                } else {
                    const subSupChar = Object.values(Superscript).concat(Object.values(Subscript)).filter(x => {return x !== "\u2710";});  // Makes sure that there are no spaces that sneaks in
                    if (subSupChar.includes(letter)) {
                        const argPos: string = Object.values(Superscript).includes(letter) ? "superscript" : "subscript";
                        const commandPos: string = (textInput[0] === "^") ? "superscript" : "subscript";
                        errorsList += spaceCommand(textInput + " \u2192 Can't put a " + argPos + " (" + letter + ") in a " + commandPos + " position") + "\r\n";
                    } else {
                        errorsList += spaceCommand(textInput + " \u2192 " + '"' + letter + '" \r\n');
                    };
                };
            };
        } else {
            if ((textInput[0] === "^") || (textInput[0] === "_")) {
                if (textInput.indexOf(" needs an argument.") !== -1) {
                    const example: string = (textInput[0] === "^") ? "¹" : "₁";
                    errorsList += "For '" + textInput[0] + "' alone: \\" + textInput[0] + " \u2192 " + textInput[0] + 
                    "  |  To use '" + textInput[0] + "' as a command: " + textInput[0] + "{1} \u2192 " + example + "\r\n";
                } else {
                    errorsList += '"' + textInput + '" \u2192 ' + "try: " + textInput[0] + "{" + textInput.slice(1) + "}" + '\r\n';
                };
            } else {
                errorsList += '"' + textInput + '" \r\n';
            };
        };
    };
    if (errorsList.length > 0) {
        popup.textContent = text + errorsList;
    };
    return "\u{1D41E}\u0353\u{1D42B}\u0353\u{1D42B}"; // bold "err" with two "x" under it
};

export { replaceLetters, spaceCommand, addSymbol, addSymbolArray, prohibitedType, mistakes };