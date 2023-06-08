/* 
    This file gets pasted in MatTalX (by test.sh) to run
    and test the functions named tokenize and tokensToText
*/

// v 2.5.7 time approx 0.035s for 10 sentences


function test() {
    const _parserTest = [
        // Sentences to test
        "Let $A \\in M_{mxn}(K)$ be a matrix",
        "$f:\\mathbb{R} \\rightarrow \\mathbb{R} ; x \\mapsto f(x) \\coloneqq x^{2}$",
        "Let $f$ be a function such that $f(x) \\geq 0 \\forall x \\in \\mathbb{Z}$",
        "$\\mathbf{\\mathfrak{abc}}$",
        "curl written as $\\nabla \\times \\mathbf{F}$",
        "$\\sqrt{\\sqrt[3]{\\sqrt[4]{\\cdots\\sqrt[n]{n}}}}$",
        "Bien s\\^{u}r, $\\frac{1}{2}$ est rationnelle. De plus, $\\frac{\\frac{\\frac{1}{2}}{2}}{2}$ l'est aussi.",
        "$n!$ grows fast, but less so than $n \\uparrow\\uparrow\\uparrow n$",
        "\\textbf{Proposition}: Let $a \\in \\mathbb{R}$, then $a \\leq x  \\forall x \\in \\emptyset$",
        "\\textbf{Theorem}: Let $S^{n}$ be a closed ball of an Euclidiean space and $f$ be a continuous function. Then \\\\" + 
        "$\\qquad\\exists f:S^{n} \\rightarrow S^{n}$ such that $f(x_{0}) = x_{0}$",
        "$\\mathbb{P}(X \\geq \\alpha) \\leq \\frac{\\mathbb{E}[X]}{\\alpha}$"
    ];
    const _parserOuts = [
        // Correct output for each sentence
        "Let 𝐴 ∈ 𝑀ₘₓₙ(𝐾) be a matrix ",
        "𝑓∶ℝ → ℝ ; 𝑥 ⟼ 𝑓(𝑥) ≔ 𝑥² ",
        "Let 𝑓 be a function such that 𝑓(𝑥) ≥ 0 ∀ 𝑥 ∈ ℤ ",
        "𝖆𝖇𝖈 ",
        "curl written as ∇ × 𝑭 ",
        "√∛∜(⋯ⁿ√𝑛) ",
        "Bien sûr, ¹∕₂ est rationnelle. De plus, ((¹∕₂/2)/2) l'est aussi. ",
        "𝑛! grows fast, but less so than 𝑛 ↑↑↑ 𝑛 ",
        "𝗣𝗿𝗼𝗽𝗼𝘀𝗶𝘁𝗶𝗼𝗻: Let 𝑎 ∈ ℝ, then 𝑎 ≤ 𝑥  ∀ 𝑥 ∈ ∅ ",
        "𝗧𝗵𝗲𝗼𝗿𝗲𝗺: Let 𝑆ⁿ be a closed ball of an Euclidiean space and 𝑓 be a continuous function. Then \u000A"+
                "    ∃ 𝑓∶𝑆ⁿ → 𝑆ⁿ such that 𝑓(𝑥₀) = 𝑥₀ ",
        "ℙ(𝑋 ≥ 𝛼) ≤ (𝔼[𝑋]/𝛼) "
    ];
    const _dictMM = {...mathDictionary, ...stdGreek, ...lettersMath};
    const _dictOut = {...lettersOutMathMode, ...textCommands, " " : " "};
    let _time;
    let _tokens = [];
    let _texts = [];
    let i;

    // Convert the sentences
    _time = process.hrtime();
    for (i=0; i<_parserTest.length; i++) {
        _tokens.push(tokenize(_parserTest[i] + " ", false));
        _texts.push(tokensToText(_tokens[i], _dictMM, _dictOut, (t) => {return t}));
    };
    _time = process.hrtime(_time);

    console.log("════════════════════════════════════════");
    for (i=0; i<_parserTest.length; i++) {
        console.log("┌─ " + (i+1).toString() + ") " + _parserTest[i]);
        console.log("├┬─ Tokens:");
        console.log("│└─── " + _tokens[i]);
        console.log("├┬─ Convert:");
        console.log("│└─── " + _texts[i]);
        console.log("└──────────────────────────────────────");
    };
    console.log("════════════════════════════════════════");
    console.log("\n");
    console.log("Time to tokenize and convert " + _parserTest.length.toString() + " sentences: " + 
    (_time[0] + (_time[1]*10e-9)).toString() + "s");
    console.log("\n");

    // Actual test
    if (_parserTest.length !== _parserOuts.length || _tokens.length !== _texts.length || _parserTest.length !== _tokens.length) {
        console.log("Missing test");
    } else {
        for (i=0; i<_parserTest.length; i++) {
            if (_texts[i] !== _parserOuts[i]) {
                console.log("Error at sentence " + (i+1).toString());
            };
        };
    };
};

test();