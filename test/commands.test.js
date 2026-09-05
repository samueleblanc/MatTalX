/*
    Checks the commands and operators a user can build in the settings box
*/

import test from "node:test";
import assert from "node:assert/strict";
import { convert, buildCommandWithArgs } from "../common/core.js";

// A dictionary small enough that the test only depends on the substitution, not on the symbols
const plainDict = Object.fromEntries("abcuvxy(), ".split("").map((c) => [c, c]));

const withCommands = (customCommands) => (text) =>
    convert(text + " ", {mathMode: false, customCommands}).text;

test("\\newcommand adds a command", () => {
    const run = withCommands([{type: "\\newcommand", newInput: "\\RR", output: "\\mathbb{R}"}]);
    assert.equal(run("$\\RR$"), "ℝ  ");  // The output of a built command keeps a trailing space
});

test("\\newcommand refuses a name that already exists", () => {
    const result = convert("$\\alpha$ ", {mathMode: false,
        customCommands: [{type: "\\newcommand", newInput: "\\alpha", output: "\\beta"}]});
    assert.equal(result.text, "𝛼 ");
    assert.ok(result.errors.includes("already defined"));
});

test("a command the user got wrong is reported every time, not only the first", () => {
    // The dictionary is built once and kept, so what was said while building it has to be
    // said again on the conversions that reuse it
    const settings = {mathMode: false,
        customCommands: [{type: "\\newcommand", newInput: "\\alpha", output: "\\beta"}]};
    for (let time=1; time<=3; time++) {
        assert.ok(convert("$\\alpha$ ", settings).errors.includes("already defined"),
            "nothing was reported on conversion number " + time);
    };
});

test("what the dictionary holds follows the settings, kept or not", () => {
    // Two conversions in a row with different settings must not share a dictionary
    const greek = (mathFont) => convert("$\\alpha$ ", {mathMode: false, mathFont: mathFont}).text;
    assert.equal(greek(true), "\u{1D6FC} ");
    assert.equal(greek(false), "\u03B1 ");
    assert.equal(greek(true), "\u{1D6FC} ");
    const own = (output) => convert("$\\RR$ ", {mathMode: false,
        customCommands: [{type: "\\newcommand", newInput: "\\RR", output: output}]}).text;
    assert.equal(own("\\mathbb{R}"), "ℝ  ");
    assert.equal(own("\\mathbb{Q}"), "ℚ  ");
});

test("\\renewcommand overrides an existing command", () => {
    const run = withCommands([{type: "\\renewcommand", newInput: "\\alpha", output: "\\beta"}]);
    assert.equal(run("$\\alpha$"), "𝛽 ");
});

test("\\DeclareUnicodeCharacter takes a code point", () => {
    const run = withCommands([{type: "\\DeclareUnicodeCharacter", newInput: "\\snow", output: "\\u2744"}]);
    assert.equal(run("$\\snow$"), "❄ ");
});

test("a built command can be used more than once", () => {
    const run = withCommands([{type: "\\newcommand", newInput: "\\RR", output: "\\mathbb{R}"}]);
    assert.equal(run("$\\RR \\times \\RR$"), "ℝ × ℝ ");
});

test("a command with arguments does not keep the arguments of its first use", () => {
    // buildCommandWithArgs used to splice the arguments into the token list it closed over,
    // so every use after the first replayed the first one
    const dbl = buildCommandWithArgs({...plainDict}, 1, "\\dbl", "#1#1 ");
    assert.deepEqual(dbl([["a"]], "\\dbl"), ["aa"]);
    assert.deepEqual(dbl([["b"]], "\\dbl"), ["bb"]);
    assert.deepEqual(dbl([["c"]], "\\dbl"), ["cc"]);

    const pair = buildCommandWithArgs({...plainDict}, 2, "\\pair", "(#1,#2) ");
    assert.deepEqual(pair([["x"], ["y"]], "\\pair"), ["(x,y) "]);
    assert.deepEqual(pair([["u"], ["v"]], "\\pair"), ["(u,v) "]);
});
