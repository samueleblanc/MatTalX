/* 
    This file gets pasted in MatTalX (by test.sh) to run
    and test the functions named tokenize and tokensToText
*/


function test() {
    const _parserTest = [
        "Let $A \\in M_{n}(K)$ be a square matrix",
        "$f:\\mathbb{R} \\rightarrow \\mathbb{R} ; x \\mapsto f(x) \\coloneqq x^{2}$",
        "Let $f$ be a function such that $f(x) \\geq 0 \\forall x \\in \\mathbb{Z}$",
        "$\\mathbf{\\mathfrak{abc}}$",
        "curl written as $\\nabla \\times \\mathbf{F}$",
        "$\\sqrt{\\sqrt[3]{\\sqrt[4]{\\cdots\\sqrt[n]{n}}}}$",
        "Bien s\\^{u}r, $\\frac{1}{2}$ est rationnelle. De plus, $\\frac{\\frac{\\frac{1}{2}}{2}}{2}$ l'est aussi.",
        "$n!$ grows fast, but less so than $n \\uparrow\\uparrow\\uparrow n$",
        "\\textbf{Proposition}: Let $a \\in \\mathbb{R}$, then $a \\leq x  \\forall x \\in \\emptyset$",
        "\\textbf{Theorem}: Let $S^{n}$ be a closed ball of an Euclidiean space and $f$ be a continuous function. Then \\\\" + 
        "      $\\exists f:S^{n} \\rightarrow S^{n}$ such that $f(x_{0}) = x_{0}$"
    ];
    const _dictMM = {...mathDictionary, ...stdGreek, ...lettersMath};
    const _dictOut = {...lettersOutMathMode, ...textCommands, " " : " "};
    let _time;
    let _token;
    console.log("════════════════════════════════════════");
    _time = process.hrtime();
    for (let i=0; i<_parserTest.length; i++) {
        _token = tokenize(_parserTest[i] + " ", false);
        console.log("┌─ " + (i+1).toString() + ") " + _parserTest[i]);
        console.log("├┬─ Tokens:");
        console.log("│└─── " + _token);
        console.log("├┬─ Convert:");
        console.log("│└─── " + tokensToText(_token, _dictMM, _dictOut, (t) => {return t}));
        console.log("└──────────────────────────────────────");
    };
    _time = process.hrtime(_time);
    console.log("════════════════════════════════════════");
    console.log("\n");
    console.log("Time to tokenize and convert " + _parserTest.length.toString() + " sentences: " + 
    (_time[0] + (_time[1]*10e-9)).toString() + "s");
};

test();