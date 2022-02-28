// Dictionary for text conversion
const mathDictionary = {
    // Math operators
    "\\times" : "\u00D7",
    "\\div" : "\u00F7",
    "\\int" : "\u222B",
    "\\iint" : "\u222C",
    "\\iiint" : "\u222D",
    "\\iiiint" : "\u2A0C",
    "\\oint" : "\u222E",
    "\\oiint" : "\u222F",
    "\\oiiint" : "\u2230",
    "\\intclockwise" : "\u2231",
    "\\ointclockwise" : "\u2232",
    "\\ointctrclockwise" : "\u2233",
    "\\sqint" : "\u2A16",
    "\\fint" : "\u2A0F",
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
    "\\mp" : "\u2213",
    "\\emptyset" : "\u2205",
    "\\sin" : "sin",
    "\\cos" : "cos",
    "\\tan" : "tan",
    "\\arcsin" : "arcsin",
    "\\arccos" : "arccos",
    "\\arctan" : "arctan",
    "\\cot" : "cot",
    "\\csc" : "csc",
    "\\sec" : "sec",
    "\\arccot" : "arccot",
    "\\arccsc" : "arccsc",
    "\\arcsec" : "arcsec",
    "\\*" : "*",
    "\\det" : "det",
    "\\log" : "log",
    "\\ln" : "ln",
    "\\lim" : "lim",
    "\\cup" : "\u222A",
    "\\sqcup" : "\u2294",
    "\\cap" : "\u2229",
    "\\sqcap" : "\u2293",
    "\\uplus" : "\u228E",
    "\\def" : "\u225D",
    "\\vee" : "\u22C1",
    "\\wedge" : "\u22C0",
    "\\diamond" : "\u22C4",
    "\\wr" : "\u2240",
    "\\oplus" : "\u2295",
    "\\ominus" : "\u2296",
    "\\otimes" : "\u2297",
    "\\oslash" : "\u2298",
    "\\odot" : "\u2299",
    "\\amalg" : "\u2210",

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
    "\\nsubset" : "\u2284",
    "\\subseteq" : "\u2286",
    "\\nsubseteq" : "\u2288",
    "\\supset" : "\u2283",
    "\\nsupset" : "\u2285",
    "\\supseteq" : "\u2287",
    "\\nsupseteq" : "\u2289",
    "\\sqsubset" : "\u228F",
    "\\sqspset" : "\u2290",
    "\\sqsubseteq" : "\u2291",
    "\\sqsupseteq" : "\u2292",
    "\\setminus" : "\u2216",
    "\\cong" : "\u2245",
    "\\ncong" : "\u2247",
    "\\propto" : "\u221D",
    "\\sim" : "\u223C",
    "\\equiv" : "\u2261",
    "\\doteq" : "\u2250",
    "\\neq" : "\u2260",
    "\\approx" : "\u2248",
    "\\sim" : "\u223C",
    "\\simeq" : "\u224C",
    "\\nsim" : "\u2241",
    "\\nless" : "\u226E",
    "\\ngtr" : "\u226F",
    "\\leq" : "\u2264",
    "\\leqslant" : "\u2A7D",
    "\\geq" : "\u2265",
    "\\geqslant" : "\u2A7E",
    "\\nleq" : "\u2270",
    "\\ngeq" : "\u2271",
    "\\lneq" : "\u2A87",
    "\\lneqq" : "\u2268",
    "\\lgneq" : "\u2A88",
    "\\gneqq" : "\u2269",
    "\\lnapprox" : "\u2A89",
    "\\gnapprox" : "\u2A8A",
    "\\lnsim" : "\u22E6",
    "\\gnsim" : "\u22E7",
    "\\ll" : "\u226A",
    "\\lll" : "\u22D8",
    "\\gg" : "\u226B",
    "\\ggg" : "\u22D9",
    "\\prec" : "\u227A",
    "\\succ" : "\u227B",
    "\\nprec" : "\u2280",
    "\\nsucc" : "\u2281",
    "\\preceq" : "\u227C",
    "\\succeq" : "\u227D",
    "\\precneqq" : "\u2AB5",
    "\\succneqq" : "\u2AB6",
    "\\precnapprox" : "\u2AB9",
    "\\succnapprox" : "\u2ABA",
    "\\precnsim" : "\u22E8",
    "\\succnsim" : "\u22E9",
    "\\perp" : "\u27C2",
    "\\parallel" : "\u2225",
    "\\nparallel" : "\u2226",
    "\\nmid" : "\u2224",
    "\\asymp" : "\u224D",
    "\\neg" : "\u00AC",
    "\\bowtie" : "\u2A1D",
    "\\vdash" : "\u22A2",
    "\\nvdash" : "\u22AC",
    "\\dashv" : "\u22A3",
    "\\vDash" : "\u22A8",
    "\\nvDash" : "\u22AD",
    "\\Vdash" : "\u22A9",
    "\\nVdash" : "\u22AE",
    "\\VDash" : "\u22AB",
    "\\nVDash" : "\u22AF",
    "\\triangleleft" : "\u22B2",
    "\\ntriangleleft" : "\u22EA",
    "\\triangleright" : "\u22B3",
    "\\ntriangleright" : "\u22EB",
    "\\ntrianglelefteq" : "\u22EC",
    "\\ntrianglerighteq" : "\u22ED",
    "\\triangleq" : "\u225C",
    "\\equest" : "\u225F",
    "\\vdots" : "\u22EE",
    "\\cdots" : "\u22EF",
    "\\udots" : "\u22F0",
    "\\ddots" : "\u22F1",
    "\\ldots" : "\u2026",

    // Arrows
    "\\Rightarrow" : "\u21D2",
    "\\Leftarrow" : "\u21D0",
    "\\rightarrow" : "\u2192",
    "\\leftarrow" : "\u2190",
    "\\Longleftarrow" : "\u27F8",
    "\\implies" : "\u27F9",
    "\\Leftrightarrow" : "\u21D4",
    "\\iff" : "\u27FA",
    "\\mapsto" : "\u27FC",
    "\\rightleftharpoons" : "\u21CC",

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
    "\\mathbbP" : "\u2119",
    "\\mathbbD" : "\u2145",
    "\\mathbbd" : "\u2146",
    "\\mathbbe" : "\u2147",
    "\\mathbbi" : "\u2148",
    "\\mathbbj" : "\u2149",
    "\\mathbbpi" : "\u213C",
    "\\mathbbPi" : "\u213F",
    "\\mathbbgamma" : "\u213D",
    "\\mathbbGamma" : "\u213E",
    "\\mathbbSigma" : "\u2140",

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
    "\\ruble" : "\u20BD",
    "\\hryvnia" : "\u20B4",
    "\\rupee" : "\u20B9",
    "\\lira" : "\u20AA",
    "\\tlira" : "\u20A9",
    "\\won" : "\u20A9",
    "\\baht" : "\u0E3F",

    // Hat
    "\\hatA" : "\u{1D434}\u0302",
    "\\hata" : "\u{1D44E}\u0302",
    "\\hatB" : "\u{1D435}\u0302",
    "\\hatb" : "\u{1D44F}\u0302",
    "\\hatC" : "\u{1D436}\u0302",
    "\\hatc" : "\u{1D450}\u0302",
    "\\hatD" : "\u{1D437}\u0302",
    "\\hatd" : "\u{1D451}\u0302",
    "\\hatE" : "\u{1D438}\u0302",
    "\\hate" : "\u{1D452}\u0302",
    "\\hatF" : "\u{1D439}\u0302",
    "\\hatf" : "\u{1D453}\u0302",
    "\\hatG" : "\u{1D43A}\u0302",
    "\\hatg" : "\u{1D454}\u0302",
    "\\hatH" : "\u{1D43B}\u0302",
    "\\hath" : "\u210E\u0302",
    "\\hatI" : "\u{1D43C}\u0302",
    "\\hati" : "\u{1D456}\u0302",
    "\\hatJ" : "\u{1D43D}\u0302",
    "\\hatj" : "\u{1D457}\u0302",
    "\\hatK" : "\u{1D43E}\u0302",
    "\\hatk" : "\u{1D458}\u0302",
    "\\hatL" : "\u{1D43F}\u0302",
    "\\hatl" : "\u{1D459}\u0302",
    "\\hatM" : "\u{1D440}\u0302",
    "\\hatm" : "\u{1D45A}\u0302",
    "\\hatN" : "\u{1D441}\u0302",
    "\\hatn" : "\u{1D45B}\u0302",
    "\\hatO" : "\u{1D442}\u0302",
    "\\hato" : "\u{1D45C}\u0302",
    "\\hatP" : "\u{1D443}\u0302",
    "\\hatp" : "\u{1D45D}\u0302",
    "\\hatQ" : "\u{1D444}\u0302",
    "\\hatq" : "\u{1D45E}\u0302",
    "\\hatR" : "\u{1D445}\u0302",
    "\\hatr" : "\u{1D45F}\u0302",
    "\\hatS" : "\u{1D446}\u0302",
    "\\hats" : "\u{1D460}\u0302",
    "\\hatT" : "\u{1D447}\u0302",
    "\\hatt" : "\u{1D461}\u0302",
    "\\hatU" : "\u{1D448}\u0302",
    "\\hatu" : "\u{1D462}\u0302",
    "\\hatV" : "\u{1D449}\u0302",
    "\\hatv" : "\u{1D463}\u0302",
    "\\hatW" : "\u{1D44A}\u0302",
    "\\hatw" : "\u{1D464}\u0302",
    "\\hatX" : "\u{1D44B}\u0302",
    "\\hatx" : "\u{1D465}\u0302",
    "\\hatY" : "\u{1D44C}\u0302",
    "\\haty" : "\u{1D466}\u0302",
    "\\hatZ" : "\u{1D44D}\u0302",
    "\\hatz" : "\u{1D467}\u0302",

    "\\veca" : "a\u20D7",

    // Other symbols
    "\\infty" : "\u221E",
    "\\angle" : "\u2220",
    "\\measuredangle" : "\u2221",
    "\\hbar" : "\u210F",
    "\\dagger" : "\u2020",
    "\\ddagger" : "\u2021",
    "\\qc" : "\u269C",
    "\\section" : "\u00A7",
    "\\paragraph" : "\u00B6",
    "\\copyright" : "\u00A9",
    "\\registered" : "\u00AE",
    "\\wp" : "\u2118",
    "\\bullet" : "\u25CF",
    "\\langle" : "\u27E8",
    "\\rangle" : "\u27E9",
    "\\lceil" : "\u2308",
    "\\rceil" : "\u2309",
    "\\lfloor" : "\u230A",
    "\\rfloor" : "\u230B",
    "\\frown" : "\u2322",
    "\\smile" : "\u2323",
    "\\:" : "\\:",
    "\\\\" : "\u000A",
    "\\tab" : "\u0009"
};

const lettersSymbols = {
    "+" : "\u002B",
    "-" : "\u2212",
    "=" : "\u003D",
    "'" : "\u2032",
    '"' : "\u2033",
    "'''" : "\u2034", // Triple prime can't work since it's more than one letter
    "/" : "\u2215",
    "," : ",",
    "." : ".",
    "|" : "|",
    "!" : "!",
    "?" : "?",
    "&" : "&",
    "(" : "(",
    ")" : ")",
    "{" : "{",
    "}" : "}",
    "[" : "[",
    "]" : "]",
    "<" : "\u003C",
    ">" : "\u003E",
    "%" : "%",
    ":" : ":",
    ";" : ";",
    "0" : "0",
    "1" : "1",
    "2" : "2",
    "3" : "3",
    "4" : "4",
    "5" : "5",
    "6" : "6",
    "7" : "7",
    "8" : "8",
    "9" : "9", 
    "A" : "\u{1D434}",
    "a" : "\u{1D44E}",
    "B" : "\u{1D435}",
    "b" : "\u{1D44F}",
    "C" : "\u{1D436}",
    "c" : "\u{1D450}",
    "D" : "\u{1D437}",
    "d" : "\u{1D451}",
    "E" : "\u{1D438}",
    "e" : "\u{1D452}",
    "F" : "\u{1D439}",
    "f" : "\u{1D453}",
    "G" : "\u{1D43A}",
    "g" : "\u{1D454}",
    "H" : "\u{1D43B}",
    "h" : "\u210E",
    "I" : "\u{1D43C}",
    "i" : "\u{1D456}",
    "J" : "\u{1D43D}",
    "j" : "\u{1D457}",
    "K" : "\u{1D43E}",
    "k" : "\u{1D458}",
    "L" : "\u{1D43F}",
    "l" : "\u{1D459}",
    "M" : "\u{1D440}",
    "m" : "\u{1D45A}",
    "N" : "\u{1D441}",
    "n" : "\u{1D45B}",
    "O" : "\u{1D442}",
    "o" : "\u{1D45C}",
    "P" : "\u{1D443}",
    "p" : "\u{1D45D}",
    "Q" : "\u{1D444}",
    "q" : "\u{1D45E}",
    "R" : "\u{1D445}",
    "r" : "\u{1D45F}",
    "S" : "\u{1D446}",
    "s" : "\u{1D460}",
    "T" : "\u{1D447}",
    "t" : "\u{1D461}",
    "U" : "\u{1D448}",
    "u" : "\u{1D462}",
    "V" : "\u{1D449}",
    "v" : "\u{1D463}",
    "W" : "\u{1D44A}",
    "w" : "\u{1D464}",
    "X" : "\u{1D44B}",
    "x" : "\u{1D465}",
    "Y" : "\u{1D44C}",
    "y" : "\u{1D466}",
    "Z" : "\u{1D44D}",
    "z" : "\u{1D467}",
};

const subscript = {
    "_" : "_",
    "0" : "\u2080",
    "1" : "\u2081",
    "2" : "\u2082",
    "3" : "\u2083",
    "4" : "\u2084",
    "5" : "\u2085",
    "6" : "\u2086",
    "7" : "\u2087",
    "8" : "\u2088",
    "9" : "\u2089",
    "+" : "\u208A",
    "-" : "\u208B",
    "=" : "\u208C",
    "(" : "\u208D",
    ")" : "\u208E",
    "a" : "\u2090",
    "e" : "\u2091",
    "h" : "\u2095",
    "i" : "\u1D62",
    "k" : "\u2096",
    "l" : "\u2097",
    "m" : "\u2098",
    "n" : "\u2099",
    "o" : "\u2092",
    "p" : "\u209A",
    "s" : "\u209B",
    "t" : "\u209C",
    "x" : "\u2093",
};

const superscript = {
    "^" : "^",
    "0" : "\u2070",
    "1" : "\u00B9",
    "2" : "\u00B2",
    "3" : "\u00B3",
    "4" : "\u2074",
    "5" : "\u2075",
    "6" : "\u2076",
    "7" : "\u2077",
    "8" : "\u2078",
    "9" : "\u2079",
    "+" : "\u207A",
    "-" : "\u207B",
    "=" : "\u207C",
    "(" : "\u207D",
    ")" : "\u207E"
};

// Submit button
const submit = document.getElementById("button");
submit.onclick = function() {main()};

// Copy button
const copyButton = document.getElementById("copy");
copyButton.onclick = function () {copy()};

// Clear button
const resetButton = document.getElementById("reset");
resetButton.onclick = function () {clear()};

// Remove space
function removeSpace(text) {
    let checkedButton = document.getElementById("remove");
    if (checkedButton.checked == true) {
        text = text.replace(/ /g, "")
    };
    return text;
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

// Copy to clipboard
function copy() {
    const copyText = document.getElementById("text_out");
    navigator.clipboard.writeText(copyText.value);

    document.getElementById("popup").innerHTML = "Text copied!";
};

// Clears "Text copied!"
function clear() {
    document.getElementById("popup").innerHTML = "";
};

// Takes word and replace letter by letter in the dictionary
function replaceLetters(word, dictionary) {
    let i;
    let newWord = "";
    for (i in word) {
        newWord += word[i].replace(word[i], dictionary[word[i]]);
    };
    return newWord;
};

// Takes text and convert word by word in the dictionary or in function replaceLetters
function convert(words, newText) {
    let i;
    for (i in words) {
        let firstLetter = words[i].charAt(0);
        if (firstLetter == "\\") {
            newText = newText.replace(words[i], mathDictionary[words[i]]);
        } else if (firstLetter == "_") {
            newText = newText.replace(words[i], replaceLetters(words[i], subscript));
            newText = newText.replace(" _", "");
        } else if (firstLetter == "^") {
            newText = newText.replace(words[i], replaceLetters(words[i], superscript));
            newText = newText.replace(" ^", "");
        } else {
            newText = newText.replace(words[i], replaceLetters(words[i], lettersSymbols));
        };
    };
    return newText;
};

// Takes the original text and spits out the new one
function main() {
    const fullText = document.text_input.text_in.value;
    let newText = fullText;
    let words = fullText.split(" ");
    newText = convert(words, newText);
    newText = removeSpace(newText);
    newText = equalSignSpace(newText);
    newText = addSpace(newText);
    document.text_input.text_out.value = newText;
    document.getElementById("text_out").disabled = false; 
};



// The following functions are not currently used, but might be in the future, 
// if a "mathmode", between "$" is implemented.

// **NOT USED** Deletes "$" in text
function deletesDollar(text) {
    text = text.replace(/\$/g, "");
    return text.replace(/  /g, " ");
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

// **NOT USED** Finds where mathmode is
function mathMode(text) {
    let i;
    let indexes = [];
    for (i in text) {
        if (text[i] == "$") {
            indexes.push(i);
        };
    };
    return indexes;
};
