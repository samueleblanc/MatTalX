/*
    Parser used for both the main MatTalX program and for settings
*/


import { mathDictionary } from "./unicode/mathsymbols";
import { addSymbol, prohibitedType, mistakes } from "./convert"
import { dict } from "./types";

// MAIN

interface Token {
    math: boolean;
    depth: number;
    symbol: string;
}

function parseInput(fullText: string, plainTextConverter: dict): string {
    let mathmode: boolean = false;
    let d: number = 0;  // depth
    let numberCurly: number = 0;
    let trigger: boolean = false;
    let temporaryBox: string[] = [];
    let outputBox: Token[] = [];
    const parentheses: string[] = ["(", ")"];
    const brackets: string[] = ["[", "]"];
    const commandStoppers: string[] = [" ", ",", "/", "-", "+", "=", "<", ">", "|", "?", "!"];  // parentheses and brackets also stops commands (most of the time)
    const needBackslash: string[] = ["$", "%", "#"];  // inside *and* outside of mathmode

    let i: number;
    for (i=0; i<fullText.length; i++) {
        if (mathmode) {
            if (fullText[i] === "\\") {
                
            };
        } else {
            if (fullText[i] === "\\") {

            };
        };
    };

    return "";
};


// SETTINGS

function parseSettings(fullText: string): string {
    return "";
};