import { dict } from "common/types";

// Superscript is used (by the superscript function) to convert characters to the corresponding superscript character
const Superscript: dict = {
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
    "\u2212" : "\u207B",
    "=" : "\u207C",
    "(" : "\u207D",
    ")" : "\u207E",
    "\\" : "ᐠ",
    "/" : "ᐟ",
    "." : "ᐧ",
    "," : "\u02D2",
    "$" : "ᙚ",

    "A" : "ᴬ",
    "a" : "ᵃ",
    "B" : "ᴮ",
    "b" : "ᵇ",
    "C" : "ᶜ",
    "c" : "ᶜ",
    "D" : "ᴰ",
    "d" : "ᵈ",
    "E" : "ᴱ",
    "e" : "ᵉ",
    "f" : "ᶠ",
    "G" : "ᴳ",
    "g" : "ᵍ",
    "H" : "ᴴ",
    "h" : "ʰ",
    "I" : "ᴵ",
    "i" : "ⁱ",
    "J" : "ᴶ",
    "j" : "ʲ",
    "K" : "ᴷ",
    "k" : "ᵏ",
    "L" : "ᴸ",
    "l" : "ˡ",
    "M" : "ᴹ",
    "m" : "ᵐ",
    "N" : "ᴺ",
    "n" : "ⁿ",
    "O" : "ᴼ",
    "o" : "ᵒ",
    "P" : "ᴾ",
    "p" : "ᵖ",
    "R" : "ᴿ",
    "r" : "ʳ",
    "S" : "ˢ",
    "s" : "ˢ",
    "T" : "ᵀ",
    "t" : "ᵗ",
    "U" : "ᵁ",
    "u" : "ᵘ",
    "V" : "ⱽ",
    "v" : "ᵛ",
    "W" : "ᵂ",
    "w" : "ʷ",
    "X" : "ˣ",
    "x" : "ˣ",
    "y" : "ʸ",
    "Z" : "ᶻ",
    "z" : "ᶻ",

    "𝐴" : "ᴬ",
    "𝑎" : "ᵃ",
    "𝐵" : "ᴮ",
    "𝑏" : "ᵇ",
    "𝐶" : "ᶜ",
    "𝑐" : "ᶜ",
    "𝐷" : "ᴰ",
    "𝑑" : "ᵈ",
    "𝐸" : "ᴱ",
    "𝑒" : "ᵉ",
    "𝑓" : "ᶠ",
    "𝐺" : "ᴳ",
    "𝑔" : "ᵍ",
    "𝐻" : "ᴴ",
    "ℎ" : "ʰ",
    "𝐼" : "ᴵ",
    "𝑖" : "ⁱ",
    "𝐽" : "ᴶ",
    "𝑗" : "ʲ",
    "𝐾" : "ᴷ",
    "𝑘" : "ᵏ",
    "𝐿" : "ᴸ",
    "𝑙" : "ˡ",
    "𝑀" : "ᴹ",
    "𝑚" : "ᵐ",
    "𝑁" : "ᴺ",
    "𝑛" : "ⁿ",
    "𝑂" : "ᴼ",
    "𝑜" : "ᵒ",
    "𝑃" : "ᴾ",
    "𝑝" : "ᵖ",
    "𝑅" : "ᴿ",
    "𝑟" : "ʳ",
    "𝑆" : "ˢ",
    "𝑠" : "ˢ",
    "𝑇" : "ᵀ",
    "𝑡" : "ᵗ",
    "𝑈" : "ᵁ",
    "𝑢" : "ᵘ",
    "𝑉" : "ⱽ",
    "𝑣" : "ᵛ",
    "𝑊" : "ᵂ",
    "𝑤" : "ʷ",
    "𝑋" : "ˣ",
    "𝑥" : "ˣ",
    "𝑦" : "ʸ",
    "𝑍" : "ᶻ",
    "𝑧" : "ᶻ",

    "𝛽" : "\u1D5D",
    "𝛤" : "ᣘ",
    "𝛾" : "\u1D5E",
    "Δ" : "ᐞ",
    "δ" : "\u1D5F",
    "ϵ" : "ᵋ",
    "Λ" : "ᣔ",
    "𝜃" : "\u1DBF",
    "𝜄" : "ᶥ",
    "𝜈" : "ᶹ",
    "σ" : "ᣙ",
    "𝜙" : "ᶲ",
    "𝜑" : "\u1D60",
    "𝜌" : "ᣖ",
    "𝜒" : "\u1D61",

    "∫" : "ᶴ",
    "≠" : "ᙾ",
    "∘" : "°",
    "∞" : "\u2710\u1AB2\u2710",  // Only works on certain website/apps
    "∅" : "\u{1D1A9}",
    "*" : "*",

    "\u2710" : "\u2710",
    " " : " "
};

// Subscript is used (by the subscript function) to convert characters to the corresponding subscript character
const Subscript: dict = {
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
    "\u2212" : "\u208B",
    "=" : "\u208C",
    "(" : "\u208D",
    ")" : "\u208E",
    "," : "\u2710\u0326\u2710",
    "." : "\u2710\u0323\u2710",

    "a" : "\u2090",
    "e" : "\u2091",
    "h" : "\u2095",
    "i" : "\u1D62",
    "j" : "ⱼ",
    "k" : "\u2096",
    "l" : "\u2097",
    "m" : "\u2098",
    "n" : "\u2099",
    "O" : "\u2092",
    "o" : "\u2092",
    "p" : "\u209A",
    "r" : "ᵣ",
    "S" : "\u209B",
    "s" : "\u209B",
    "t" : "\u209C",
    "u" : "ᵤ",
    "V" : "ᵥ",
    "v" : "ᵥ",
    "X" : "\u2093",
    "x" : "\u2093",

    "𝑎" : "\u2090",
    "𝑒" : "\u2091",
    "ℎ" : "\u2095",
    "𝑖" : "\u1D62",
    "𝑗" : "ⱼ",
    "𝑘" : "\u2096",
    "𝑙" : "\u2097",
    "𝑚" : "\u2098",
    "𝑛" : "\u2099",
    "𝑂" : "\u2092",
    "𝑜" : "\u2092",
    "𝑝" : "\u209A",
    "𝑟" : "ᵣ",
    "𝑆" : "\u209B",
    "𝑠" : "\u209B",
    "𝑡" : "\u209C",
    "𝑢" : "ᵤ",
    "𝑉" : "ᵥ",
    "𝑣" : "ᵥ",
    "𝑋" : "\u2093",
    "𝑥" : "\u2093",

    "𝛽" : "\u1D66",
    "𝛾" : "\u1D67",
    "𝜌" : "\u1D68",
    "𝜑" : "\u1D69",
    "𝜙" : "\u1D69",
    "𝜒" : "\u1D6A",

    "→" : "\u2710\u2710\u0362\u2710\u2710",
    "∞" : "\u2710\u035A\u2710",

    "\u2710" : "\u2710",
    " " : " "
};

export { Superscript, Subscript };