// mathDictionary is the main dict for converting commands into symbols

import { dictwF } from "../types";
import { mathbb, mathbf, mathfrak, mathcal } from "./mathfonts";
import { text, textbf, textit, texttt } from "./textfonts";
import { superscript, subscript, hspace, vskip, sqrt, sqrtNoArg, 
    frac, singleCharFrac, overline, vec, hvec, dot, ddot, 
    overfrown, oversmile, undersmile, underarrow, underharpoon, underline,
    hat, not, tilde, acute, grave, above, below } from "./mathfunctions";


const mathDictionary: dictwF = {
    // Math operators
    "\\times" : "\u00D7",
    "\\rtimes" : "\u22CA",
    "\\ltimes" : "\u22C9",
    "\\div" : "\u00F7",
    "\\longdiv" : "\u27CC",
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
    "\\cupint" : "\u2A1A",
    "\\capint" : "\u2A19",
    "\\overbarint" : "\u2A1B",
    "\\underbarint" : "\u2A1C",
    "\\cupplus" : "\u228E",
    "\\timesint" : "\u2A18",
    "\\ast" : "\u2217",
    "\\star" : "\u22C6",
    "\\partial" : "\u2202",
    "\\nabla" : "\u2207",
    "\\sqrt2" : "\u221A",
    "\\sqrt3" : "\u221B",
    "\\sqrt4" : "\u221C",
    "\\circ" : "\u2218",
    "\\sum" : "\u2211",
    "\\osum" : "\u2A0A",
    "\\sumint" : "\u2A0B",
    "\\prod" : "\u220F",
    "\\cdot" : "\u00B7",
    "\\cdotp" : "\u22C5",
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
    "\\rank" : "rank",
    "\\log" : "log",
    "\\ln" : "ln",
    "\\lim" : "lim",
    "\\mod" : "mod",
    "\\Mod" : "Mod",
    "\\cup" : "\u222A",
    "\\Cup" : "\u22D3",
    "\\sqcup" : "\u2294",
    "\\sqCup" : "\u2A4F",
    "\\cap" : "\u2229",
    "\\Cap" : "\u22D2",
    "\\sqcap" : "\u2293",
    "\\sqCap" : "\u2A4E",
    "\\uplus" : "\u228E",
    "\\def" : "\u225D",
    "\\vee" : "\u2228",
    "\\doublevee" : "\u2A56",
    "\\wedge" : "\u2227",
    "\\doublewedge" : "\u2A55",
    "\\curlyvee" : "\u22CE",
    "\\curlywedge" : "\u22CF",
    "\\diamond" : "\u22C4",
    "\\wr" : "\u2240",
    "\\oplus" : "\u2295",
    "\\ominus" : "\u2296",
    "\\otimes" : "\u2297",
    "\\oslash" : "\u2298",
    "\\odot" : "\u2299",
    "\\obullet" : "\u29BF",
    "\\ocirc" : "\u29BE",
    "\\operp" : "\u29B9",
    "\\oparallel" : "\u29B7",
    "\\oast" : "\u229B",
    "\\oeq" : "\u229C",
    "\\opluslhrim" : "\u2A2D",
    "\\oplusrhrim" : "\u2A2E",
    "\\otimeslhrim" : "\u2A34",
    "\\otimesrhrim" : "\u2A35",
    "\\boxplus" : "\u229E",
    "\\boxminus" : "\u229F",
    "\\boxtimes" : "\u22A0",
    "\\boxdot" : "\u22A1",
    "\\amalg" : "\u2210",
    "\\tprime" : "\u2034",
    "\\lthree" : "\u22CB",
    "\\rthree" : "\u22CC",
    "\\pitchfork" : "\u22D4",
    "\\topfork" : "\u2ADA",
    "\\invamp" : "\u214B",
    "\\originalof" : "\u22B6",
    "\\imageof" : "\u22B7",
    "\\multimap" : "\u22B8",
    "\\leftmultimap" : "\u27DC",
    "\\uptack" : "\u27DF",
    "\\xor" : "\u22BB",
    "\\nand" : "\u22BC",
    "\\nor" : "\u22BD",
    "\\divideontimes" : "\u22C7",
    "\\smashtimes" : "\u2A33",
    "\\fracline" : "\u2215",  // Better suited for superscript over subscript

    // Relations
    "\\forall" : "\u2200",
    "\\exists" : "\u2203",
    "\\nexists" : "\u2204",
    "\\land" : "\u2227",
    "\\lor" : "\u2228",
    "\\sqland" : "\u27CE",
    "\\sqlor" : "\u27CF",
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
    "\\sqsupset" : "\u2290",
    "\\sqsubseteq" : "\u2291",
    "\\sqsupseteq" : "\u2292",
    "\\Subset" : "\u22D0",
    "\\Supset" : "\u22D1",
    "\\subsetplus" : "\u2ABF",
    "\\supsetplus" : "\u2AC0",
    "\\osubset" : "\u27C3",
    "\\osupset" : "\u27C4",
    "\\setminus" : "\u2216",
    "\\cong" : "\u2245",
    "\\ncong" : "\u2247",
    "\\propto" : "\u221D",
    "\\equiv" : "\u2261",
    "\\dotequiv" : "\u2A67",
    "\\superequiv" : "\u2263",
    "\\tbond" : "\u2261",
    "\\qbond" : "\u2263",
    "\\doteq" : "\u2250",
    "\\eqdot" : "\u2A66",
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
    "\\gneq" : "\u2A88",
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
    "\\Perp" : "\u2AEB",
    "\\parallel" : "\u2225",
    "\\nparallel" : "\u2226",
    "\\vvvert" : "\u2AF4",
    "\\nvvvert" : "\u2AF5",
    "\\mid" : "|",
    "\\nmid" : "\u2224",
    "\\asymp" : "\u224D",
    "\\neg" : "\u00AC",
    "\\bowtie" : "\u2A1D",
    "\\vdash" : "\u22A2",
    "\\nvdash" : "\u22AC",
    "\\dashv" : "\u22A3",
    "\\vDash" : "\u22A8",
    "\\Dashv" : "\u2AE4",
    "\\nvDash" : "\u22AD",
    "\\Vdash" : "\u22A9",
    "\\dashV" : "\u2AE3",
    "\\nVdash" : "\u22AE",
    "\\VDash" : "\u22AB",
    "\\DashV" : "\u2AE5",
    "\\nVDash" : "\u22AF",
    "\\triangleleft" : "\u22B2",
    "\\ntriangleleft" : "\u22EA",
    "\\triangleright" : "\u22B3",
    "\\ntriangleright" : "\u22EB",
    "\\ntrianglelefteq" : "\u22EC",
    "\\ntrianglerighteq" : "\u22ED",
    "\\triangleq" : "\u225C",
    "\\equest" : "\u225F",
    "\\lquest" : "\u2A7B",
    "\\rquest" : "\u2A7C",
    "\\mquest" : "\u225E",
    "\\vdots" : "\u22EE",
    "\\cdots" : "\u22EF",
    "\\udots" : "\u22F0",
    "\\ddots" : "\u22F1",
    "\\ldots" : "\u2026",
    "\\top" : "\u22A4",
    "\\bot" : "\u22A5",
    "\\between" : "\u226C",
    "\\therefore" : "\u2234",
    "\\because" : "\u2235",
    "\\squaredots" : "\u2237",
    "\\dotminus" : "\u2238",
    "\\max" : "max",
    "\\min" : "min",
    "\\grad" : "grad",
    "\\curl" : "curl",
    "\\ratio" : "\u2236",  // Same as ":", except with "$chem"

    // Arrows
    "\\Rightarrow" : "\u21D2",
    "\\Leftarrow" : "\u21D0",
    "\\nLeftarrow" : "\u21CD",
    "\\nRightarrow" : "\u21CF",
    "\\nLeftrightarrow" : "\u21CE",
    "\\Uparrow" : "\u21D1",
    "\\Downarrow" : "\u21D3",
    "\\Updownarrow" : "\u21D5",
    "\\rightarrow" : "\u2192",
    "\\longrightarrow" : "\u27F6",
    "\\leftarrow" : "\u2190",
    "\\longleftarrow" : "\u27F5",
    "\\leftrightarrow" : "\u2194",
    "\\nleftrightarrow" : "\u21AE",
    "\\uparrow" : "\u2191",
    "\\downarrow" : "\u2193",
    "\\updownarrow" : "\u2195",
    "\\nleftarrow" : "\u219A",
    "\\nrightarrow" : "\u219B",
    "\\Longleftarrow" : "\u27F8",
    "\\implies" : "\u27F9",
    "\\Longrightarrow" : "\u27F9",
    "\\Leftrightarrow" : "\u21D4",
    "\\iff" : "\u27FA",
    "\\mapsto" : "\u27FC",
    "\\rightleftharpoons" : "\u21CC",
    "\\leftrightharpoons" : "\u21CB",
    "\\rightharpoonup" : "\u21C0",
    "\\rightharpoondown" : "\u21C1",
    "\\leftharpoonup" : "\u21BC",
    "\\leftharpoondown" : "\u21BD",
    "\\upharpoonleft" : "\u21BF",
    "\\upharpoonright" : "\u21BE",
    "\\downharpoonleft" : "\u21C3",
    "\\downharpoonright" : "\u21C2", 
    "\\hookleftarrow" : "\u21A9",
    "\\hookrightarrow" : "\u21AA",
    "\\nearrow" : "\u2197",
    "\\searrow" : "\u2198",
    "\\swarrow" : "\u2199",
    "\\nwarrow" : "\u2196",
    "\\Nearrow" : "\u21D7",
    "\\Searrow" : "\u21D8",
    "\\Swarrow" : "\u21D9",
    "\\Nwarrow" : "\u21D6",
    "\\twoheadleftarrow" : "\u219E",
    "\\twoheadrightarrow" : "\u21A0",
    "\\twoheaduparrow" : "\u219F",
    "\\twoheaddownarrow" : "\u21A1",
    "\\Lsh" : "\u21B0",
    "\\Rsh" : "\u21B1",
    "\\leftleftarrows" : "\u21C7",
    "\\rightrightarrows" : "\u21C9",
    "\\rightrightrightarrows" : "\u21F6",
    "\\upuparrows" : "\u21C8",
    "\\downdownarrows" : "\u21CA",
    "\\leftrightarrows" : "\u21C6",
    "\\rightleftarrows" : "\u21C4",
    "\\Lleftarrow" : "\u21DA",
    "\\Rrightarrow" : "\u21DB",
    "\\Uuparrow" : "\u290A",
    "\\Ddownarrow" : "\u290B",
    "\\leftarrowtail" : "\u21A2",
    "\\rightarrowtail" : "\u21A3",
    "\\leftsquigarrow" : "\u21DC",
    "\\rightsquigarrow" : "\u21DD",
    "\\leftrightsquigarrow" : "\u21AD",
    "\\longrightsquiglearrow" : "\u27FF",
    "\\looparrowleft" : "\u21AB",
    "\\looparrowright" : "\u21AC",
    "\\circlearrowleft" : "\u21BA",
    "\\circlearrowright" : "\u21BB",
    "\\curvearrowleft" : "\u21B6",
    "\\curvearrowright" : "\u21B7",
    "\\leftdasharrow" : "\u21E0",
    "\\rightdasharrow" : "\u21E2",
    "\\updasharrow" : "\u21E1",
    "\\downdasharrow" : "\u21E3",
    "\\tildeabovearrow" : "\u2972",
    "\\tildebelowarrow" : "\u2974",
    "\\equalabovearrow" : "\u2971",

    // Hebrew alphabet
    "\\aleph" : "\u2135",
    "\\beth" : "\u2136",
    "\\gimel" : "\u2137",
    "\\dalet" : "\u2138",

    // Convert text
    "\\mathbb" : mathbb,
    "\\mathbf" : mathbf,
    "\\mathcal" : mathcal,
    "\\mathfrak" : mathfrak,
    "^" : superscript,
    "_" : subscript,
    "\\text" : text,
    "\\textbf" : textbf,
    "\\textit" : textit,
    "\\texttt" : texttt,

    // Spaces
    "\\hspace" : hspace,
    "\\vskip" : vskip,

    // Square root and fractions
    "\\sqrt" : sqrt,
    "\\sqrt*" : sqrtNoArg,
    "\\frac" : frac,
    "\\frac*" : singleCharFrac,

    // Combining symbols
    "\\overline" : overline,
    "\\underline" : underline,
    "\\underarrow" : underarrow,
    "\\underharpoon" : underharpoon,
    "\\overfrown" : overfrown,
    "\\oversmile" : oversmile,
    "\\undersmile" : undersmile,
    "\\hat" : hat,
    "\\not" : not,
    "\\tilde" : tilde,
    "\\vec" : vec,
    "\\hvec" : hvec,
    "\\dot" : dot,
    "\\ddot" : ddot,
    "\\acute" : acute,
    "\\grave" : grave,

    // For Lewis Notation
    "\\above" : above,
    "\\below" : below,
    "\\mid." : "\u2E31",
    "\\mid:" : "\u003A",

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

    "\\^" : "^",
    "\\_" : "_",

    // Matrix
    "\\id1" : "[1]",
    "\\id2" : "\u23A1 \u2710 1 \u2710 0 \u2710 \u23A4 \u000A \u23A3 \u2710 0 \u2710 1 \u2710 \u23A6",
    "\\id3" : "\u23A1 \u2710 1 \u2710 0 \u2710 0 \u2710 \u23A4 \u000A \u23A2 \u2710 0 \u2710 1 \u2710 0 \u2710 \u23A5 \u000A \u23A3 \u2710 0 \u2710 0 \u2710 1 \u2710 \u23A6",
    "\\id4" : "\u23A1 \u2710 1 \u2710 0 \u2710 0 \u2710 0 \u2710 \u23A4 \u000A \u23A2 \u2710 0 \u2710 1 \u2710 0 \u2710 0 \u2710 \u23A5 \u000A \u23A2 \u2710 0 \u2710 0 \u2710 1 \u2710 0 \u2710 \u23A5 \u000A \u23A3 \u2710 0 \u2710 0 \u2710 0 \u2710 1 \u2710 \u23A6",
    "\\idn" : "\u23A1 \u2710 1 \u2710 0 \u2710 \u22EF \u2710 0 \u2710 \u23A4 \u000A \u23A2 \u2710 0 \u2710 1 \u2710 \u22EF \u2710 0 \u2710 \u23A5 \u000A \u23A2 \u2710 \u2710 \u22EE \u2710 \u2710 \u22EE \u2710 \u2710 \u22F1 \u2710 \u2710 \u22EE \u2710 \u23A5 \u000A \u23A3 \u2710 0 \u2710 0 \u2710 \u22EF \u2710 1 \u2710 \u23A6",
    
    // To build your own
    "\\mlceil" : "\u23A1",
    "\\mrceil" : "\u23A4",
    "\\mlmid" : "\u23A2",
    "\\mrmid" : "\u23A5",
    "\\mlfloor" : "\u23A3",
    "\\mrfloor" : "\u23A6",

    // Music
    "\\flat" : "\u{1D12C}",
    "\\natural" : "\u{1D12E}",
    "\\sharp" : "\u{1D130}",
    "\\eightnote" : "\u{1D160}",
    "\\sixteenthnote" : "\u{1D161}",
    "\\halfnote" : "\u{1D15E}",
    "\\quarternote" : "\u{1D15F}",
    "\\fullnote" : "\u{1D15D}",
    "\\doublenote" : "\u266B",
    "\\trebleclef" : "\u{1D11E}",
    
    // Box drawing
    "\\boxh" : "\u2500",
    "\\boxbfh" : "\u2501",
    "\\boxH" : "\u2550",
    "\\boxv" : "\u2502",
    "\\boxbfv" : "\u2503",
    "\\boxV" : "\u2551",
    "\\boxdr" : "\u250C",
    "\\boxbfdr" : "\u250F",
    "\\boxDR" : "\u2554",
    "\\boxdl" : "\u2510",
    "\\boxbfdl" : "\u2513",
    "\\boxDL" : "\u2557",
    "\\boxur" : "\u2514",
    "\\boxbfur" : "\u2517",
    "\\boxUR" : "\u255A",
    "\\boxul" : "\u2518",
    "\\boxbful" : "\u251B",
    "\\boxUL" : "\u255D",
    "\\boxvr" : "\u251C",
    "\\boxbfvr" : "\u2523",
    "\\boxVR" : "\u2560",
    "\\boxvl" : "\u2524",
    "\\boxbfvl" : "\u252B",
    "\\boxVL" : "\u2563",
    "\\boxdh" : "\u252C",
    "\\boxbfdh" : "\u2533",
    "\\boxDH" : "\u2566",
    "\\boxuh" : "\u2534",
    "\\boxbfuh" : "\u253B",
    "\\boxUH" : "\u2569",
    "\\boxvh" : "\u253C",
    "\\boxbfvh" : "\u254B",
    "\\boxVH" : "\u256C",

    // Other symbols
    "\\LaTeX" : "𝐿ᴬ𝑇ᴇ𝑋",
    "\\TeX" : "𝑇ᴇ𝑋",
    "\\MatTalX" : "𝑀ᴀᴛ𝑇ᴀʟ𝑋",
    "\\CaMuS" : "𝐶ᴬ𝑀ᴜ𝑆",  // http://camus.math.usherbrooke.ca/index.html
    "\\infty" : "\u221E",
    "\\iinfin" : "\u29DC",
    "\\tieinfty" : "\u29DD",
    "\\nvinfty" : "\u29DE",
    "\\acidfree" : "\u267E",
    "\\radioactive" : "\u2622",
    "\\biohazard" : "\u2623",
    "\\atom" : "\u269B",
    "\\angle" : "\u2220",
    "\\measuredangle" : "\u2221",
    "\\sphericalangle" : "\u2222",
    "\\rightangle" : "\u299C",
    "\\hbar" : "\u210F",
    "\\ell" : "\u2113",
    "\\dagger" : "\u2020",
    "\\ddagger" : "\u2021",
    "\\hermitian" : "\u22B9",
    "\\qc" : "\u269C",
    "\\section" : "\u00A7",
    "\\paragraph" : "\u00B6",
    "\\copyright" : "\u00A9",
    "\\registered" : "\u00AE",
    "\\wp" : "\u2118",
    "\\laplace" : "\u2112",
    "\\bloch" : "\u212C",
    "\\im" : "\u2111",
    "\\fourier" : "\u2131",
    "\\angstrom" : "\u212B",
    "\\emdash" : "\u2014",
    "\\bullet" : "\u2219",
    "\\textbullet" : "\u2022",
    "\\bigbullet" : "\u25CF",
    "\\langle" : "\u27E8",
    "\\rangle" : "\u27E9",
    "\\llangle" : "\u27EA",
    "\\rrangle" : "\u27EB",
    "\\lceil" : "\u2308",
    "\\rceil" : "\u2309",
    "\\lfloor" : "\u230A",
    "\\rfloor" : "\u230B",
    "\\lBrace" : "\u2983",
    "\\rBrace" : "\u2984",
    "\\%" : "%",
    "\\{" : "{",
    "\\}" : "}",
    "\\(" : "(",
    "\\)" : ")",
    "\\[" : "[",
    "\\]" : "]",
    "\\backslash" : "\\",
    "\\llbracket" : "\u27E6",
    "\\rrbracket" : "\u27E7",
    "\\llparenthesis" : "\u2985",
    "\\rrparenthesis" : "\u2986",
    "\\frown" : "\u2322",
    "\\smile" : "\u2323",
    "\\qed" : "\u220E",
    "\\blacksquare" : "\u25A0",
    "\\square" : "\u25A1",
    "\\lightning" : "\u21AF",
    "\\male" : "\u2642",
    "\\female" : "\u2640",
    "\\Hermaphrodite" : "\u26A5",
    "\\neuter" : "\u26B2",
    "\\malemale" : "\u26A3",
    "\\femalefemale" : "\u26A2",
    "\\femalemale" : "\u26A4",
    "\\" : "\\",
    "\\:" : "\u2710",  // Space (internally represented with \u2710 (✐), but switched to a real space before output)
    "\\;" : "\u2710\u2710",  // Double space
    "\\quad" : "\u2710\u2710\u2710",
    "\\qquad" : "\u2710\u2710\u2710\u2710",
    "\\colon" : "\u003A",
    "\\\\" : "\u000A",
    "\\linebreak" : "\u000A",
    "\\newline" : "\u000A",
    "\\tab" : "\u0009"
};


export { mathDictionary };