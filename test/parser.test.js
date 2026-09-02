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

test("a conversion does not keep the errors of the previous one", () => {
    convert("$\\notacommand$ ", {mathMode: false});
    assert.equal(convert("$\\alpha$ ", {mathMode: false}).errors, "");
});

test("core.js never touches the DOM", () => {
    // Runs in node, so anything reaching for document or window would already have thrown
    assert.equal(typeof globalThis.document, "undefined");
    assert.equal(convert("$x^2$ ", {mathMode: false}).text, "𝑥² ");
});
