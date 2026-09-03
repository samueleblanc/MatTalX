/*
    Checks that converting a text that is already converted leaves it alone.

    Everything MatTalX writes is outside the basic plane, so a symbol like '𝛼' takes two
    places in a string. The parser used to walk those halves rather than characters, which
    cut every symbol in two the second time round.
*/

import test from "node:test";
import assert from "node:assert/strict";
import { convert, dictionaries } from "../common/core.js";
import { cases } from "./cases.js";

const convertOnce = (text, settings) => {
    // The space is what lets the parser finish a last command, and is taken back off
    // afterwards, the same way a conversion inside a page does it
    const result = convert(text + " ", settings).text;
    return (result.endsWith(" ")) ? result.slice(0, -1) : result;
};

const twice = (text, settings) => {
    const once = convertOnce(text, settings);
    return {once, twice: convertOnce(once, settings)};
};

function hasLoneHalf(text) {
    // A symbol cut in two leaves a half that stands for no character at all
    for (const character of text) {
        const point = character.codePointAt(0);
        if ((point >= 0xD800) && (point <= 0xDFFF)) {
            return true;
        };
    };
    return false;
};

test("a symbol is not cut in two by a second conversion", () => {
    for (const mathMode of [true, false]) {
        for (const text of ["Test \\alpha", "$\\alpha$", "\\mathbb{R}", "x^2", "\\sum_i a_i", "\\int_0^1 f"]) {
            const result = twice(text, {mathMode});
            assert.ok(!hasLoneHalf(result.once), "first pass cut a symbol in " + JSON.stringify(text));
            assert.ok(!hasLoneHalf(result.twice), "second pass cut a symbol in " + JSON.stringify(text));
        };
    };
});

test("converting twice gives the same thing as converting once", () => {
    for (const mathMode of [true, false]) {
        for (const text of ["Test \\alpha", "\\alpha+\\beta", "\\mathbb{R} + \\mathbb{Q}",
                            "x^2 + \\alpha", "\\sum_i a_i^2", "$\\alpha$ and $\\beta$",
                            "café — 90%", "\\vec{a}", "\\frac{1}{2}", "\\alpha - \\beta"]) {
            const result = twice(text, {mathMode});
            assert.equal(result.twice, result.once,
                JSON.stringify(text) + " with math mode " + (mathMode ? "on" : "off"));
        };
    };
});

test("every case of cases.js survives a second conversion", () => {
    for (const testCase of cases) {
        const settings = {mathMode: false, ...testCase.settings};
        const again = convert(testCase.out + " ", settings).text;
        assert.ok(!hasLoneHalf(again), "a symbol was cut in " + JSON.stringify(testCase.in));
    };
});

test("a symbol MatTalX wrote is one thing to the parser, not two", () => {
    // Two errors instead of one is how the halves show up when they aren't handled
    const result = convert("\u{1D6FC} ", {mathMode: true});
    const reported = result.errors.split("\r\n").filter((line) => line.length > 0);
    assert.equal(reported.length, 1, "expected one error, got " + JSON.stringify(result.errors));
});

test("converting text that is already converted says nothing out of math mode", () => {
    // It is not a mistake to press the shortcut twice, so it shouldn't read like one
    for (const text of ["\u{1D6FC}", "\u{1D465}²", "ℝ", "Test \u{1D6FC}", "café"]) {
        assert.equal(convert(text + " ", {mathMode: false}).errors, "",
            "nothing should be reported for " + JSON.stringify(text));
    };
});

test("a command that didn't convert is still reported out of math mode", () => {
    // Silencing the characters mustn't silence a command the user got wrong
    assert.ok(convert("\\oingt ", {mathMode: false}).errors.includes("\\oingt"));
});

test("every symbol in the dictionaries survives being converted again", () => {
    // The whole point: what MatTalX writes has to be readable back to MatTalX
    const settings = {mathMode: true};
    let cut = 0;
    for (const key of Object.keys(dictionaries.mathDictionary)) {
        const symbol = dictionaries.mathDictionary[key];
        if (typeof symbol !== "string") {
            continue;
        };
        if (hasLoneHalf(convert(symbol + " ", settings).text)) {
            cut += 1;
        };
    };
    assert.equal(cut, 0, cut + " symbols came back cut in two");
});
