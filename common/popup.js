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

const wordsDelimiters = [" ", "", "\u000A", "\\", "^", "_", "(", ")", "[", "]", "{", "}", ",", "/", "-", "+", "=", "<", ">", "|", "?", "!"];
const wordsDelimitersWOB = [" ", "", "\u000A", "^", "_", "(", ")", "[", "]", "{", "}", ",", "/", "-", "+", "=", "<", ">", "|", "?", "!"]; // Without backslash


/// FUNCTIONS ///


function findWord(text, cursorPosition, addedLetter="") {
    // Used in the suggestion / completion popup
    // Finds the word that is touched by the cursor
    if (addedLetter.length === 1) {  // ie a letter
        text = text.split("");
        text[cursorPosition] += addedLetter;
        text = text.join("");
    } else if (addedLetter === "Backspace") {
        text = text.split("");
        text[cursorPosition] = "";
        text = text.join("");
        cursorPosition -= 1;
    };
    let word = "";
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

function semiAutoCompletion(textIn, cursorPosition, command) {
    // Replace the command being written by the selected suggestion
    let textOut = textIn;
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

function showCommand(key) {
    // Used in suggestions
    // Changes what's seen when the user hovers on a command in the suggestion popup
    if (typeof mathDictionary[key] == "function") {
        if (key == "\\sqrt") {
            return "\\sqrt[n]{x} \u2192 ⁿ√𝑥";
        } else if (key == "\\sqrt*") {
            return "\\sqrt[n]* \u2192 ⁿ√";
        } else if (key == "\\frac") {
            return "\\frac{1}{2} \u2192 ¹∕₂";
        } else if (key == "\\frac*") {
            return "\\frac*{1}{2} \u2192 ½";
        } else if ((key == "\\above") || (key == "\\below") || (key == "\\hspace") || (key == "\\vskip")) {
            return key + "{}";
        } else if ((key == "_") || (key == "^")) {
            return "x" + key + "{a1} \u2192 𝑥" + (mathDictionary[key](["a", "1"], mathDictionary[key])).join("");
        } else {
            return key + "{abc} \u2192 " + (mathDictionary[key](["a", "b", "c"], mathDictionary[key])).join("");
        };
    } else {
        if (key == "\\:") {
            return "1 space";
        } else if ((key == "\\;") || ((key == "\\quad") || (key == "\\qquad"))) {
            return mathDictionary[key].length + " spaces";
        } else if ((key == "\\id2") || (key == "\\id3") || (key == "\\id4") || (key == "\\idn")) {
            const M = {
                "\\id2": "⎡ 1 0 ⎤\u000A⎣ 0 1 ⎦",
                "\\id3" : "⎡ 1 0 0 ⎤\u000A⎢ 0 1 0 ⎥\u000A⎣ 0 0 1 ⎦",
                "\\id4" : "⎡ 1 0 0 0 ⎤\u000A⎢ 0 1 0 0 ⎥\u000A⎢ 0 0 1 0 ⎥\u000A⎣ 0 0 0 1 ⎦",
                "\\idn" : "⎡ 1 0 ⋯ 0 ⎤\u000A⎢ 0 1 ⋯ 0 ⎥\u000A⎢  ⋮  ⋮  ⋱  ⋮ ⎥\u000A⎣ 0 0 ⋯ 1 ⎦"
            }
            return M[key];
        } else {
            return mathDictionary[key]
        };
    };
};

function toReplaceCommand(key) {
    // Used in suggestions
    // Changes what the user sees when the suggestion popup is opened
    if (typeof mathDictionary[key] == "function") {
        if (key == "\\sqrt") {
            return "\\sqrt[]{}";
        } else if (key == "\\sqrt*") {
            return "\\sqrt[]*";
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
}

// Used in adjustSpacesCommon to chose which symbols to surround with spaces (if touched by a specific symbol like '=')
const characters = "AÀÂBCÇDEÉÈËÊFGHIJKLMNOÔPQRSTUÙVWXYZaàâbcçdeéèêëfghijklmnoôpqrstuùvwxyz0123456789"+
                   "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧"+
                   "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"+
                   "𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛"+
                   "𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏"+
                   "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷"+
                   "𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟"+
                   "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃"+
                   "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵"+
                   "𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻"+
                   "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿"+
                   "𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯"+
                   "𝛢𝛼𝛣𝛽𝛤𝛾Δδ𝛦ϵε𝛧𝜁𝛨𝜂Θ𝜃ϑ𝛪𝜄𝛫𝜅𝜘Λλ𝛭𝜇𝛮𝜈Φ𝜙𝜑Ξ𝜉𝛰𝜊Π𝜋𝜛𝛲𝜌ϱΣσ𝛵𝜏𝛶𝜐𝛸𝜒𝛹𝜓Ω𝜔"+
                   "𝜜𝜶𝜝𝜷𝜞𝜸𝚫𝛅𝜠𝛜𝛆𝜡𝜻𝜢𝜼𝚽𝜽𝛝𝜤𝜾𝜥𝜿𝝒𝚲𝛌𝜧𝝁𝜨𝝂𝚽𝝓𝝋𝚵𝝃𝜪𝝄𝚷𝝅𝝕𝜬𝝆𝛠𝚺𝛔𝜯𝝉𝜰𝝊𝜲𝝌𝜳𝝍𝛀𝝎"+
                   "ℾℽℿℼ⅀";

function adjustSpacesCommon(input, symbolSpaced, conditionalSpaces) {
    // Removes spaces and add some depending on surrounding symbols
    // Used if 'Adjust space' is on

    /* 
        TODO: Spacing around symbols like '+' should depend of context
        For instance f(y+2) should return f(y+2), but 3x²+4y should return 3x² + 4y 

        Also, a_{i}-x should return a_{i} - x, but \sum_{i}-x should return \sum_{i}-x (as in \sum_{i}(-x) or -\sum_{i}x)
        Again, it should take the context in consideration
    */
    input = input.slice(0, input.length - 1)  // Since the last char is a space
    if ((spacesButton.checked == true) && (input.length > 2)) {
        const noSpaceSymbols = Object.values(Superscript).concat(Object.values(Subscript), Object.values(Above), Object.values(Below)).filter(x => {return x !== "\u2710";});
        const spacedChar = characters.concat(noSpaceSymbols);  // Add space around 'conditionalSpaces' if the previous symbol is in spacedChar
        let output = "";
        input = input.replace(/ /g, "");
        let delayedSpace = false;
        let spaceStored = [];
        for (let i in input) {
            delayedSpace = noSpaceSymbols.includes(input[parseInt(i)+1]);
            if (symbolSpaced.includes(input[i])) {
                if ((output[output.length - 1] !== " ") && (output[output.length - 1] !== undefined)) {
                    if (delayedSpace) {
                        output += " " + input[i];
                        spaceStored.push(" ");
                    } else {
                        output += " " + input[i] + " ";
                    }
                } else {
                    if (delayedSpace) {
                        output += input[i];
                        spaceStored.push(" ");
                    } else {
                        output += input[i] + " ";
                    };
                };
            } else if (conditionalSpaces.includes(input[i])) {
                if ((output[output.length - 1] !== " ") && (output[output.length - 1] !== undefined) && (spacedChar.includes(output[output.length - 1]))) {
                    if (delayedSpace) {
                        output += " " + input[i];
                    } else {
                        output += " " + input[i] + " ";
                    };
                } else {
                    output += input[i];
                };
            } else {
                if (delayedSpace) {
                    output += input[i];
                } else {
                    if (spaceStored.length >= 1) {
                        output += input[i] + " ";
                        spaceStored = [];
                    }
                    else {
                        output += input[i];
                    };
                };
            };
        };
        return spaceCommand(output);
    } else {
        return spaceCommand(input);
    };
};

function adjustSpaces(input) {
    // Calls adjustSpacesCommon with specific symbols where spaces around them should be added
    const symbolSpaced = ["=", "\u003D", "\u21D2", "\u21D0", "\u21CD", "\u21CF", "\u21CE", "\u2192", "\u27F6", "\u2190", "\u27F5", 
                "\u2194", "\u21AE", "\u219A", "\u219B", "\u27F8", "\u27F9", "\u27F9", "\u21D4", "\u27FA", "\u27FC", "\u21CC", "\u21CB", 
                "\u21C0", "\u21C1", "\u21BC", "\u21BD", "\u219E", "\u21A0", "\u21C7", "\u21C9", "\u21F6", "\u21C6", "\u21C4", "\u21DA", 
                "\u21DB", "\u21A2", "\u21A3", "\u21DC", "\u21DD", "\u21AD", "\u27FF", "\u21E0", "\u21E2", "\u2208", "\u2209", "\u220B",
                "\u2282", "\u2284", "\u2286", "\u2288", "\u2283", "\u2285", "\u2287", "\u2289", "\u228F", "\u2290", "\u2291", "\u2292",
                "\u22D0", "\u22D1", "\u2ABF", "\u2AC0", "\u27C3", "\u27C4", "\u2245", "\u2247", "\u221D", "\u2261", "\u2A67", "\u2263",
                "\u2260", "\u226E", "\u226F", "\u2264", "\u2A7D", "\u2265", "\u2A7E", "\u2270", "\u2271", "\u2A87", "\u2268", "\u2A88",
                "\u2269", "\u2A89", "\u2A8A", "\u22E6", "\u22E7", "\u226A", "\u22D8", "\u226B", "\u22D9", "\u227A", "\u227B", "\u2280",
                "\u2281", "\u227C", "\u227D", "\u2AB5", "\u2AB6", "\u2AB9", "\u2ABA", "\u22E8", "\u22E9", "\u27C2", "\u2AEB", "\u2225",
                "\u2226", "\u2AF4", "\u2AF5", "\u224D", "\u2227", "\u2228", "\u27CE", "\u27CF", "\u2971", "\u2972", "\u2974", "\u2250",
                "\u2A66", "\u00D7", "\u22CA", "\u22C9", "\u225D"];
    const conditionalSpaces = ["+", "-", "\u002B", "\u2212", "\u00B1", "\u2213", "\u2248", "\u223C", "\u224C", "\u2241"];
    return adjustSpacesCommon(input, symbolSpaced, conditionalSpaces);
};

function adjustSpaceChem(input) {
    // Calls adjustSpacesCommon with specific symbols where spaces around them should be added
    const symbolSpaced = ["\u21D2", "\u21D0", "\u21CD", "\u21CF", "\u21CE", "\u2192", "\u27F6", "\u2190", "\u27F5", 
            "\u2194", "\u21AE", "\u219A", "\u219B", "\u27F8", "\u27F9", "\u27F9", "\u21D4", "\u27FA", "\u27FC", "\u21CC", "\u21CB", 
            "\u21C0", "\u21C1", "\u21BC", "\u21BD", "\u219E", "\u21A0", "\u21C7", "\u21C9", "\u21F6", "\u21C6", "\u21C4", "\u21DA", 
            "\u21DB", "\u21A2", "\u21A3", "\u21DC", "\u21DD", "\u21AD", "\u27FF", "\u21E0", "\u21E2", "\u2208", "\u2209", "\u220B",
            "\u2282", "\u2284", "\u2286", "\u2288", "\u2283", "\u2285", "\u2287", "\u2289", "\u228F", "\u2290", "\u2291", "\u2292",
            "\u22D0", "\u22D1", "\u2ABF", "\u2AC0", "\u27C3", "\u27C4", "\u2245", "\u2247", "\u221D", "\u2A67", "\u2250", "\u2A66",
            "\u2260", "\u226E", "\u226F", "\u2264", "\u2A7D", "\u2265", "\u2A7E", "\u2270", "\u2271", "\u2A87", "\u2268", "\u2A88",
            "\u2269", "\u2A89", "\u2A8A", "\u22E6", "\u22E7", "\u226A", "\u22D8", "\u226B", "\u22D9", "\u227A", "\u227B", "\u2280",
            "\u2281", "\u227C", "\u227D", "\u2AB5", "\u2AB6", "\u2AB9", "\u2ABA", "\u22E8", "\u22E9", "\u27C2", "\u2AEB", "\u2225",
            "\u2226", "\u2AF4", "\u2AF5", "\u224D", "\u2227", "\u2228", "\u27CE", "\u27CF", "\u2971", "\u2972", "\u2974", "\u00D7", 
            "\u22CA", "\u22C9", "\u225D"];
    const conditionalSpaces = ["+", "\u002B", "\u00B1", "\u2213", "\u2248", "\u223C", "\u224C", "\u2241"];
    return adjustSpacesCommon(input, symbolSpaced, conditionalSpaces);
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
