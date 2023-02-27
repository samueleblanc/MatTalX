/* 
    This file gets pasted in MatTalX (by test.sh) to run
    and test the function named replaceText
*/


function test() {
    const _parserTest = [
        "Let $A \\in M_{n}(K)$ be a square matrix",
        "$f:\\mathbb{R} \\rightarrow \\mathbb{R} ; x \\mapsto f(x) \\coloneqq x^{2}$",
        "Let $f$ be a function such that $f(x) \\geq 0 \\forall x \\in \\mathbb{Z}$",
        "$\\mathbf{\\mathfrak{abc}}$",
        "$\\sqrt{\\sqrt[3]{\\sqrt[4]{\\cdots\\sqrt[n]{n}}}}$"
    ];
    const _dict = {...mathDictionary, ...stdGreek, ...lettersMath};
    let time;
    console.log("════════════════════════════════════════");
    time = process.hrtime();
    for (let i=0; i<_parserTest.length; i++) {
        console.log("┌─ " + (i+1).toString() + ") " + _parserTest[i]);
        console.log("├──── " + spaceCommand(replaceText(_parserTest[i] + " ", _dict, false)));
        console.log("└──────────────────────────────────────");
    };
    time = process.hrtime(time);
    console.log("════════════════════════════════════════");
    console.log("\n");
    console.log("Time to parse and convert " + _parserTest.length.toString() + " sentences: " + 
    (time[0] + (time[1]*10e-9)).toString() + "s");
};

test();