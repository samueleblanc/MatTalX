/*
    Builds the exhaustive corpus behind snapshot.json

    Every command MatTalX knows is converted under a few settings combinations, so that
    any change to the parser, the dictionaries or the spacing shows up as a diff.
    Refresh the file with: node test/update-snapshot.js
*/

import { dictionaries } from "../common/core.js";

// Commands whose output isn't the same twice, so they can't be recorded here
// \today gives the current date, and has its own test in parser.test.js
const notDeterministic = ["\\today"];

export const configs = [
    { name: "default",    mathFont: true,  mathMode: true,  adjustSpaces: true  },
    { name: "noMathFont", mathFont: false, mathMode: true,  adjustSpaces: true  },
    { name: "noSpacing",  mathFont: true,  mathMode: true,  adjustSpaces: false },
    { name: "noMathMode", mathFont: true,  mathMode: false, adjustSpaces: true  },
    { name: "customCmds", mathFont: true,  mathMode: true,  adjustSpaces: true, customCommands: [
        { type: "\\newcommand",              newInput: "\\RR",    output: "\\mathbb{R}" },
        { type: "\\renewcommand",            newInput: "\\alpha", output: "\\beta"      },
        { type: "\\DeclareMathOperator",     newInput: "\\Aut",   output: "Aut"         },
        { type: "\\DeclareUnicodeCharacter", newInput: "\\snow",  output: "\\u2744"     },
    ]},
];

export function buildInputs() {
    const inputs = [];
    const add = (s) => { if (s && !inputs.includes(s)) inputs.push(s); };
    const d = dictionaries;

    // A few expressions that exercise the parser rather than a single command
    for (const s of [
        "Let $A \\in M_{mxn}(K)$ be a matrix",
        "$\\sqrt{\\sqrt[3]{\\sqrt[4]{\\cdots\\sqrt[n]{n}}}}$",
        "$\\frac{\\frac{\\frac{1}{2}}{2}}{2}$",
        "$\\mathbb{P}(X \\geq \\alpha) \\leq \\frac{\\mathbb{E}[X]}{\\alpha}$",
        "$\\mathrm{CO}_{2} \\rightarrow \\overset{:}{\\underset{:}{\\mathrm{O}}}$",
        "$x^2 + y_1$ vs $x^{2} + y_{1}$", "$\\sum_i a_i \\leq \\int_0^1 f$",
        "$x^{Y}$ and $x_{ab}$", "$x^{x^x}$", "$x^(x^x)$",
        "$\\begin{matrix} a & b \\\\ c & d \\end{matrix}$",
        "text outside $and inside$ then outside",
        "$\\RR$", "$\\Aut{G}$", "$\\snow$", "$x \\in \\RR$",
    ]) add(s);

    // Every command, called with an argument when it is a function
    for (const dict of [d.mathDictionary, d.stdGreek, d.noStyleGreek]) {
        for (const key of Object.keys(dict)) {
            if (notDeterministic.includes(key)) continue;
            add((typeof dict[key] === "function") ? "$" + key + "{a}$" : "$" + key + "$");
        };
    };
    for (const key of Object.keys(d.Superscript)) add("$x^{" + key + "}$");
    for (const key of Object.keys(d.Subscript))   add("$x_{" + key + "}$");
    for (const key of Object.keys(d.accents))     add("$" + key + "{u}$");
    for (const key of Object.keys(d.textCommands)) {
        if (notDeterministic.includes(key)) continue;
        add(key + "{abc}");
    };
    for (const key of Object.keys(d.lettersMath))  add("$" + key + "$");
    for (const key of Object.keys(d.lettersOutMathMode)) add(key);

    // The same commands again, written the way LaTeX also allows: a space before the
    // argument, or no curly brackets at all
    for (const key of Object.keys(d.mathDictionary)) {
        if (typeof d.mathDictionary[key] !== "function") continue;
        add("$" + key + " {a}$");
        add("$" + key + " a$");
        add("$" + key + "a$");
    };
    for (const key of Object.keys(d.textCommands)) {
        if ((typeof d.textCommands[key] !== "function") || (notDeterministic.includes(key))) continue;
        add(key + " {abc}");
        add(key + " abc");
    };
    for (const s of ["$x^ {2}$", "$x_ {2}$", "$x^ 2$", "$x^ \\alpha$", "$\\sqrt x + y$",
                     "$\\sqrt[3] x$", "$\\frac {1}{2}$", "$\\frac{1} {2}$", "$\\not=$",
                     "$\\oingt {x}$", "$\\mathbf {\\oingt}$", "$a {b}$", "hello {world}"]) add(s);

    return inputs;
};

export function runCorpus(convert) {
    // Returns {configName: [[input, output, errors], ...]}
    const inputs = buildInputs();
    const snapshot = {};
    for (const config of configs) {
        snapshot[config.name] = inputs.map((input) => {
            try {
                const result = convert(input + " ", {
                    mathFont : config.mathFont,
                    mathMode : config.mathMode,
                    adjustSpaces : config.adjustSpaces,
                    customCommands : config.customCommands || []
                });
                return [input, result.text, result.errors];
            } catch (err) {
                // Kept in the snapshot: a crash disappearing is a change too
                return [input, "THREW: " + err.message, "THREW"];
            };
        });
    };
    return snapshot;
};
