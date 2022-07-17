/*
    The main purpose of this program is to take a text as input (mostly LaTeX commands), 
    to convert them into the desired symbol (UTF) and finally to display them so they can 
    be copied and sent via Messenger, Instagram, Twitter, etc.
*/




/// Global variables ///


// Dictionary for text conversion
const mathDictionary = {
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
    "\\sqrt" : "\u221A",
    "\\sqrt3" : "\u221B",
    "\\sqrt4" : "\u221C",
    "\\circ" : "\u2218",
    "\\sum" : "\u2211",
    "\\osum" : "\u2A0A",
    "\\sumint" : "\u2A0B",
    "\\prod" : "\u220F",
    "\\cdot" : "\u22C5",
    "\\pm" : "\u00B1",
    "\\mp" : "\u2213",
    "\\emptyset" : "\u2205",
    "\\emptysetrightarrow" : "\u29B3",
    "\\emptysetleftarrow" : "\u29B4",
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

    // Fractions
    "\\frac" : "\u2215",  // Better suited for superscript over subscript
    "\\frac1/2" : "\u00BD",
    "\\frac1/7" : "⅐",
    "\\frac1/9" : "⅑",
    "\\frac1/10" : "⅒",
    "\\frac1/3"  :"⅓",
    "\\frac2/3" : "⅔",
    "\\frac1/5" : "⅕",
    "\\frac2/5" : "⅖",
    "\\frac3/5" : "⅗",
    "\\frac4/5" : "⅘",
    "\\frac1/6" : "⅙",
    "\\frac5/6" : "⅚",
    "\\frac1/8" : "⅛",
    "\\frac3/8" : "⅜",
    "\\frac5/8" : "⅝",
    "\\frac7/8" : "⅞",
    "\\fraca/c" : "\u2100",
    "\\fraca/s" : "\u2101",
    "\\fracc/o" : "\u2105",
    "\\fracc/u" : "\u2106",

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
    "\\div" : "div",
    "\\curl" : "curl",
    "\\ratio" : "\u2236",  // Same as ":", except with "$chem"

    // Arrows
    "\\Rightarrow" : "\u21D2",
    "\\=>" : "\u21D2",
    "\\Leftarrow" : "\u21D0",
    "\\<=" : "\u21D0",
    "\\nLeftarrow" : "\u21CD",
    "\\nRightarrow" : "\u21CF",
    "\\nLeftrightarrow" : "\u21CE",
    "\\Uparrow" : "\u21D1",
    "\\Downarrow" : "\u21D3",
    "\\Updownarrow" : "\u21D5",
    "\\rightarrow" : "\u2192",
    "\\->" : "\u2192",
    "\\longrightarrow" : "\u27F6",
    "\\-->" : "\u27F6",
    "\\leftarrow" : "\u2190",
    "\\<-" : "\u2190",
    "\\longleftarrow" : "\u27F5",
    "\\<--" : "\u27F5",
    "\\leftrightarrow" : "\u2194",
    "\\<->" : "\u2194",
    "\\nleftrightarrow" : "\u21AE",
    "\\uparrow" : "\u2191",
    "\\downarrow" : "\u2193",
    "\\updownarrow" : "\u2195",
    "\\nleftarrow" : "\u219A",
    "\\nrightarrow" : "\u219B",
    "\\Longleftarrow" : "\u27F8",
    "\\<==" : "\u27F8",
    "\\implies" : "\u27F9",
    "\\Longrightarrow" : "\u27F9",
    "\\==>" : "\u27F9",
    "\\Leftrightarrow" : "\u21D4",
    "\\<=>" : "\u21D4",
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
    "\\<<-" : "\u219E",
    "\\twoheadrightarrow" : "\u21A0",
    "\\->>" : "\u21A0",
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
    "\\<-<" : "\u21A2",
    "\\rightarrowtail" : "\u21A3",
    "\\>->" : "\u21A3",
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

    // Greek alphabet
    "\\Alpha" : "\u{1D6E2}",
    "\\alpha" : "\u{1D6FC}",
    "\\Beta" : "\u{1D6E3}",
    "\\beta" : "\u{1D6FD}",
    "\\Gamma" : "\u{1D6E4}",
    "\\gamma" : "\u{1D6FE}",
    "\\Delta" : "\u0394",
    "\\delta" : "\u03B4",
    "\\Epsilon" : "\u{1D6E6}",
    "\\epsilon" : "\u03F5",
    "\\varepsilon" : "\u03B5",
    "\\Zeta" : "\u{1D6E7}",
    "\\zeta" : "\u03B6",
    "\\Eta" : "\u{1D6E8}",
    "\\eta" : "\u{1D702}",
    "\\Theta" : "\u0398",
    "\\theta" : "\u{1D703}",
    "\\vartheta" : "\u03D1",
    "\\Iota" : "\u{1D6EA}",
    "\\iota" : "\u{1D704}",
    "\\Kappa" : "\u{1D6EB}",
    "\\kappa" : "\u{1D705}",
    "\\varkappa" : "\u{1D718}",
    "\\Lambda" : "\u039B",
    "\\lambda" : "\u03BB",
    "\\Mu" : "\u{1D6ED}",
    "\\mu" : "\u{1D707}",
    "\\Nu" : "\u{1D6EE}",
    "\\nu" : "\u{1D708}",
    "\\Xi" : "\u039E",
    "\\xi" : "\u{1D709}",
    "\\Omicron" : "\u{1D6F0}",
    "\\omicron" : "\u{1D70A}",
    "\\Pi" : "\u03A0",
    "\\pi" : "\u{1D70B}",
    "\\varpi" : "\u{1D71B}",
    "\\Rho" : "\u{1D6F2}",
    "\\rho" : "\u{1D70C}",
    "\\varrho" : "\u03F1",
    "\\Sigma" : "\u03A3",
    "\\sigma" : "\u03C3",
    "\\varsigma" : "\u03C2",
    "\\Tau" : "\u{1D6F5}",
    "\\tau" : "\u{1D70F}",
    "\\Upsilon" : "\u{1D6F6}",
    "\\upsilon" : "\u{1D710}",
    "\\Phi" : "\u03A6",
    "\\phi" : "\u{1D719}",
    "\\varphi" : "\u{1D711}",
    "\\Chi" : "\u{1D6F8}",
    "\\chi" : "\u{1D712}",
    "\\Psi" : "\u{1D6F9}",
    "\\psi" : "\u{1D713}",
    "\\Omega" : "\u2126",
    "\\omega" : "\u{1D714}",

    // Hebrew alphabet
    "\\aleph" : "\u2135",
    "\\beth" : "\u2136",
    "\\gimel" : "\u2137",
    "\\dalet" : "\u2138",

    // Mathbb
    "\\mathbbA" : "\u{1D538}",
    "\\mathbbB" : "\u{1D539}",
    "\\mathbbC" : "\u2102",
    "\\mathbbD" : "\u{1D53B}",
    "\\mathbbE" : "\u{1D53C}",
    "\\mathbbF" : "\u{1D53D}",
    "\\mathbbG" : "\u{1D53E}",
    "\\mathbbH" : "\u210D",
    "\\mathbbI" : "\u{1D540}",
    "\\mathbbJ" : "\u{1D541}",
    "\\mathbbK" : "\u{1D542}",
    "\\mathbbL" : "\u{1D543}",
    "\\mathbbM" : "\u{1D544}",
    "\\mathbbN" : "\u2115",
    "\\mathbbO" : "\u{1D546}",
    "\\mathbbP" : "\u2119",
    "\\mathbbQ" : "\u211A",
    "\\mathbbR" : "\u211D",
    "\\mathbbS" : "\u{1D54A}",
    "\\mathbbT" : "\u{1D54B}",
    "\\mathbbU" : "\u{1D54C}",
    "\\mathbbV" : "\u{1D54D}",
    "\\mathbbW" : "\u{1D54E}",
    "\\mathbbX" : "\u{1D54F}",
    "\\mathbbY" : "\u{1D550}",
    "\\mathbbZ" : "\u2124",
    "\\mathbba" : "\u{1D552}",
    "\\mathbbb" : "\u{1D553}",
    "\\mathbbc" : "\u{1D554}",
    "\\mathbbd" : "\u{1D555}",
    "\\mathbbe" : "\u{1D556}",
    "\\mathbbf" : "\u{1D557}",
    "\\mathbbg" : "\u{1D558}",
    "\\mathbbh" : "\u{1D559}",
    "\\mathbbi" : "\u{1D55A}",
    "\\mathbbj" : "\u{1D55B}",
    "\\mathbbk" : "\u{1D55C}",
    "\\mathbbl" : "\u{1D55D}",
    "\\mathbbm" : "\u{1D55E}",
    "\\mathbbn" : "\u{1D55F}",
    "\\mathbbo" : "\u{1D560}",
    "\\mathbbp" : "\u{1D561}",
    "\\mathbbq" : "\u{1D562}",
    "\\mathbbr" : "\u{1D563}",
    "\\mathbbs" : "\u{1D564}",
    "\\mathbbt" : "\u{1D565}",
    "\\mathbbu" : "\u{1D566}",
    "\\mathbbv" : "\u{1D567}",
    "\\mathbbw" : "\u{1D568}",
    "\\mathbbx" : "\u{1D569}",
    "\\mathbby" : "\u{1D56A}",
    "\\mathbbz" : "\u{1D56B}",
    
    "\\mathbbpi" : "\u213C",
    "\\mathbbPi" : "\u213F",
    "\\mathbbgamma" : "\u213D",
    "\\mathbbGamma" : "\u213E",
    "\\mathbbSigma" : "\u2140",

    "\\mathbb0" : "\u{1D7D8}",
    "\\mathbb1" : "\u{1D7D9}",
    "\\mathbb2" : "\u{1D7DA}",
    "\\mathbb3" : "\u{1D7DB}",
    "\\mathbb4" : "\u{1D7DC}",
    "\\mathbb5" : "\u{1D7DD}",
    "\\mathbb6" : "\u{1D7DE}",
    "\\mathbb7" : "\u{1D7DF}",
    "\\mathbb8" : "\u{1D7E0}",
    "\\mathbb9" : "\u{1D7E1}",

    // Mathbf
    "\\mathbfA" : "\u{1D468}",
    "\\mathbfa" : "\u{1D482}",
    "\\mathbfB" : "\u{1D469}",
    "\\mathbfb" : "\u{1D483}",
    "\\mathbfC" : "\u{1D46A}",
    "\\mathbfc" : "\u{1D484}",
    "\\mathbfD" : "\u{1D46B}",
    "\\mathbfd" : "\u{1D485}",
    "\\mathbfE" : "\u{1D46C}",
    "\\mathbfe" : "\u{1D486}",
    "\\mathbfF" : "\u{1D46D}",
    "\\mathbff" : "\u{1D487}",
    "\\mathbfG" : "\u{1D46E}",
    "\\mathbfg" : "\u{1D488}",
    "\\mathbfH" : "\u{1D46F}",
    "\\mathbfh" : "\u{1D489}",
    "\\mathbfI" : "\u{1D470}",
    "\\mathbfi" : "\u{1D48A}",
    "\\mathbfJ" : "\u{1D471}",
    "\\mathbfj" : "\u{1D48B}",
    "\\mathbfK" : "\u{1D472}",
    "\\mathbfk" : "\u{1D48C}",
    "\\mathbfL" : "\u{1D473}",
    "\\mathbfl" : "\u{1D48D}",
    "\\mathbfM" : "\u{1D474}",
    "\\mathbfm" : "\u{1D48E}",
    "\\mathbfN" : "\u{1D475}",
    "\\mathbfn" : "\u{1D48F}",
    "\\mathbfO" : "\u{1D476}",
    "\\mathbfo" : "\u{1D490}",
    "\\mathbfP" : "\u{1D477}",
    "\\mathbfp" : "\u{1D491}",
    "\\mathbfQ" : "\u{1D478}",
    "\\mathbfq" : "\u{1D492}",
    "\\mathbfR" : "\u{1D479}",
    "\\mathbfr" : "\u{1D493}",
    "\\mathbfS" : "\u{1D47A}",
    "\\mathbfs" : "\u{1D494}",
    "\\mathbfT" : "\u{1D47B}",
    "\\mathbft" : "\u{1D495}",
    "\\mathbfU" : "\u{1D47C}",
    "\\mathbfu" : "\u{1D496}",
    "\\mathbfV" : "\u{1D47D}",
    "\\mathbfv" : "\u{1D497}",
    "\\mathbfW" : "\u{1D47E}",
    "\\mathbfw" : "\u{1D498}",
    "\\mathbfX" : "\u{1D47F}",
    "\\mathbfx" : "\u{1D499}",
    "\\mathbfY" : "\u{1D480}",
    "\\mathbfy" : "\u{1D49A}",
    "\\mathbfZ" : "\u{1D481}",
    "\\mathbfz" : "\u{1D49B}",

    "\\mathbf0" : "\u{1D7EC}",
    "\\mathbf1" : "\u{1D7ED}",
    "\\mathbf2" : "\u{1D7EE}",
    "\\mathbf3" : "\u{1D7EF}",
    "\\mathbf4" : "\u{1D7F0}",
    "\\mathbf5" : "\u{1D7F1}",
    "\\mathbf6" : "\u{1D7F2}",
    "\\mathbf7" : "\u{1D7F3}",
    "\\mathbf8" : "\u{1D7F4}",
    "\\mathbf9" : "\u{1D7F5}",

    "\\mathbfAlpha" : "\u{1D71C}",
    "\\mathbfalpha" : "\u{1D736}",
    "\\mathbfBeta" : "\u{1D71D}",
    "\\mathbfbeta" : "\u{1D737}",
    "\\mathbfGamma" : "\u{1D71E}",
    "\\mathbfgamma" : "\u{1D738}",
    "\\mathbfDelta" : "\u{1D6AB}",
    "\\mathbfdelta" : "\u{1D6C5}",
    "\\mathbfEpsilon" : "\u{1D720}",
    "\\mathbfepsilon" : "\u{1D6DC}",
    "\\mathbfvarepsilon" : "\u{1D6C6}",
    "\\mathbfZeta" : "\u{1D721}",
    "\\mathbfzeta" : "\u{1D6C7}",
    "\\mathbfEta" : "\u{1D722}",
    "\\mathbfeta" : "\u{1D73C}",
    "\\mathbfTheta" : "\u{1D6BD}",
    "\\mathbftheta" : "\u{1D73D}",
    "\\mathbfvartheta" : "\u{1D6DD}",
    "\\mathbfIota" : "\u{1D724}",
    "\\mathbfiota" : "\u{1D73E}",
    "\\mathbfKappa" : "\u{1D725}",
    "\\mathbfkappa" : "\u{1D73F}",
    "\\mathbfvarkappa" : "\u{1D752}",
    "\\mathbfLambda" : "\u{1D6B2}",
    "\\mathbflambda" : "\u{1D6CC}",
    "\\mathbfMu" : "\u{1D727}",
    "\\mathbfmu" : "\u{1D741}",
    "\\mathbfNu" : "\u{1D728}",
    "\\mathbfnu" : "\u{1D742}",
    "\\mathbfXi" : "\u{1D6B5}",
    "\\mathbfxi" : "\u{1D743}",
    "\\mathbfOmicron" : "\u{1D72A}",
    "\\mathbfomicron" : "\u{1D744}",
    "\\mathbfPi" : "\u{1D6B7}",
    "\\mathbfpi" : "\u{1D745}",
    "\\mathbfvarpi" : "\u{1D755}",
    "\\mathbfRho" : "\u{1D72C}",
    "\\mathbfrho" : "\u{1D746}",
    "\\mathbfvarrho" : "\u{1D6E0}",
    "\\mathbfSigma" : "\u{1D6BA}",
    "\\mathbfsigma" : "\u{1D6D4}",
    "\\mathbfvarsigma" : "\u{1D6D3}",
    "\\mathbfTau" : "\u{1D72F}",
    "\\mathbftau" : "\u{1D749}",
    "\\mathbfUpsilon" : "\u{1D730}",
    "\\mathbfupsilon" : "\u{1D74A}",
    "\\mathbfPhi" : "\u{1D6BD}",
    "\\mathbfphi" : "\u{1D753}",
    "\\mathbfvarphi" : "\u{1D74B}",
    "\\mathbfChi" : "\u{1D732}",
    "\\mathbfchi" : "\u{1D74C}",
    "\\mathbfPsi" : "\u{1D733}",
    "\\mathbfpsi" : "\u{1D74D}",
    "\\mathbfOmega" : "\u{1D6C0}",
    "\\mathbfomega" : "\u{1D74E}",

    // Fraktur
    "\\mathfrakA" : "\u{1D504}",
    "\\mathfraka" : "\u{1D51E}",
    "\\mathfrakB" : "\u{1D505}",
    "\\mathfrakb" : "\u{1D51F}",
    "\\mathfrakC" : "\u212D",
    "\\mathfrakc" : "\u{1D520}",
    "\\mathfrakD" : "\u{1D507}",
    "\\mathfrakd" : "\u{1D521}",
    "\\mathfrakE" : "\u{1D508}",
    "\\mathfrake" : "\u{1D522}",
    "\\mathfrakF" : "\u{1D509}",
    "\\mathfrakf" : "\u{1D523}",
    "\\mathfrakG" : "\u{1D50A}",
    "\\mathfrakg" : "\u{1D524}",
    "\\mathfrakH" : "\u210C",
    "\\mathfrakh" : "\u{1D525}",
    "\\mathfrakI" : "\u2111",
    "\\mathfraki" : "\u{1D526}",
    "\\mathfrakJ" : "\u{1D50D}",
    "\\mathfrakj" : "\u{1D527}",
    "\\mathfrakK" : "\u{1D50E}",
    "\\mathfrakk" : "\u{1D528}",
    "\\mathfrakL" : "\u{1D50F}",
    "\\mathfrakl" : "\u{1D529}",
    "\\mathfrakM" : "\u{1D510}",
    "\\mathfrakm" : "\u{1D52A}",
    "\\mathfrakN" : "\u{1D511}",
    "\\mathfrakn" : "\u{1D52B}",
    "\\mathfrakO" : "\u{1D512}",
    "\\mathfrako" : "\u{1D52C}",
    "\\mathfrakP" : "\u{1D513}",
    "\\mathfrakp" : "\u{1D52D}",
    "\\mathfrakQ" : "\u{1D514}",
    "\\mathfrakq" : "\u{1D52E}",
    "\\mathfrakR" : "\u211C",
    "\\mathfrakr" : "\u{1D52F}",
    "\\mathfrakS" : "\u{1D516}",
    "\\mathfraks" : "\u{1D530}",
    "\\mathfrakT" : "\u{1D517}",
    "\\mathfrakt" : "\u{1D531}",
    "\\mathfrakU" : "\u{1D518}",
    "\\mathfraku" : "\u{1D532}",
    "\\mathfrakV" : "\u{1D519}",
    "\\mathfrakv" : "\u{1D533}",
    "\\mathfrakW" : "\u{1D51A}",
    "\\mathfrakw" : "\u{1D534}",
    "\\mathfrakX" : "\u{1D51B}",
    "\\mathfrakx" : "\u{1D535}",
    "\\mathfrakY" : "\u{1D51C}",
    "\\mathfraky" : "\u{1D536}",
    "\\mathfrakZ" : "\u2128",
    "\\mathfrakz" : "\u{1D537}",

    // Script
    "\\mathcalA" : "\u{1D49C}",
    "\\mathcala" : "\u{1D4B6}",
    "\\mathcalB" : "\u212C",
    "\\mathcalb" : "\u{1D4B7}",
    "\\mathcalC" : "\u{1D49E}",
    "\\mathcalc" : "\u{1D4B8}",
    "\\mathcalD" : "\u{1D49F}",
    "\\mathcald" : "\u{1D4B9}",
    "\\mathcalE" : "\u2130",
    "\\mathcale" : "\u212F",
    "\\mathcalF" : "\u2131",
    "\\mathcalf" : "\u{1D4BB}",
    "\\mathcalG" : "\u{1D4A2}",
    "\\mathcalg" : "\u210A",
    "\\mathcalH" : "\u210B",
    "\\mathcalh" : "\u{1D4BD}",
    "\\mathcalI" : "\u2110",
    "\\mathcali" : "\u{1D4BE}",
    "\\mathcalJ" : "\u{1D4A5}",
    "\\mathcalj" : "\u{1D4BF}",
    "\\mathcalK" : "\u{1D4A6}",
    "\\mathcalk" : "\u{1D4C0}",
    "\\mathcalL" : "\u2112",
    "\\mathcall" : "\u{1D4C1}",
    "\\mathcalM" : "\u2133",
    "\\mathcalm" : "\u{1D4C2}",
    "\\mathcalN" : "\u{1D4A9}",
    "\\mathcaln" : "\u{1D4C3}",
    "\\mathcalO" : "\u{1D4AA}",
    "\\mathcalo" : "\u2134",
    "\\mathcalP" : "\u{1D4AB}",
    "\\mathcalp" : "\u{1D4C5}",
    "\\mathcalQ" : "\u{1D4AC}",
    "\\mathcalq" : "\u{1D4C6}",
    "\\mathcalR" : "\u211B",
    "\\mathcalr" : "\u{1D4C7}",
    "\\mathcalS" : "\u{1D4AE}",
    "\\mathcals" : "\u{1D4C8}",
    "\\mathcalT" : "\u{1D4AF}",
    "\\mathcalt" : "\u{1D4C9}",
    "\\mathcalU" : "\u{1D4B0}",
    "\\mathcalu" : "\u{1D4CA}",
    "\\mathcalV" : "\u{1D4B1}",
    "\\mathcalv" : "\u{1D4CB}",
    "\\mathcalW" : "\u{1D4B2}",
    "\\mathcalw" : "\u{1D4CC}",
    "\\mathcalX" : "\u{1D4B3}",
    "\\mathcalx" : "\u{1D4CD}",
    "\\mathcalY" : "\u{1D4B4}",
    "\\mathcaly" : "\u{1D4CE}",
    "\\mathcalZ" : "\u{1D4B5}",
    "\\mathcalz" : "\u{1D4CF}",

    // For Lewis Notation
    "\\above." : "\u0307",
    "\\below." : "\u0323",
    "\\above:" : "\u0308",
    "\\below:" : "\u0324",
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

    // Non italic letters
    "\\A" : "A",
    "\\À" : "À",
    "\\a" : "a",
    "\\à" : "à",
    "\\B" : "B",
    "\\b" : "b",
    "\\C" : "C",
    "\\Ç" : "Ç",
    "\\c" : "c",
    "\\ç" : "ç",
    "\\D" : "D",
    "\\d" : "d",
    "\\E" : "E",
    "\\É" : "É",
    "\\È" : "È",
    "\\e" : "e",
    "\\é" : "é",
    "\\è" : "è",
    "\\F" : "F",
    "\\f" : "f",
    "\\G" : "G",
    "\\g" : "g",
    "\\H" : "H",
    "\\h" : "h",
    "\\I" : "I",
    "\\i" : "i",
    "\\J" : "J",
    "\\j" : "j",
    "\\K" : "K",
    "\\k" : "k",
    "\\L" : "L",
    "\\l" : "l",
    "\\M" : "M",
    "\\m" : "m",
    "\\N" : "N",
    "\\n" : "n",
    "\\O" : "O",
    "\\o" : "o",
    "\\P" : "P",
    "\\p" : "p",
    "\\Q" : "Q",
    "\\q" : "q",
    "\\R" : "R",
    "\\r" : "r",
    "\\S" : "S",
    "\\s" : "s",
    "\\T" : "T",
    "\\t" : "t",
    "\\U" : "U",
    "\\u" : "u",
    "\\V" : "V",
    "\\v" : "v",
    "\\W" : "W",
    "\\w" : "w",
    "\\X" : "X",
    "\\x" : "x",
    "\\Y" : "Y",
    "\\y" : "y",
    "\\Z" : "Z",
    "\\z" : "z",
    
    // Combining
    "\\overline" : "\u0305",
    "\\underline" : "\u0332",
    "\\ooverline" : "\u035E",
    "\\uunderline" : "\u035F",
    "\\uunderarrow" : "\u0362",
    "\\overfrown" : "\u0361",
    "\\oversmile" : "\u035D",
    "\\undersmile" : "\u035C",
    "\\hat" : "\u0302",
    "\\not" : "\u0338",
    "\\tilde" : "\u0303",
    "\\ttilde" : "\u0360",
    "\\vec" : "\u20D7",
    "\\overinf" : "\u1AB2",  // Only works on certain website/apps
    "\\overring" : "\u030A",
    "\\overcirc" : "\u030A",

    "\\overa" : "\u0363",
    "\\overc" : "\u0368",
    "\\overd" : "\u0369",
    "\\overe" : "\u0364",
    "\\overh" : "\u036A",
    "\\overi" : "\u0365",
    "\\overk" : "\u1DDC",  // Only works on certain website/apps
    "\\overm" : "\u036B",
    "\\overn" : "\u1DE0",  // Only works on certain website/apps
    "\\overo" : "\u0366",
    "\\overr" : "\u036C",
    "\\overt" : "\u036D",
    "\\overu" : "\u0367",
    "\\overv" : "\u036E",
    "\\overx" : "\u036F",

    // Greek subscript and superscript
    "\\^beta" : "\u1D5D",
    "\\^Gamma" : "ᣘ",
    "\\^gamma" : "\u1D5E",
    "\\^Delta" : "ᐞ",
    "\\^delta" : "\u1D5F",
    "\\^epsilon" : "ᵋ",
    "\\^Lambda" : "ᣔ",
    "\\^theta" : "\u1DBF",
    "\\^iota" : "ᶥ",
    "\\^nu" : "ᶹ",
    "\\^sigma" : "ᣙ",
    "\\^phi" : "ᶲ",
    "\\^varphi" : "\u1D60",
    "\\^rho" : "ᣖ",
    "\\^chi" : "\u1D61",

    "\\_beta" : "\u1D66",
    "\\_gamma" : "\u1D67",
    "\\_rho" : "\u1D68",
    "\\_varphi" : "\u1D69",
    "\\_chi" : "\u1D6A",

    "\\^int" : "ᶴ",
    "\\^neq" : "ᙾ",
    "\\^circ" : "°",
    "\\^dollar" : "ᙚ",
    "\\^infty" : "\\: \u1AB2 \\:",  // Only works on certain website/apps
    "\\^emptyset" : "\u{1D1A9}",

    "\\_->" : "\\: \\: \u0362 \\: \\:",
    "\\_rightarrow" : "\\: \\: \u0362 \\: \\:",
    "\\_infty" : "\\: \u035A \\:",

    "\\^" : "^",
    "\\_" : "_",

    // Matrix
    "\\id1" : "[1]",
    "\\id2" : "\u23A1 \\: 1 \\: 0 \\: \u23A4 \u000A \u23A3 \\: 0 \\: 1 \\: \u23A6",
    "\\id3" : "\u23A1 \\: 1 \\: 0 \\: 0 \\: \u23A4 \u000A \u23A2 \\: 0 \\: 1 \\: 0 \\: \u23A5 \u000A \u23A3 \\: 0 \\: 0 \\: 1 \\: \u23A6",
    "\\id4" : "\u23A1 \\: 1 \\: 0 \\: 0 \\: 0 \\: \u23A4 \u000A \u23A2 \\: 0 \\: 1 \\: 0 \\: 0 \\: \u23A5 \u000A \u23A2 \\: 0 \\: 0 \\: 1 \\: 0 \\: \u23A5 \u000A \u23A3 \\: 0 \\: 0 \\: 0 \\: 1 \\: \u23A6",
    "\\idn" : "\u23A1 \\: 1 \\: 0 \\: \u22EF \\: 0 \\: \u23A4 \u000A \u23A2 \\: 0 \\: 1 \\: \u22EF \\: 0 \\: \u23A5 \u000A \u23A2 \\: \\: \u22EE \\: \\: \u22EE \\: \\: \u22F1 \\: \\: \u22EE \\: \u23A5 \u000A \u23A3 \\: 0 \\: 0 \\: \u22EF \\: 1 \\: \u23A6",
    
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
    "\\bullet" : "\u25CF",
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
    "\\llbracket" : "\u27E6",
    "\\rrbracket" : "\u27E7",
    "\\llparenthesis" : "\u2985",
    "\\rrparenthesis" : "\u2986",
    "\\frown" : "\u2322",
    "\\smile" : "\u2323",
    "\\qed" : "\u220E",
    "\\male" : "\u2642",
    "\\female" : "\u2640",
    "\\Hermaphrodite" : "\u26A5",
    "\\neuter" : "\u26B2",
    "\\malemale" : "\u26A3",
    "\\femalefemale" : "\u26A2",
    "\\femalemale" : "\u26A4",
    "\\" : "\\",
    "\\:" : "\\:",  // Space
    "\\;" : "\\: \\:",  // Double space
    "\\colon" : "\u003A",
    "\\\\" : "\u000A",
    "\\linebreak" : "\u000A",
    "\\vskip" : "\u000A\u000A",
    "\\vskip1" : "\u000A\u000A",
    "\\vskip2" : "\u000A\u000A\u000A",
    "\\vskip3" : "\u000A\u000A\u000A\u000A",
    "\\vskip4" : "\u000A\u000A\u000A\u000A\u000A",
    "\\tab" : "\u0009",
    "\\hspace" : "\\:",
    "\\hspace1" : "\\:",
    "\\hspace2" : "\\: \\:",
    "\\hspace3" : "\\: \\: \\:",
    "\\hspace4" : "\\: \\: \\: \\:",
    "\\hspace5" : "\\: \\: \\: \\: \\:",
    "\\hspace6" : "\\: \\: \\: \\: \\: \\:"
};

const lettersSymbols = {
    "+" : "\u002B",
    "-" : "\u2212",
    "=" : "\u003D",
    "'" : "\u2032",
    '"' : "\u2033",
    "/" : "/",
    "\\" : "\\",
    "," : ",",
    "." : ".",
    "°" : "°",
    "|" : "|",
    "!" : "!",
    "?" : "?",
    "$" : "$",
    "@" : "@",
    "&" : "&",
    "(" : "(",
    ")" : ")",
    "{" : "{",
    "}" : "}",
    "[" : "[",
    "]" : "]",
    "<" : "\u003C",
    ">" : "\u003E",
    "^" : "^",
    "_" : "_",
    "%" : "%",
    "#" : "#",
    "~" : "~",
    "¬" : "¬",
    ":" : "\u2236",
    ";" : ";",
    "…" : "…",
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
    "z" : "\u{1D467}"
};

const subscript = {
    "_" : "",
    "{" : "",  // No error if someone uses _{x} instead of _x (aka LaTeX habits)
    "}" : "",
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
    "," : "\\: \u0326 \\:",
    "." : "\\: \u0323 \\:",
    "a" : "\u2090",
    "e" : "\u2091",
    "h" : "\u2095",
    "i" : "\u1D62",
    "j" : "ⱼ",
    "k" : "\u2096",
    "l" : "\u2097",
    "m" : "\u2098",
    "n" : "\u2099",
    "o" : "\u2092",
    "p" : "\u209A",
    "r" : "ᵣ",
    "s" : "\u209B",
    "t" : "\u209C",
    "u" : "ᵤ",
    "v" : "ᵥ",
    "x" : "\u2093",
};

const superscript = {
    "^" : "",
    "{" : "",  // No error if someone uses ^{x} instead of ^x (aka LaTeX habits)
    "}" : "",
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
    "s" : "ˢ",
    "T" : "ᵀ",
    "t" : "ᵗ",
    "U" : "ᵁ",
    "u" : "ᵘ",
    "V" : "ⱽ",
    "v" : "ᵛ",
    "W" : "ᵂ",
    "w" : "ʷ",
    "x" : "ˣ",
    "y" : "ʸ",
    "z" : "ᶻ"
};

const lettersChem = {
    "+" : "\u002B",
    "-" : "\u2212",
    "=" : "\u003D",
    "'" : "\u2032",
    '"' : "\u2033",
    "/" : "/",
    "\\" : "\\",
    "," : ",",
    "." : ".",
    "°" : "°",
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
    "^" : "^",
    "_" : "_",
    "%" : "%",
    "$" : "$",
    "@" : "@",
    "#" : "#",
    "~" : "~",
    "¬" : "¬",
    ":" : ":",  // Same as "\colon", use "\ratio" instead to get the same as without "$chem"
    ";" : ";",
    "…" : "…",
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
    "A" : "A",
    "À" : "À",
    "a" : "a",
    "à" : "à",
    "B" : "B",
    "b" : "b",
    "C" : "C",
    "Ç" : "Ç",
    "c" : "c",
    "ç" : "ç",
    "D" : "D",
    "d" : "d",
    "E" : "E",
    "É" : "É",
    "È" : "È",
    "e" : "e",
    "é" : "é",
    "è" : "è",
    "F" : "F",
    "f" : "f",
    "G" : "G",
    "g" : "g",
    "H" : "H",
    "h" : "h",
    "I" : "I",
    "i" : "i",
    "J" : "J",
    "j" : "j",
    "K" : "K",
    "k" : "k",
    "L" : "L",
    "l" : "l",
    "M" : "M",
    "m" : "m",
    "N" : "N",
    "n" : "n",
    "O" : "O",
    "o" : "o",
    "P" : "P",
    "p" : "p",
    "Q" : "Q",
    "q" : "q",
    "R" : "R",
    "r" : "r",
    "S" : "S",
    "s" : "s",
    "T" : "T",
    "t" : "t",
    "U" : "U",
    "u" : "u",
    "V" : "V",
    "v" : "v",
    "W" : "W",
    "w" : "w",
    "X" : "X",
    "x" : "x",
    "Y" : "Y",
    "y" : "y",
    "Z" : "Z",
    "z" : "z",
};

// Submit button
const submit = document.getElementById("button");
submit.onclick = function() {main()};

// Copy button
const copyButton = document.getElementById("copy");
copyButton.onclick = function() {copyTextOut()};

// Clear button
const resetButton = document.getElementById("reset");
resetButton.onclick = function() {clear()};

// Remove spaces button
const spacesButton = document.getElementById("remove");

// Originally hidden
const suggestionsPopup = document.getElementById("suggestions");

// Every undefined commands
let errorsList = "";




/// FUNCTIONS ///

// Saves the text in the first box so it doesn't disappear if you change page or close MatTalX
window.addEventListener("blur", () => {
    browser.storage.local.set({
        "box1" : document.getElementById("text_in").value,
        "check" : spacesButton.checked
    });
});

// Retreives the text when the popup reopens
window.addEventListener("focus", () => {
    const textIn = document.getElementById("text_in");
    browser.storage.local.get("box1", (text) => {
        if (text.box1 !== undefined) {
            textIn.value = text.box1;
        };
    });
    browser.storage.local.get("check", (button) => {
        // Default is true
        if (button.check === false) {
            spacesButton.checked = false;
        };
    })
    textIn.focus();
});

// Listens for 'message' from background.js
window.addEventListener("DOMContentLoaded", () => {
    const manifest = browser.runtime.getManifest();
    browser.storage.local.get("reason", (details) => {
        if (details.reason === "install") {
            firstMessage(manifest.version);
        } else if (details.reason === "update") {
            updateMessage(manifest.version);
        };
    });
    browser.storage.local.remove("reason");
});

// Message for first time users
function firstMessage(version) {
    // Writes explanation in the two text boxes
    let text = "Welcome to MatTalX version " + version + "! At any moment, you can look at the documentation by putting your mouse above the question mark (?) " + 
    "on the top right corner. MatTalX almost always uses the same command as LaTeX, but there are some differences.";
    let tutorial = "First and foremost, it is important to always separate commands with spaces:\r\n" + 
    " \\alpha_i → error | \\alpha _i → 𝛼ᵢ\r\n \r\n" + 
    "Every letter will automatically be converted to a mathematical font, if you do not want that, you can start your text with '$chem'. " + 
    "If you simply want a single letter to not be in the mathematical font, add '\\' before the letter:\r\n" + 
    " a → \u{1d44e} | \\a → a\r\n \r\n" + 
    "As a last tip, if you get an error and the command seems right, the character that you want might not exist in unicode:\r\n" + 
    " x ^z → \u{1d465}ᶻ | x ^Z → \u{1d465} error (ie z exists in superscript but not Z)\r\n \r\n" +
    "But, before jumping to conclusion, please look at the documentation! The command, for various reason, might be different than in LaTeX!";
    document.text_input.text_in.value = text;
    document.text_input.text_out.value = tutorial;
};

// Message after an update
function updateMessage(version) {
    // Writes explanation in the second box
    // To be changed by hand every version
    let majorChanges = "Welcome to MatTalX version " + version + "\r\n \r\n" + 
    "Major changes: \r\n" +
    "1) Storage bugs fixed";
    // "1) New commands were added, find more about them in the documentation! Simply put your mouse above the question mark (?) to find it.";
    document.text_input.text_out.value = majorChanges;
};

// Listens for Alt+S to show suggestions, Alt+I to copy text of the first box (input) and Alt+O to copy text in the second box (output)
document.addEventListener("keydown", (keyPressed) => {
    const textIn = document.getElementById("text_in");
    // Alt+S to shows suggestions but closes the popup if the suggestion box is already opened
    if ((keyPressed.key === "c") && keyPressed.altKey && (textIn == document.activeElement)) {
        if (suggestionsPopup.style.display !== "inline-block") { 
            suggestionsPopup.textContent = "";
            let word = findWord(textIn.value, (textIn.selectionEnd - 1));
            suggestionsPopup.style.display = "inline-block";
            suggestions(word);
        } else {
            closeSuggestions();
        };
    } else if (((keyPressed.code === "Space") || (keyPressed.code === "Tab")) && (suggestionsPopup.style.display === "inline-block")) {
        closeSuggestions();
    } else if ((keyPressed.key === "i") && keyPressed.altKey) {
        copyTextIn();
    } else if ((keyPressed.key === "o") && keyPressed.altKey) {
        copyTextOut();
    } else {
        // If any key is pressed while the suggestion popup is opened, it adjusts the suggestions
        // The word must be adjusted "by hand" because the eventListener is synchronous
        if (suggestionsPopup.style.display === "inline-block") {
            if (keyPressed.key === "Backspace") {
                suggestionsPopup.textContent = "";
                let word = findWord(textIn.value, textIn.selectionEnd - 1, "Backspace");
                suggestions(word);
            } else if (keyPressed.key.length === 1) {
                suggestionsPopup.textContent = "";
                let word = findWord(textIn.value, textIn.selectionEnd - 1, keyPressed.key);
                suggestions(word);
            } else if ((keyPressed.key === "ArrowUp") || (keyPressed.key === "ArrowRight") || (keyPressed.key === "ArrowLeft") || (keyPressed.key === "ArrowDown")) {
                suggestionsPopup.textContent = "";
                const arrows = {"ArrowUp": 0, "ArrowRight": 1, "ArrowLeft": -1, "ArrowDown": 0};
                let word = findWord(textIn.value, (textIn.selectionEnd - 1 + arrows[keyPressed.key]));  // Only adjusts the cursor position for right and left arrows
                suggestions(word);
            };
        };
    };
});

// Finds the word that is touched by the cursor
function findWord(text, cursorPosition, addedLetter="") {
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
    while ((text.charAt(cursorPosition + 1) !== "") && (text.charAt(cursorPosition + 1) !== " ") && (text.charAt(cursorPosition + 1) !== "\u000A")) {
        cursorPosition += 1;
    };
    while ((text.charAt(cursorPosition) !== "") && (text.charAt(cursorPosition) !== " ") && (text.charAt(cursorPosition) !== "\u000A")) {
        word = text.charAt(cursorPosition) + word;
        cursorPosition -= 1;
    };
    return word;
};

// Outputs list of other commands that are similar to the one currently being written
function suggestions(command) {
    if (command === "") {
        closeSuggestions();
    } else if (command[0] !== "\\") {
        let row = suggestionsPopup.insertRow(-1);
        let cell = row.insertCell(0);
        cell.textContent = "The first character of the command must be a backslash (\\)";
    } else {
        const textIn = document.getElementById("text_in");
        command = command.substring(1, command.length);  // Erases the backslash (for instance, \arrow will also show \rightarrow, etc.)
        for (keys in mathDictionary) {
            // Puts commands in button form, so they can be clicked on to replace the command being written
            if (keys.toLowerCase().indexOf(command.toLowerCase()) !== -1) {
                let row = suggestionsPopup.insertRow(-1);
                let cell = row.insertCell(0);
                let btn = document.createElement("button");
                btn.value = mathDictionary[keys];
                btn.textContent = keys;
                suggestionBtnStyle(btn);
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

// Control the CSS of the buttons in the suggestion box
function suggestionBtnStyle(button) {
    button.style.width = "max-content";
    button.style.minWidth = "130px";
    button.style.height = "17px";
    button.style.backgroundColor = "white";
    button.style.border = "1px solid white";
    button.style.borderRadius = "3px";
    button.type = "button";
};

// Close and empties the suggestion popup
function closeSuggestions() {
    suggestionsPopup.style.display = "none";
    suggestionsPopup.textContent = "";
};

// Replace the command being written by the selected suggestion
function semiAutoCompletion(textIn, cursorPosition, command) {
    let textOut = textIn;
    // Find end of word
    while ((textIn.charAt(cursorPosition) !== " ") && (textIn.charAt(cursorPosition) !== "") && (textIn.charAt(cursorPosition) !== "\u000A")) {
        cursorPosition += 1;
    };
    // Deletes word
    while ((textIn.charAt(cursorPosition - 1) !== " ") && (textIn.charAt(cursorPosition - 1) !== "") && (textIn.charAt(cursorPosition - 1) !== "\u000A")) {
        textOut = textOut.split("");
        textOut[cursorPosition] = "";
        textOut = textOut.join("");
        cursorPosition -= 1;
    };
    // Replace by selected suggestion
    textOut = textOut.split("");
    textOut[cursorPosition] = command;
    textOut = textOut.join("");
    return textOut;
};

// Copy second box (output) to clipboard
function copyTextOut() {
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

// Copy first box (input) to clipboard
function copyTextIn() {
    const textIn = document.getElementById("text_in");
    navigator.clipboard.writeText(textIn.value);
    textIn.style.border = "2px solid black";
    setTimeout(() => {
        textIn.style.border = "1px solid black";
    }, 2500);
};

// Clears everything
function clear() {
    copyButton.value = "Copy text";
    copyButton.style.cursor = "pointer";
    document.getElementById("mistakes").textContent = "";
    document.getElementById("text_out").disabled = true;
    suggestionsPopup.style.display = "none";
    suggestionsPopup.textContent = "";
};

// Remove spaces and add some around "=" and "\implies"
function removeSpace(text) {
    if (spacesButton.checked == true) {
        text = text.replace(/ /g, "");
        text = text.replace(/\=/g, " \= ");
        text = text.replace(/\u2260/g, " \u2260 ");  // not equal ("\neq")
        text = text.replace(/\u27F9/g, " \u27F9 ");  // "\implies" arrow
    };
    return text;
};

// Add spaces ("\:" command)
function spaceCommand(text) {
    text = text.replace(/\\:/g, " ");
    return text;
};

// Takes word and replace letter by letter in the dictionary
function replaceLetters(word, dictionary) {
    let i;
    let newWord = "";
    for (i in word) {
        newWord += word[i].replace(word[i], dictionary[word[i]]);
        mistakes(word, dictionary[word[i]], word[i]);
    };
    return newWord;
};

// Chemistry package
function chemistry(words, newText) {
    let i;
    for (i in words) {
        let firstLetter = words[i].charAt(0);
        if (firstLetter == "\\") {
            newText = newText.replace(words[i], mathDictionary[words[i]]);
            mistakes(words[i], mathDictionary[words[i]]);
        } else if (firstLetter == "_") {
            newText = newText.replace(words[i], replaceLetters(words[i], subscript));
        } else if (firstLetter == "^") {
            newText = newText.replace(words[i], replaceLetters(words[i], superscript));
        } else {
            newText = newText.replace(words[i], replaceLetters(words[i], lettersChem));
        };
    };
    return newText;
};

// Remove spaces and add some around "+" and arrows for the Chemistry package
function adjustSpaceChem(text) {
    if (spacesButton.checked == true) {
        text = text.replace(/ /g, "");
        text = text.replace(/\+/g, " + ");
        text = text.replace(/\u27F6/g, " \u27F6 ");
        text = text.replace(/\u21CC/g, " \u21CC ");
        text = text.replace(/\u21CB/g, " \u21CB ");
        text = text.replace(/\u21C0/g, " \u21C0 ");
        text = text.replace(/\u21C1/g, " \u21C1 ");
        text = text.replace(/\u21BC/g, " \u21BC ");
        text = text.replace(/\u21BD/g, " \u21BD ");
    };
    return text;
};

// Matrix package, converts arrays into a matrix
function matrix(text) {
    text = text.replace(/ /g, "");
    let matrixText = "";
    let i, x;
    let cpt = 0;
    let rceil = 0;
    let lceil = 0;
    let lfloor = 0;
    let rfloor = 0;

    for (x in text) {
        if (text[x] == "[" || text[x] == "]") {
            cpt += 1;
        };
    };
    if (cpt == 2) {
        // vector (ie single line matrix)
        matrixText = text.replace(/ /g, "");
        matrixText = matrixText.replace(/\[/g, "[ ");
        matrixText = matrixText.replace(/\]/g, " ]");
        matrixText = matrixText.replace(/,/g, "\\:");
        return matrixText;
    } else {
        for (i in text) {
            if (text[i] == "[" && rceil == 0) {
                matrixText += "\u23A1 ";
                rceil += 1;
            } else if (text[i] == "]" && lceil == 0) {
                matrixText += " \u23A4\u000A";
                lceil += 1;
            } else if (text[i] == "]") {
                matrixText += " \u23A5\u000A";
            } else if (text[i] == "[") {
                matrixText += "\u23A2 ";
            } else {
                matrixText += text[i];
            }
        };
        for (let n = matrixText.length; n > 0; n--) {
            if (matrixText[n] == "\u23A5" && n > rfloor) {
                matrixText = matrixText.split("");
                matrixText[n] = "\u23A6";
                matrixText[n+1] = "";  // removes "\u000A" since it's the last line
                matrixText = matrixText.join("");
                rfloor = n;
            } else if (matrixText[n] == "\u23A2" && n > lfloor) {
                matrixText = matrixText.split("");
                matrixText[n] = "\u23A3";
                matrixText = matrixText.join("");
                lfloor = n;
            };
        };
    };
    matrixText = matrixCols(matrixText);  // Adjusts columns width
    matrixText = matrixText.replace(/,/g, "\\:");  // Add spaces between characters
    if ((cpt % 2 != 0) || (cpt == 0)) {
        matrixText = "";
        mistakes('Wrong arguments given" \r\n \r\nExample: "$matrix [a,b,c] [d,e,f] [1,2,3]', undefined);
    };
    return matrixText;
};

// Adjusts columns length for $matrix package
function matrixCols(matrix) {
    let positionLength = 0;
    let posLengths = [];
    let matrixPositions = [];
    let matrixPos = 0;
    let realPositions = [];
    for (let i in matrix) {
        if (matrix[i] == ",") {
            matrixPositions.push(matrixPos);
            matrixPos += 1;
            posLengths.push(positionLength);
            positionLength = 0;
            realPositions.push(i-1);
        } else if ((matrix[i] == "\u23A4") || (matrix[i] == "\u23A5") || (matrix[i] == "\u23A6")) {  // right bracket
            matrixPositions.push(matrixPos);
            matrixPos = 0;
            posLengths.push(positionLength);
            positionLength = 0;
            realPositions.push(i-2);
        } else if ((matrix[i] == "\u23A1") || (matrix[i] == "\u23A2") || (matrix[i] == "\u23A3") || (matrix[i] == " ") || (matrix[i] == "\u000A")) {  // left bracket and spaces
            continue;
        } else {
            positionLength += 1;
        };
    };
    // Add spaces to adjust columns length
    let spacesAdded = 1;
    for (let i in posLengths) {
        for (let n in matrixPositions) {
            if (matrixPositions[i] == matrixPositions[n]) {
                matrix = matrix.split("");
                while (posLengths[i] < posLengths[n]) {
                    matrix.splice(realPositions[i] + spacesAdded, 0, " ");
                    posLengths[i] += 1;
                    spacesAdded += 1;
                };
                matrix = matrix.join("");
            };
        };
    };
    return matrix;
};

// Changes "undefined" to "err"
function errors(text) {
    const err = "\u{1D41E}\u0353\u{1D42B}\u0353\u{1D42B}"; // bold "err" with two "x" under it
    text = text.replace(/undefined/g, err);
    return text;
};

// Writes every errors in a box, so it's easier to find them
function mistakes(textInput, textOutput, letter="") {
    const popup = document.getElementById("mistakes");
    popup.setAttribute("style", "white-space: pre;");
    const text = "\u{1D404}\u{1D42B}\u{1D42B}\u{1D428}\u{1D42B}\u{1D42C}: \r\n";  // "Errors" in bold
    if (textOutput === undefined) {
        if (letter != "") {
            errorsList += textInput + " \u2192 " + '"' + letter + '" \r\n';
        } else {
        errorsList += '"' + textInput + '" \r\n';
        };
    };
    if (errorsList.length > 0) {
        popup.textContent = text + errorsList;
        
        popup.style.fontFamily = "Times New Roman";
        popup.style.fontSize = "15px";
    };
};

// Takes text and convert word by word in the dictionary or in function replaceLetters
function convert(words, newText) {
    let i;
    if (words[0] == "$chem") {
        newText = newText.replace("$chem", "");
        newText = chemistry(words, newText);
        newText = adjustSpaceChem(newText);
    } else if (words[0] == "$matrix") {
        newText = newText.replace("$matrix", "");
        newText = matrix(newText);
    } else {
        for (i in words) {
        let firstLetter = words[i].charAt(0);
        if (firstLetter == "\\") {
            newText = newText.replace(words[i], mathDictionary[words[i]]);
            mistakes(words[i], mathDictionary[words[i]]);
        } else if (firstLetter == "_") {
            newText = newText.replace(words[i], replaceLetters(words[i], subscript));
        } else if (firstLetter == "^") {
            newText = newText.replace(words[i], replaceLetters(words[i], superscript));
        } else {
            newText = errors(newText);  // Removes bug ("undefined" with a letter from undefined after)
            newText = newText.replace(words[i], replaceLetters(words[i], lettersSymbols));
        };
    };
    newText = removeSpace(newText);
    };
    newText = errors(newText);
    return newText;
};

// Takes the original text and spits out the new one
function main() {
    document.getElementById("mistakes").textContent = "";  // Starts with an empty box for errors
    errorsList = "";  // Makes sure it starts empty

    let fullText = document.text_input.text_in.value;
    fullText = fullText.replace(/\u000A/g, " "); // Cancels the line skipped by pressing "enter", use "\\" instead
    const words = fullText.split(" ");
    
    fullText = convert(words, fullText);
    fullText = spaceCommand(fullText);
    document.text_input.text_out.value = fullText;
    document.getElementById("text_out").disabled = false;
};

