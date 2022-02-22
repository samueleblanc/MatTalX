// Dictionary for text conversion
const mathDictionary = {
    // Math operators
    "\\+" : "\u002B",
    "\\-" : "\u2212",
    "\\times" : "\u00D7",
    "\\int" : "\u222B",
    "\\iint" : "\u222C",
    "\\iiint" : "\u222D",
    "\\iiiint" : "\u2A0C",
    "\\oint" : "\u222E",
    "\\oiint" : "\u222F",
    "\\oiiint" : "\u2230",
    "\\ast" : "\u2217",
    "\\star" : "\u22C6",
    "\\partial" : "\u2202",
    "\\nabla" : "\u2207",
    "\\sqrt" : "\u221A",
    "\\circ" : "\u2218",
    "\\sum" : "\u2211",
    "\\prod" : "\u220F",
    "\\cdot" : "\u22C5",
    
    "\\pm" : "\u00B1",
    "\\emptyset" : "\u2205",
    "\\sin" : "sin",
    "\\cos" : "cos",
    "\\tan" : "tan",
    "\\arcsin" : "arcsin",
    "\\arccos" : "arccos",
    "\\arctan" : "arctan",
    "\\cot" : "cot",
    "\\cosec" : "cosec",
    "\\sec" : "sec",
    "\\*" : "*",

    // Relations
    "\\forall" : "\u2200",
    "\\exists" : "\u2203",
    "\\nexists" : "\u2204",
    "\\land" : "\u2227",
    "\\lor" : "\u2228",
    "\\in" : "\u2208",
    "\\notin" : "\u2209",
    "\\ni" : "\u220B",
    "\\subset" : "\u2282",
    "\\subseteq" : "\u2286",
    "\\supset" : "\u2283",
    "\\supseteq" : "\u2287",
    "\\cup" : "\u222A",
    "\\cap" : "\u2229",
    "\\setminus" : "\u2216",
    "\\cong" : "\u2245",
    "\\propto" : "\u221D",
    "\\sim" : "\u223C",
    "\\equiv" : "\u2261",
    "\\neq" : "\u2260",
    "\\simeq" : "\u224C",
    "\\nless" : "\u226E",
    "\\ngtr" : "\u226F",
    "\\leq" : "\u2264",
    "\\leqslant" : "\u2A7D",
    "\\geq" : "\u2265",
    "\\geqslant" : "\u2A7E",
    "\\nleq" : "\u2270",
    "\\ngeq" : "\u2271",
    "\\ll" : "\u226A",
    "\\gg" : "\u226B",
    "\\prec" : "\u227A",
    "\\succ" : "\u227B",
    "\\nprec" : "\u2280",
    "\\nsucc" : "\u2281",
    "\\preceq" : "\u227C",
    "\\succeq" : "\u227D",
    "\\Rightarrow" : "\u21D2",
    "\\Leftarrow" : "\u21D0",
    "\\rightarrow" : "\u2192",
    "\\leftarrow" : "\u2190",
    "\\mapsto" : "\u27FC",
    "\\rightleftharpoons" : "\u21CC",
    "\\perp" : "\u27C2",
    "\\parallel" : "\u2225",
    "\\neg" : "\u00AC",

    // Greek alphabet
    "\\alpha" : "\u{1D6FC}",
    "\\beta" : "\u{1D6FD}",
    "\\Gamma" : "\u{1D6E4}",
    "\\gamma" : "\u{1D6FE}",
    "\\Delta" : "\u0394",
    "\\delta" : "\u03B4",
    "\\epsilon" : "\u03F5",
    "\\varepsilon" : "\u03B5",
    "\\zeta" : "\u03B6",
    "\\eta" : "\u{1D702}",
    "\\Theta" : "\u0398",
    "\\theta" : "\u{1D703}",
    "\\vartheta" : "\u03D1",
    "\\iota" : "\u{1D704}",
    "\\kappa" : "\u{1D705}",
    "\\varkappa" : "\u{1D718}",
    "\\Lambda" : "\u039B",
    "\\lambda" : "\u03BB",
    "\\mu" : "\u{1D707}",
    "\\nu" : "\u{1D708}",
    "\\Xi" : "\u039E",
    "\\xi" : "\u{1D709}",
    "\\Pi" : "\u03A0",
    "\\pi" : "\u{1D70B}",
    "\\varpi" : "\u{1D71B}",
    "\\rho" : "\u{1D70C}",
    "\\varrho" : "\u03F1",
    "\\Sigma" : "\u03A3",
    "\\sigma" : "\u03C3",
    "\\varsigma" : "\u03C2",
    "\\tau" : "\u{1D70F}",
    "\\Upsilon" : "\u{1D6F6}",
    "\\upsilon" : "\u{1D710}",
    "\\Phi" : "\u{1D6BD}",
    "\\phi" : "\u{1D719}",
    "\\varphi" : "\u{1D711}",
    "\\chi" : "\u{1D712}",
    "\\Psi" : "\u{1D6F9}",
    "\\psi" : "\u{1D713}",
    "\\Omega" : "\u2126",
    "\\omega" : "\u{1D714}",

    // Mathbb
    "\\mathbbC" : "\u2102",
    "\\mathbbR" : "\u211D",
    "\\mathbbH" : "\u210D",
    "\\mathbbQ" : "\u211A",
    "\\mathbbZ" : "\u2124",
    "\\mathbbN" : "\u2115",

    // Chess
    "\\wking" : "\u2654",
    "\\wqueen" : "\u2655",
    "\\wrook" : "\u2656",
    "\\wbishop" : "\u2657",
    "\\wknight" :"\u2658",
    "\\wpawn" : "\u2659",
    "\\bking" : "\u265A",
    "\\bqueen" : "\u265B",
    "\\brook" : "\u265C",
    "\\bbishop" : "\u265D",
    "\\bknight" :"\u265E",
    "\\bpawn" : "\u265F",

    // Card games
    "\\bspade" : "\u2660",
    "\\wheart" : "\u2661",
    "\\wdiamond" : "\u2662",
    "\\bclub" : "\u2663",
    "\\wspade" : "\u2664",
    "\\bheart" : "\u2665",
    "\\bdiamond" : "\u2666",
    "\\wclub" : "\u2667",

    // Money
    "\\dollar" : "\u0024",
    "\\cent" : "\u00A2",
    "\\pound" : "\u00A3",
    "\\yen" : "\u00A5",
    "\\franc" : "\u20A3",
    "\\euro" : "\u20AC",
    "\\peso" : "\u20B1",
    "\\bitcoin" : "\u20BF",
    "\\austral" : "\u20B3",

    // Other symbols
    "\\infty" : "\u221E",
    "\\angle" : "\u2220",
    "\\hbar" : "\u210F",
    "\\dagger" : "\u2020",
    "\\ddagger" : "\u2021",
    "\\qc" : "\u269C",
    "\\section" : "\u00A7",
    "\\paragraph" : "\u00B6",
    "\\copyright" : "\u00A9",
    "\\registered" : "\u00AE",
    "\\:" : "\\:",
};

const superscript = {
    "^" : "",
    "0" : "\u2070",
    "1" : "\u00B9",
    "2" : "\u00B2",
    "3" : "\u00B3",
    "4" : "\u2074",
    "5" : "\u2075",
    "6" : "\u2076",
    "7" : "\u2077",
    "8" : "\u2078",
    "9" : "\u2079"
};

const subscript = {
    "_" : "",
    "0" : "\u2080",
    "1" : "\u2081",
    "2" : "\u2082",
    "3" : "\u2083",
    "4" : "\u2084",
    "5" : "\u2085",
    "6" : "\u2086",
    "7" : "\u2087",
    "8" : "\u2088",
    "9" : "\u2089"
};

const bold = {
    
};

const italic = {
    "\=" : "\=",
    "'" : "\u2032",
    "''" : "\u2033", // Prime can't works since it's more than one letter
    "'''" : "\u2034",
    "/" : "\u2015",
    "|" : "\u007C",
    "!" : "!",
    "?" : "?",
    "&" : "&",
    "(" : ")",
    "(" : ")",
    "{" : "{",
    "[" : "[",
    "]" : "]",
    "<" : "<",
    ">" : ">",
    "a" : "\u{1D44E}",
    "b" : "\u{1D44F}",
    "c" : "\u{1D450}",
    "d" : "\u{1D451}",
    "e" : "\u{1D452}",
    "f" : "\u{1D453}"
};

// Submit button
const submit = document.getElementById("button");
submit.onclick = function() {convert()};

// Copy button
const copyButton = document.getElementById("copy");
copyButton.onclick = function () {copy()};

// Clear button
const resetButton = document.getElementById("reset");
resetButton.onclick = function () {clear()};

// Fixes spacing error
function spacing(word) {
    let toEmpty = word.indexOf("");
    if (toEmpty != -1) {
        word.splice(toEmpty, 1);
    };
    return word;
};

//! Should add function to fix tab and line break error

// Deletes "$" in text
function deletesDollar(text) {
    text = text.replace(/\$/g, "");
    return text.replace(/  /g, " ");
};

// Add spaces
function addSpace(text) {
    text = text.replace(/\\:/g, " ");
    return text;
};

// Add spaces around equal
function equalSignSpace(text) {
    text = text.replace(/\=/g, " \= ");
    return text;
};

// Takes the whole text and returns words in math mode
function analyse(fulltext) {
    let rawWord = fulltext.split(" ");
    let word = spacing(rawWord);
    let words = [];
    let indexes = [];
    let i, n;

    for (i in word) {
        if (word[i] == "$") {
            indexes.push(i);
            word.splice(i, 1);
        };
    };
    for (n = 0; n < indexes.length; n+=2) {
        words = word.slice(indexes[n], indexes[n+1]);
    };
    return words;
};

// **NOT USED** Alerts if mistake
function mistakes(command, word, text) {
    if (command === undefined) {
        // alert(word + "is not a command")
        let alertWord = "*" + word + "*";
        return text.replace(word, alertWord);
    };
    return text;
};

// Copy to clipboard
function copy() {
    const copyText = document.getElementById("text_out");
    navigator.clipboard.writeText(copyText.value);

    document.getElementById("popup").innerHTML = "Text copied!";
}

// Clears "Text copied!"
function clear() {
    document.getElementById("popup").innerHTML = "";
};

// Superscript, subscript, italic, bold
function letterChange(letters, new_text, dictionary) {
    for (i in letters) {
        let k = new RegExp(letters[i]);
        new_text = new_text.replace(k, dictionary[letters[i]]);
    };
    return new_text;
};

//! If command is identical outside of math mode
// it will still treat it as math command

// Convert the text received
function convert() {
    const fullText = document.text_input.text_in.value;
    const words = analyse(fullText);
    let new_text = deletesDollar(fullText);
    let word;
    for (word in words) {
        let firstLetter = words[word].charAt(0);
        if (firstLetter == "\\") {
            let w = new RegExp("\\" + words[word], "g");
            new_text = new_text.replace(w, mathDictionary[words[word]]);
        } else if (firstLetter == "^") {
            new_text = new_text.replace("^", "");
            new_text = letterChange(words[word], new_text, superscript);
        } else if (firstLetter == "_") {
            new_text = new_text.replace("_", "");
            new_text = letterChange(words[word], new_text, subscript);
        } else {
            new_text = letterChange(words[word], new_text, italic);
        }
    };
    
    new_text = addSpace(new_text);
    new_text = equalSignSpace(new_text);
    document.text_input.text_out.value = new_text;
    document.getElementById("text_out").disabled = false; 
};