/*
    Parser used for both the main MatTalX program and for settings
*/


import { dict } from "./types";


// MAIN

interface Token {
    command: string;  // stores the command
    mathmode: boolean;  // true if inside $ $, $$ $$, or \[ \]
    depth: number;  // is used to know if the symbol is an argument or not
    /*
        depth structure:
            - parseInput: \0{\1{\2{\3{...}}}}
            - parseSetting: \0[1]{2}
    */
};

function parseInput(fullText: string, plainTextConverter: dict): [Token[], number, boolean] {
    // Loops on letters and convert the input into characters
    let mm: boolean = false;  // mathmode
    let d: number = 0;  // depth
    let trigger: boolean = false;  // true if a command has begun (e.g. input: '\' -> true)
    let temporaryBox: string[] = [];  // Stores characters that are in command (e.g. \int -> ['\', 'i', 'n', 't'])
    let outputBox: Token[] = [];
    let mathmodeStarter: string = "";  // ex: if mathmode is started with $$, then "$$" will be mathmodeStarter
    const parentheses: string[] = ["(", ")"];
    const brackets: string[] = ["[", "]"];
    const commandStoppers: string[] = [" ", ",", "/", "-", "+", "=", "<", ">", "|", "?", "!"];  // parentheses and brackets also stops commands (most of the time)
    const needBackslash: string[] = ["$", "%", "#"];  // inside *and* outside of mathmode
    
    let t: Token;

    let i: number;
    for (i=0; i<fullText.length; i++) {
        if (mm) {
            if (trigger) {
                if ((fullText[i] === "\\") || (fullText[i] === "^") || (fullText[i] === "_")) {
                    if (fullText[i-1] === "\\") {
                        t = {command: "\\" + fullText[i], mathmode: mm, depth: d};
                        outputBox.push(t);
                        temporaryBox = [];
                        trigger = false;
                    } else {
                        t = {command: temporaryBox.join(""), mathmode: mm, depth: d};
                        outputBox.push(t);
                        temporaryBox = [fullText[i]];
                    };
                } else if (commandStoppers.includes(fullText[i]) || parentheses.includes(fullText[i])) {
                    if (fullText[i-1] === "\\") {
                        t = {command: fullText[i], mathmode: mm, depth: d};
                        outputBox.push(t);
                    } else {
                        t = {command: temporaryBox.join(""), mathmode: mm, depth: d};
                        outputBox.push(t);
                        t = {command: fullText[i], mathmode: mm, depth: d};
                        outputBox.push(t);
                    };
                    temporaryBox = [];
                    trigger = false;
                } else if (brackets.includes(fullText[i])) {
                    if (temporaryBox.join("").slice(0,5) === "\\sqrt") {
                        temporaryBox.push(fullText[i]);
                    } else {
                        if (fullText[i-1] === "\\") {
                            if (fullText[i] === "]") {
                                if (mathmodeStarter === "\\[") {
                                    t = {command: "\\\\", mathmode: mm, depth: d};
                                    outputBox.push(t);
                                    mm = false;
                                } else {
                                    t = {command: fullText[i], mathmode: mm, depth: d};
                                    outputBox.push(t);
                                };
                            } else {
                                t = {command: fullText[i], mathmode: mm, depth: d};
                                outputBox.push(t);
                            };
                        } else {
                            t = {command: temporaryBox.join(""), mathmode: mm, depth: d};
                            outputBox.push(t);
                            t = {command: fullText[i], mathmode: mm, depth: d};
                            outputBox.push(t);
                        };
                        temporaryBox = [];
                        trigger = false;
                    };
                } else if (fullText[i] === "{") {
                    if (temporaryBox.join("").slice(0,5) === "\\frac") {
                        temporaryBox.push("{");
                        d += 1;
                    } else {
                        if (fullText[i-1] === "\\") {
                            t = {command: fullText[i], mathmode: mm, depth: d};
                            outputBox.push(t);
                            temporaryBox = [];
                            trigger = false;
                        } else {
                            t = {command: temporaryBox.join(""), mathmode: mm, depth: d};
                            outputBox.push(t);
                            temporaryBox = [];
                            trigger = false;
                            d += 1;
                        };
                    };
                } else if (fullText[i] === "}") {
                    if (temporaryBox.join("").slice(0,5) === "\\frac") {
                        if (temporaryBox.includes("}")) {
                            t = {command: temporaryBox.join("").slice(0,temporaryBox.indexOf("{")), mathmode: mm, depth: d-1};
                            outputBox.push(t);
                            t = {command: temporaryBox.join("").slice(temporaryBox.indexOf("{")), mathmode: mm, depth: d};
                            outputBox.push(t);
                            temporaryBox = [];
                            trigger = false;
                        } else {
                            temporaryBox.push(fullText[i]);
                        };
                        d -= 1;
                    } else {
                        if (fullText[i-1] === "\\") {
                            t = {command: fullText[i], mathmode: mm, depth: d};
                            outputBox.push(t);
                        } else {
                            t = {command: temporaryBox.join(""), mathmode: mm, depth: d};
                            outputBox.push(t);
                            d -= 1;
                        };
                        temporaryBox = [];
                        trigger = false;
                    };
                } else {
                    temporaryBox.push(fullText[i]);
                };
            } else {
                if ((fullText[i] === "\\") || (fullText[i] === "^") || (fullText[i] === "_")) {
                    temporaryBox.push(fullText[i]);
                    trigger = true;
                } else if (fullText[i] === "$") {
                    if (fullText[i-1] === "$") {
                        if (mathmodeStarter === "$") {
                            t = {command: "\\\\", mathmode: mm, depth: d};
                            outputBox.push(t);
                            mathmodeStarter = "$$";
                        } else if (mathmodeStarter === "$$") {
                            t = {command: "\\\\", mathmode: mm, depth: d};
                            outputBox.push(t);
                            mathmodeStarter = "";
                            mm = false;
                        };
                    } else {
                        t = {command: fullText[i], mathmode: mm, depth: d};
                        outputBox.push(t);
                    };
                } else {
                    t = {command: fullText[i], mathmode: mm, depth: d};
                    outputBox.push(t);
                };
            };
        } else {
            if (trigger) {
                if (fullText[i] === "[") {
                    if (fullText[i-1] === "\\") {
                        t = {command: "\\\\", mathmode: mm, depth: d};
                        outputBox.push(t);
                        temporaryBox = [];
                        mathmodeStarter = "\\[";
                        mm = true;
                    } else {
                        t = {command: temporaryBox.join(""), mathmode: mm, depth: d};
                        outputBox.push(t);
                        t = {command: fullText[i], mathmode: mm, depth: d};
                        outputBox.push(t);
                    };
                    trigger = false;
                } else if (fullText[i] === "$") {
                    if (fullText[i-1] === "\\") {
                        t = {command: fullText[i], mathmode: mm, depth: d};
                        outputBox.push(t);
                    } else {
                        t = {command: temporaryBox.join(""), mathmode: mm, depth: d};
                        outputBox.push(t);
                        t = {command: fullText[i], mathmode: mm, depth: d};
                        outputBox.push(t);
                    };
                    temporaryBox = [];
                    trigger = false;
                } else if (commandStoppers.includes(fullText[i]) || parentheses.includes(fullText[i]) || (fullText[i] === "]")) {
                    t = {command: temporaryBox.join(""), mathmode: mm, depth: d};
                    outputBox.push(t);
                    temporaryBox = [fullText[i]];
                    trigger = false;
                } else {
                    temporaryBox.push(fullText[i]);
                };
            } else {
                if (fullText[i] === "$") {
                    mathmodeStarter = fullText[i];
                    mm = true;
                } else if (fullText[i] === "\\") {
                    temporaryBox.push(fullText[i]);
                    trigger = true;
                } else {
                    t = {command: fullText[i], mathmode: mm, depth: d};
                    outputBox.push(t);
                };
            };
        };
    };
    return [outputBox, d, mm];
};



// SETTINGS

function parseSettings(fullText: string): [Token[], number] {
    let d: number = 0;
    let temporaryBox: string[] = [];
    let outputBox: Token[] = [];
    let trigger: boolean = false;

    let t: Token;

    let i: number;
    for (i=0; i<fullText.length; i++) {
        if (trigger) {
            if (fullText[i] === "[") {
                t = {command: temporaryBox.join(""), mathmode: false, depth: d};
                outputBox.push(t);
                temporaryBox = [];
                d = 1;
            } else if (fullText[i] === "]") {
                t = {command: temporaryBox.join(""), mathmode: false, depth: d};
                outputBox.push(t);
                temporaryBox = [];
                d = 0;
            } else if (fullText[i] === "{") {
                if (temporaryBox.join("").slice(0,13) === "\\renewcommand") {
                    if (d === 2) {
                        temporaryBox.push(fullText[i]);
                    } else {
                        t = {command: temporaryBox.join(""), mathmode: false, depth: d};
                        outputBox.push(t);
                        temporaryBox = [];
                        d = 2;
                    };
                } else {
                    t = {command: temporaryBox.join(""), mathmode: false, depth: d};
                    outputBox.push(t);
                    temporaryBox = [];
                    d = 2;
                };
            } else if (fullText[i] === "}") {
                if (temporaryBox.join("").slice(0,13) === "\\renewcommand") {
                    if (temporaryBox.indexOf("}") === -1) {
                        temporaryBox.push(fullText[i]);
                    } else {
                        t = {command: temporaryBox.join(""), mathmode: false, depth: d};
                        outputBox.push(t);
                        temporaryBox = [];
                        trigger = false;
                        d = 0;
                    };
                } else {
                    t = {command: temporaryBox.join(""), mathmode: false, depth: d};
                    outputBox.push(t);
                    temporaryBox = [];
                    trigger = false;
                    d = 0;
                };
            } else if (fullText[i] === "%") {
                if (fullText[i-1] === "\\") {
                    t = {command: temporaryBox.join(""), mathmode: false, depth: d};
                    outputBox.push(t);
                    temporaryBox = [];
                } else {
                    break;
                }
            } else {
                temporaryBox.push(fullText[i]);
            };
        } else {
            if (fullText[i] === "\\") {
                temporaryBox.push(fullText[i]);
                trigger = true;
            } else if (fullText[i] === "%") {
                break;
            } else {
                t = {command: fullText[i], mathmode: false, depth: d};
                outputBox.push(t);
            };
        };
    };
    return [outputBox, d];
};


export { parseInput, parseSettings };