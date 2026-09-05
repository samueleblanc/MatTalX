/*
    Checks how a conversion asked for inside a page is decided.

    readTarget() and writeBack() only make sense in a page, so they are tried in a browser
    instead. What is checked here is everything convertInPage() decides before and after:
    what the user's settings say, and what is sent back to the page.
*/

import test from "node:test";
import assert from "node:assert/strict";
import { convertInPage, nothingHappened, resultMessage } from "../common/inline.js";
import { useStorage } from "../common/settings.js";

function storageWith(content = {}) {
    // Behaves like storage.sync and storage.local do in the browser
    const stored = {...content};
    return {
        get(keys, callback) {
            const found = {};
            for (const key of (Array.isArray(keys) ? keys : [keys])) {
                if (key in stored) found[key] = stored[key];
            };
            callback(found);
        },
        set(values, callback) { Object.assign(stored, values); callback && callback(); },
        remove(key, callback) { delete stored[key]; callback && callback(); }
    };
};

// Stands in for the browser: gives convertInPage what the page would have answered,
// and keeps what it was asked to run
function pageWith(target) {
    const calls = [];
    const inject = async (toRun, args) => {
        calls.push({name: toRun.name, args: args});
        if (toRun.name === "readTarget") return target;
        return (toRun.name === "writeBack") ? "page" : true;
    };
    return {inject, calls};
};

const field = (text) => ({kind: "field", text: text, whole: true});

test.beforeEach(() => useStorage(storageWith()));

test("with math mode off, the maths converts and the prose does not", async () => {
    for (const text of ["The integral $\\int f$ is nice",
                        "Let \\(x^2\\) be nice",
                        "Look: \\[x^2\\] there"]) {
        const page = pageWith(field(text));
        await convertInPage(page.inject);
        assert.equal(page.calls[1].name, "writeBack", text);
        const written = page.calls[1].args[0];
        assert.ok(/nice|there/.test(written), "the prose should survive in " + JSON.stringify(written));
        assert.ok(!written.includes("\\"), "the maths should be converted in " + JSON.stringify(written));
    };
});

test("a shortcut that changes nothing says why", async () => {
    // Someone with math mode off who writes a bare command would otherwise think it broke
    const page = pageWith(field("\\alpha + \\beta"));
    await convertInPage(page.inject);
    assert.deepEqual(page.calls.map((c) => c.name), ["readTarget", "showMessage"]);
    assert.equal(page.calls[1].args[0], "Math mode is off, put the maths between $ and $");
});

test("the reason is only about math mode when math mode is the reason", () => {
    assert.equal(nothingHappened("x^2", {mathMode: false}),
        "Math mode is off, put the maths between $ and $");
    // Ordinary words are not a mistake, and neither is text that already has delimiters
    assert.equal(nothingHappened("just plain words", {mathMode: false}), "Nothing to convert");
    assert.equal(nothingHappened("$\\alpha$", {mathMode: false}), "Nothing to convert");
    // With math mode on, math mode is not what stopped it
    assert.equal(nothingHappened("\\alpha", {mathMode: true}), "Nothing to convert");
});

test("a field of ordinary words comes back untouched", async () => {
    // Math mode being off is what keeps them out of a mathematical font
    const page = pageWith(field("just plain words"));
    await convertInPage(page.inject);
    assert.deepEqual(page.calls.map((c) => c.name), ["readTarget", "showMessage"]);
    assert.equal(page.calls[1].args[0], "Nothing to convert");
});

test("with math mode on, a selected word is converted on its own", async () => {
    // The user turns math mode on and selects what they want converted
    useStorage(storageWith({mode: true}));
    const page = pageWith({kind: "field", text: "\\alpha", whole: false});
    await convertInPage(page.inject);
    assert.equal(page.calls[1].name, "writeBack");
    assert.equal(page.calls[1].args[0], "\u{1D6FC}");
});

test("an empty field asks for nothing", async () => {
    const page = pageWith(field("   "));
    await convertInPage(page.inject);
    assert.deepEqual(page.calls.map((c) => c.name), ["readTarget", "showMessage"]);
});

test("the space the parser needs is not left in the page", async () => {
    const page = pageWith(field("$\\alpha$"));
    await convertInPage(page.inject);
    assert.equal(page.calls[1].args[0], "\u{1D6FC}");
});

test("a command that can't be converted is written back as it was typed", async () => {
    const page = pageWith(field("$\\oingt$"));
    await convertInPage(page.inject);
    assert.equal(page.calls[1].name, "writeBack");
    assert.equal(page.calls[1].args[0], "\\oingt");   // the field says which command was wrong
});

test("the page is written to first, and told about it after", async () => {
    const page = pageWith(field("$\\alpha$"));
    await convertInPage(page.inject);
    assert.deepEqual(page.calls.map((c) => c.name), ["readTarget", "writeBack", "showMessage"]);
    assert.equal(page.calls[2].args[0], "Converted");
});

test("the message matches what happened", () => {
    assert.equal(resultMessage("page"), "Converted");
    // Nothing could be written in, so it went to the clipboard and says how to use it
    assert.equal(resultMessage("clipboard"), "Converted, press Ctrl+V to paste it");
    assert.equal(resultMessage(""), "Nothing to convert here");
});

test("where the text came from is passed back to the page", async () => {
    const page = pageWith({kind: "editable", text: "$\\alpha$", whole: false});
    await convertInPage(page.inject);
    assert.deepEqual(page.calls[1].args.slice(1), ["editable", false]);
});

test("a page with nothing selected is not asked to write", async () => {
    const page = pageWith({kind: "clipboard", text: "", whole: false});
    await convertInPage(page.inject);
    assert.deepEqual(page.calls.map((c) => c.name), ["readTarget", "showMessage"]);
});

test("the user's own commands are used inside the page too", async () => {
    useStorage(storageWith({
        built_commands: [{type: "\\newcommand", newInput: "\\RR", output: "\\mathbb{R}"}]
    }));
    const page = pageWith(field("$x \\in \\RR$"));
    await convertInPage(page.inject);
    assert.ok(page.calls[1].args[0].includes("ℝ"), page.calls[1].args[0]);
});

test("the other settings are followed too", async () => {
    useStorage(storageWith({font: false}));
    const page = pageWith(field("$\\alpha x$"));
    await convertInPage(page.inject);
    assert.equal(page.calls[1].args[0], "αx");   // plain alpha, not the mathematical one
});
