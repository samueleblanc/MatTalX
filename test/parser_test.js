/* 
    This file gets pasted in MatTalX (by test.sh) to run
    and test the function named replaceText
*/


function test() {
    let time;
    const _parserTest = [
        "Let $A \\in M_{n}(K)$ be a square matrix"
    ];
    const _dict = {...mathDictionary, ...stdGreek, ...lettersMath};
    time = process.hrtime();
    for (let i=0; i<_parserTest.length; i++) {
        console.log(i+1 + ") " + spaceCommand(replaceText(_parserTest[i] + " ", _dict, false)));
    };
    time = process.hrtime(time);
    console.log("\n");
    console.log("Time to parse and convert " + _parserTest.length.toString() + " sentences: " + 
    (time[0] + (time[1]*10e-9)).toString() + "s");
};

test();