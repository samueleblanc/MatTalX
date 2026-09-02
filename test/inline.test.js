/*
    Checks how a conversion asked for inside a page is decided.

    readTarget() and writeBack() only make sense in a page, so they are tried in a browser
    instead. What is checked here is everything convertInPage() decides before and after:
    whether there is anything to convert, which math mode to use, and what is sent back.
*/

import test from "node:test";
import assert from "node:assert/strict";
import { convertInPage, looksLikeLatex } from "../common/inline.js";
import { useStorage } from "../common/settings.js";

function emptyStorage() {
    return {
        get(keys, callback) { callback({}); },
        set(values, callback) { callback && callback(); },
        remove(key, callback) { callback && callback(); }
    };
};

// Stands in for the browser: gives convertInPage what the page would have answered,
// and keeps what it was asked to run
function pageWith(target) {
    const calls = [];
    const inject = async (toRun, args) => {
        calls.push({name: toRun.name, args: args});
        return (toRun.name === "readTarget") ? target : true;
    };
    return {inject, calls};
};

const field = (text) => ({kind: "field", text: text, whole: true});

test.beforeEach(() => useStorage(emptyStorage()));

test("looksLikeLatex only accepts text MatTalX could do something with", () => {
    assert.equal(looksLikeLatex("just plain words"), false);
    assert.equal(looksLikeLatex("\\alpha"), true);
    assert.equal(looksLikeLatex("x^2"), true);
    assert.equal(looksLikeLatex("a_1"), true);
    assert.equal(looksLikeLatex("$x$"), true);
});

test("a field of ordinary words is left alone", async () => {
    const page = pageWith(field("just plain words"));
    await convertInPage(page.inject);
    assert.deepEqual(page.calls.map((c) => c.name), ["readTarget", "showMessage"]);
    assert.equal(page.calls[1].args[0], "Nothing to convert");
});

test("commands on their own are converted, math mode and all", async () => {
    const page = pageWith(field("\\alpha + \\beta"));
    await convertInPage(page.inject);
    assert.equal(page.calls[1].name, "writeBack");
    assert.equal(page.calls[1].args[0], "\u{1D6FC} + \u{1D6FD}");
});

test("text that says where the maths is keeps the rest as prose", async () => {
    // The user writes everything in math mode inside MatTalX, but a message is not all maths
    for (const text of ["The integral $\\int f$ is nice",
                        "Let \\(x^2\\) be nice",
                        "Look: \\[x^2\\] there"]) {
        const page = pageWith(field(text));
        await convertInPage(page.inject);
        assert.equal(page.calls[1].name, "writeBack", text);
        assert.ok(page.calls[1].args[0].includes("nice") || page.calls[1].args[0].includes("there"),
            "the prose should survive in " + JSON.stringify(page.calls[1].args[0]));
    };
});

test("the space the parser needs is not left in the page", async () => {
    const page = pageWith(field("\\alpha"));
    await convertInPage(page.inject);
    assert.equal(page.calls[1].args[0], "\u{1D6FC}");
});

test("nothing is written when the conversion changes nothing", async () => {
    const page = pageWith(field("\\oingt"));
    await convertInPage(page.inject);
    assert.deepEqual(page.calls.map((c) => c.name), ["readTarget", "showMessage"]);
});

test("where the text came from is passed back to the page", async () => {
    const page = pageWith({kind: "editable", text: "\\alpha", whole: false});
    await convertInPage(page.inject);
    assert.deepEqual(page.calls[1].args.slice(1), ["editable", false]);
});

test("a page with nothing selected is not asked to write", async () => {
    const page = pageWith({kind: "clipboard", text: "", whole: false});
    await convertInPage(page.inject);
    assert.deepEqual(page.calls.map((c) => c.name), ["readTarget", "showMessage"]);
});

test("the user's own commands are used inside the page too", async () => {
    useStorage({
        get(keys, callback) {
            callback({built_commands: [{type: "\\newcommand", newInput: "\\RR", output: "\\mathbb{R}"}]});
        },
        set(values, callback) { callback && callback(); },
        remove(key, callback) { callback && callback(); }
    });
    const page = pageWith(field("x \\in \\RR"));
    await convertInPage(page.inject);
    assert.ok(page.calls[1].args[0].includes("ℝ"), page.calls[1].args[0]);
});
