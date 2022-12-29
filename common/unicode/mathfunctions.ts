import { Subscript, Superscript } from "common/unicode/sub_super";
import { replaceLetters, mistakes, addSymbol, addSymbolArray } from "common/convert";
import { mathDictionary } from "common/unicode/mathsymbols";
import { dict, Fct } from "common/types";


const superscript = (arg: string[], initialCommand: string, forFrac=false): any => {
    // Sends input to be converted by replaceLetters
    // This function is by default not called by the frac function
    let output = replaceLetters(arg, Superscript, initialCommand, !forFrac);
    if ((output.indexOf("\u{1D41E}\u0353\u{1D42B}\u0353\u{1D42B}") === -1) || (forFrac)) {
        return output;
    } else {
        return "^(" + arg.join("") + ")";
    };
};

const subscript = (arg: string[], initialCommand: string, forFrac=false): any => {
    // Sends input to be converted by replaceLetters
    // This function is by default not called by the frac function
    let output = replaceLetters(arg, Subscript, initialCommand, !forFrac);
    if ((output.indexOf("\u{1D41E}\u0353\u{1D42B}\u0353\u{1D42B}") === -1) || (forFrac)) {
        return output;
    } else {
        return "_(" + arg.join("") + ")";
    };
};

const hspace = (arg: string[], initialCommand: string): string => {
    // hspace stands for horizontal space
    // Adds the number of space specified in 'arg'
    let spaces: string = "";
    const num: string = arg.join("");
    try {
        let n: number = parseInt(num);
        for (let i=0; i<n; i++) {
            spaces += "\u2710";
        };
    } catch {
        spaces = mistakes(initialCommand + "{" + num + "}", undefined, "argument must be a number");
    }
    return spaces;
};

const vskip = (arg: string[], initialCommand: string): string => {
    // vskip stands for vertical skip
    // Adds the number of linebreaks specified in 'arg'
    let skips = "";
    const num = arg.join("");
    try {
        let n: number = parseInt(num);
        for (let i=0; i<n; i++) {
            skips += "\u000A";
        };
    } catch {
        skips = mistakes(initialCommand + "{" + num + "}", undefined, "argument must be a number");
    }
    return skips;
};

const sqrt = (arg: string[], initialCommand: string): any => {
    // sqrt stands for square root
    const numStart: number = initialCommand.indexOf("[");
    const numEnd: number = initialCommand.indexOf("]");
    let rootNum;
    if ((numStart === -1) || (numEnd === -1)) {
        if ((numStart === -1) && (numEnd === -1)) {
            rootNum = undefined;
        } else {
            mistakes(initialCommand + " should take the form \\sqrt[n]{x}", undefined, "ⁿ√𝑥");
            return addSymbol(undefined);
        };
    } else {
        rootNum = initialCommand.substring(numStart + 1, numEnd);
    };
    let output: string = "";
    switch (rootNum) {
        // There's already a unicode symbol for square root, cube root and 4th root
        // If rootNum is different than those, the symbol is built
        case "3":
            output += "\u221B";
            break;
        case "4":
            output += "\u221C";
            break;
        case undefined:
            output += "\u221A";
            break;
        default:
            output += addSymbol(Fct(mathDictionary["^"])(rootNum.toString().split(""), initialCommand)) + "\u221A";
    };
    if (arg.length >= 2) {
        output += "(" + addSymbolArray(arg, initialCommand + "{" + arg.join("") + "}") + ")";
    } else {
        output += addSymbolArray(arg, initialCommand + "{" + arg.join("") + "}");
    };
    return output;
};


const sqrtNoArg = (arg: string[], initialCommand: string): any => {
    // Compared with sqrt, this function only takes the root as parameter, not the argument
    // For instance the 'cube root of two' would be in sqrt, but simply the 'cube root' would be parsed here 
    if (arg !== undefined) {
        mistakes(initialCommand + " does not take in arguments and should take the form \\sqrt[n]*", undefined, "ⁿ√  (use \\sqrt[n]{x} to get ⁿ√𝑥)");
        return addSymbol(undefined);
    };
    const numStart: number = initialCommand.indexOf("[");
    const numEnd: number = initialCommand.indexOf("]");
    let rootNum;
    if ((numStart === -1) || (numEnd === -1)) {
        if ((numStart === -1) && (numEnd === -1)) {
            rootNum = undefined;
        } else {
            mistakes(initialCommand + " should take the form \\sqrt[n]*", undefined, "ⁿ√");
            return addSymbol(undefined);
        };
    } else {
        rootNum = initialCommand.substring(numStart + 1, numEnd);
    };
    let output = "";
    switch (rootNum) {
        case "3":
            output += "\u221B";
            break;
        case "4":
            output += "\u221C";
            break;
        case undefined:
            output += "\u221A";
            break;
        default:
            output += addSymbol(Fct(mathDictionary["^"])(rootNum.toString().split(""), initialCommand)) + "\u221A";
        };
    return output;
};

const frac = (arg: string[], initialCommand: string) => {
    // Used to make a fraction
    // If a character doesn't exist in superscript or subscript, it outputs the fraction in the format f(x)/g(x)
    let output: string = "";
    let nume: string[] = [];
    let deno: string[] = [];
    let numerator: boolean = true;
    let i: number;
    for (i=0; i<arg.length; i++) {
        if (numerator) {
            if (arg[i] === "}") {
                numerator = false;
            } else {
                nume.push(arg[i]);
            };
        } else {
            if (arg[i] === "{") {
                if (arg[i - 1] === "}") {
                    output += addSymbol(Fct(mathDictionary["^"])(nume, initialCommand, true)) + "\u2215";
                } else {
                    deno.push(arg[i]);
                };
            } else {
                deno.push(arg[i]);
            };
        };
    };
    output += addSymbol(Fct(mathDictionary["_"])(deno, initialCommand, true));
    if (output.indexOf("\u{1D41E}\u0353\u{1D42B}\u0353\u{1D42B}") === -1) {
        return output;
    } else {
        if (arg.join("").includes("\u2710")) {
            const spaces = arg.filter(c => {return c.includes("\u2710")});
            for (let i in spaces) {
                mistakes(initialCommand + "{" + arg.join("") + "}", undefined, spaces[i]);
            };
        };
        output = "";
        numerator = true;
        nume = [];
        deno = [];
        for (i=0; i<arg.length; i++) {
            if (numerator) {
                if (arg[i] === "}") {
                    numerator = false;
                } else {
                    nume.push(arg[i]);
                };
            } else {
                if (arg[i] === "{") {
                    if (arg[i - 1] === "}") {
                        output += "(" + addSymbolArray(nume, "\\frac{" + arg.join("") + "}") + "/";
                    } else {
                        deno.push(arg[i]);
                    };
                } else {
                    deno.push(arg[i]);
                };
            };
        };
        output += addSymbolArray(deno, "\\frac{" + arg.join("") + "}") + ")";
        return output;
    };
};

const singleCharFrac = (arg: string[], initialCommand: string): string => {
    // Some fractions already exists as unicode symbols they can be accessed via this function
    let noSpaceArg: string = arg.join("").replace(/ /g, "");
    const fractions: dict = {
        "1}{2" : "\u00BD",
        "1}{7" : "⅐",
        "1}{9" : "⅑",
        "1}{10" : "⅒",
        "1}{3"  :"⅓",
        "2}{3" : "⅔",
        "1}{5" : "⅕",
        "2}{5" : "⅖",
        "3}{5" : "⅗",
        "4}{5" : "⅘",
        "1}{6" : "⅙",
        "5}{6" : "⅚",
        "1}{8" : "⅛",
        "3}{8" : "⅜",
        "5}{8" : "⅝",
        "7}{8" : "⅞",
        "a}{c" : "\u2100",
        "a}{s" : "\u2101",
        "c}{o" : "\u2105",
        "c}{u" : "\u2106"
    };
    let output = fractions[noSpaceArg];
    return (output !== undefined) ? output : frac(arg, initialCommand);
};

const combineSymbols = (arg: string | string[], initialCommand: string, symbol: string, forTwo: undefined | string): string[] => {
    // Appends a 'combining symbol' to a regular symbol to create a new one (e.g. 'e' + '´' -> é)
    // N.B. "\u{1D41E}\u0353\u{1D42B}\u0353\u{1D42B}"  ->  error symbol
    let textComb: string[] = [];
    if ((arg.length === 2) && (forTwo !== undefined)) {
        textComb.push(arg[0] + forTwo + arg[1]);
        mistakes(initialCommand + "{\u{1D41E}\u0353\u{1D42B}\u0353\u{1D42B}" + arg[1] + "}", arg[0], "Argument doesn't exist");
        mistakes(initialCommand + "{" + arg[0] + "\u{1D41E}\u0353\u{1D42B}\u0353\u{1D42B}}", arg[1], "Argument doesn't exist");
    } else {
        let err: string[] = [];
        let i: number;
        for (i=0; i<arg.length; i++) {
            if (arg[i] !== undefined) {
                textComb.push(arg[i] + symbol);
                err.push(arg[i]);
            } else {
                textComb.push("\u{1D41E}\u0353\u{1D42B}\u0353\u{1D42B}");
                err.push("\u{1D41E}\u0353\u{1D42B}\u0353\u{1D42B}");
            };
        };
        if (err.includes("\u{1D41E}\u0353\u{1D42B}\u0353\u{1D42B}")) {
            mistakes(initialCommand + "{" + err.join("") + "}", undefined, "Argument doesn't exist")
        };
    };
    return textComb;
};

// These functions call combineSymbols with a predetermined symbol

const overline = (arg: string[], initialCommand: string): string[] => {return combineSymbols(arg, initialCommand, "\u0305", undefined)};

const underline = (arg: string[], initialCommand: string): string[] => {return combineSymbols(arg, initialCommand, "\u0332", undefined)};

const vec = (arg: string[], initialCommand: string): string[] => {return combineSymbols(arg, initialCommand, "\u20D7", undefined)};

const hvec = (arg: string[], initialCommand: string): string[] => {return combineSymbols(arg, initialCommand, "\u20D1", undefined)};

const overfrown = (arg: string[], initialCommand: string): string[] => {return combineSymbols(arg, initialCommand, "\u0361", "\u0361")};

const oversmile = (arg: string[], initialCommand: string): string[] => {return combineSymbols(arg, initialCommand, "\u035D", "\u035D")};

const undersmile = (arg: string[], initialCommand: string): string[] => {return combineSymbols(arg, initialCommand, "\u035C", "\u035C")};

const hat = (arg: string[], initialCommand: string): string[] => {return combineSymbols(arg, initialCommand, "\u0302", undefined)};

const not = (arg: string[], initialCommand: string): string[] => {return combineSymbols(arg, initialCommand, "\u0338", undefined)};

const tilde = (arg: string | string[], initialCommand: string): string[] => {if ((arg == "\u27F6") || (arg == "\u2192")) {return ["\u2972"]} else {return combineSymbols(arg, initialCommand, "\u0303", "\u0360")}};

const dot = (arg: string | string[], initialCommand: string): string[] => {if ((arg == "=") || (arg == "\u003D")) {return ["\u2250"]} else if (arg == "\u2261") {return ["\u2A67"]} else {return combineSymbols(arg, initialCommand, "\u0307", undefined)}};

const ddot = (arg: string[], initialCommand: string): string[] => {return combineSymbols(arg, initialCommand, "\u0308", undefined)};

const underarrow = (arg: string[], initialCommand: string): string[] => {return combineSymbols(arg, initialCommand, "\u0362", "\u0362")};

const underharpoon = (arg: string[], initialCommand: string): string[] => {return combineSymbols(arg, initialCommand, "\u20EC", undefined)};

const acute = (arg: string[], initialCommand: string): string[] => {return combineSymbols(arg, initialCommand, "\u0301", undefined)};

const grave = (arg: string[], initialCommand: string): string[] => {return combineSymbols(arg, initialCommand, "\u0300", undefined)};

// Dict with characters and their corresponding symbol that can be combined and put above another symbol
const Above: dict = {
    "." : "\u0307",
    ":" : "\u0308",
    "\u2236" : "\u0308",
    "-" : "\u0305",
    "−" : "\u0305",
    "`" : "\u0300",
    "´" : "\u0301",
    "^" : "\u0302",
    "=" : "\u033F",
    "∼" : "\u0303",
    "∞" : "\u1AB2", // Only works on certain website/apps
    "∘" : "\u030A",
    "°" : "\u030A",
    "a" : "\u0363",
    "𝑎" : "\u0363",
    "b" : "\u1DE8",
    "𝑏" : "\u1DE8",
    "c" : "\u0368",
    "𝑐" : "\u0368",
    "d" : "\u0369",
    "𝑑" : "\u0369",
    "e" : "\u0364",
    "𝑒" : "\u0364",
    "f" : "\u1DEB",
    "𝑓" : "\u1DEB",
    "h" : "\u036A",
    "ℎ" : "\u036A",
    "i" : "\u0365",
    "𝑖" : "\u0365",
    "k" : "\u1DDC",  // Only works on certain website/apps
    "𝑘" : "\u1DDC",
    "m" : "\u036B",
    "𝑚" : "\u036B",
    "N" : "\u1DE1",
    "𝑁" : "\u1DE1",
    "n" : "\u1DE0",  // Only works on certain website/apps
    "𝑛" : "\u1DE0",
    "o" : "\u0366",
    "𝑜" : "\u0366",
    "p" : "\u1DEE",
    "𝑝" : "\u1DEE",
    "R" : "\u1DE2",
    "𝑅" : "\u1DE2",
    "r" : "\u036C",
    "𝑟" : "\u036C",
    "t" : "\u036D",
    "𝑡" : "\u036D",
    "u" : "\u0367",
    "𝑢" : "\u0367",
    "v" : "\u036E",
    "𝑣" : "\u036E",
    "x" : "\u036F",
    "𝑥" : "\u036F",

    "𝛼" : "\u1DE7",
    "𝛽" : "\u1DE9",

    "↼" : "\u20D0",
    "⇀" : "\u20D1",
    "↔" : "\u20E1",
    "↶" : "\u20D4",
    "↷" : "\u20D5",
    "←" : "\u20D6",
    "→" : "\u20D7",
    "↓" : "\u1AB3",
    "∴" : "\u1AB4",
    "⋯" : "\u20DB",
    "…" : "\u20DB",
    " " : " "
};

const above = (arg: string[], initialCommand: string): string => {
    // Returns the symbol to be put above the preceding character in the input text
    if (arg.length > 1) {
        return mistakes(initialCommand + "{" + arg.join("") + "}", undefined, "Only one argument accepted");
    };
    mistakes(initialCommand + "{" + arg.join("") + "}", Above[arg[0]], (arg[0] !== undefined) ? arg[0] : "Argument doesn't exist");
    return Above[arg[0]];
};

// Dict with characters and their corresponding symbol that can be combined and put below another symbol
const Below: dict = {
    "." : "\u0323",
    ":" : "\u0324",
    "\u2236" : "\u0324",
    "-" : "\u0332",
    "−" : "\u0332",
    "=" : "\u0333",
    "m" : "\u1AC0",
    "𝑚" : "\u1AC0",
    "x" : "\u0353",
    "𝑥" : "\u0353",
    "w" : "\u1ABF",
    "𝑤" : "\u1ABF",
    "↽" : "\u20ED",
    "⇁" : "\u20EC",
    "←" : "\u20EE",
    "→" : "\u20EF",
    "↔" : "\u034D",
    " " : " "
};

const below = (arg: string[], initialCommand: string): string => {
    // Returns the symbol to be put below the preceding character in the input text
    if (arg.length > 1) {
        return mistakes(initialCommand + "{" + arg.join("") + "}", undefined, "Only one argument accepted");
    };
    mistakes(initialCommand + "{" + arg.join("") + "}", Below[arg[0]], (arg[0] !== undefined) ? arg[0] : "Argument doesn't exist");
    return Below[arg[0]];
};


export { superscript, subscript, Superscript, Subscript, hspace, vskip, sqrt, sqrtNoArg, 
    frac, singleCharFrac, overline, underline, vec, hvec, dot, ddot, 
    overfrown, oversmile, undersmile, underarrow, underharpoon,
    hat, not, tilde, acute, grave, above, below, Above, Below
};