/*
    Checks that MatTalX converts the cases of cases.js the way it should
*/

import test from "node:test";
import assert from "node:assert/strict";
import { convert } from "../common/core.js";
import { cases } from "./cases.js";

test("conversion cases", async (t) => {
    for (const testCase of cases) {
        await t.test(testCase.in, () => {
            const result = convert(testCase.in + " ", {mathMode: false, ...testCase.settings});
            assert.equal(result.text, testCase.out);
        });
    };
});

test("errors are returned instead of written to a box", () => {
    assert.equal(convert("$x \\in \\mathbb{R}$ ", {mathMode: false}).errors, "");
    assert.ok(convert("$\\notacommand$ ", {mathMode: false}).errors.includes("\\notacommand"));
});

test("a command that can't be converted is still reported, not only shown", () => {
    // The output shows the command, but the box under it must still say what went wrong
    const result = convert("$\\oingt$ ", {mathMode: false});
    assert.equal(result.text, "\\oingt ");
    assert.ok(result.errors.includes("\\oingt"));
});

test("a failing argument keeps the command around it, in the output and in the errors", () => {
    const result = convert("$\\mathbf{\\oingt}$ ", {mathMode: false});
    assert.equal(result.text, "\\mathbf{\\oingt} ");
    assert.ok(result.errors.includes("\"\\oingt\""), "the command itself must be reported");
    assert.ok(result.errors.includes("\\mathbf{\\oingt}"), "the whole command must be reported too");
});

test("nothing that failed leaks the internal mark into the output", () => {
    for (const text of ["$\\oingt$ ", "$\\mathbf{\\oingt}$ ", "$\\hspace{a}$ ", "café ", "$\\frac{1}$ "]) {
        const result = convert(text, {mathMode: false});
        assert.ok(!result.text.includes("\uE000"), "a mark survived in " + JSON.stringify(result.text));
        assert.ok(!result.errors.includes("\uE000"), "a mark survived in the errors of " + JSON.stringify(text));
    };
});

test("a conversion does not keep the errors of the previous one", () => {
    convert("$\\notacommand$ ", {mathMode: false});
    assert.equal(convert("$\\alpha$ ", {mathMode: false}).errors, "");
});

test("\\today gives today's date", () => {
    // Kept out of the snapshot, since its output changes every day
    const result = convert("\\today ", {mathMode: false});
    assert.match(result.text, /^[A-Z][a-z]+ \d{1,2}, \d{4} $/);
    assert.ok(result.text.includes(String(new Date().getFullYear())));
    assert.equal(result.errors, "");
});

test("math mode left open is still reported", () => {
    // The text is converted as if math mode had been closed, but the user is told about it
    const result = convert("an integral $\\int f(x)dx for fun ", {mathMode: false});
    assert.ok(result.text.includes("\u222b"), "the integral must still be converted");
    assert.ok(result.errors.includes("Math mode was not closed"));
});

test("core.js never touches the DOM", () => {
    // Runs in node, so anything reaching for document or window would already have thrown
    assert.equal(typeof globalThis.document, "undefined");
    assert.equal(convert("$x^2$ ", {mathMode: false}).text, "𝑥² ");
});
