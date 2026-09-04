/*
    Checks what is asked of a page when the user wants a command suggested while writing.

    readCaret() and showCompletion() only make sense in a page, so they are tried in a
    browser instead. What is checked here is everything completeInPage() decides between
    the two: which word the cursor is on, and what the page is given to draw.
*/

import test from "node:test";
import assert from "node:assert/strict";
import { completeInPage } from "../common/inline-completion.js";
import { useStorage } from "../common/settings.js";
import { noBackslash } from "../common/completion.js";

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

// Stands in for the browser: gives completeInPage what the page would have answered,
// and keeps what it was asked to run
function pageWith(caret) {
    const calls = [];
    const inject = async (toRun, args) => {
        calls.push({name: toRun.name, args: args});
        return (toRun.name === "readCaret") ? caret : true;
    };
    return {inject, calls};
};

const writing = (text) => ({editable: true, text: text, caret: text.length});

test.beforeEach(() => useStorage(storageWith()));

test("the page is given the word the cursor is on", async () => {
    const page = pageWith(writing("x + \\alp"));
    await completeInPage(page.inject);
    assert.deepEqual(page.calls.map((call) => call.name), ["readCaret", "showCompletion"]);
    assert.equal(page.calls[1].args[0].word, "\\alp");
});

test("nowhere to write means nothing to complete", async () => {
    const page = pageWith({editable: false, text: "", caret: 0});
    await completeInPage(page.inject);
    assert.deepEqual(page.calls.map((call) => call.name), ["readCaret", "showMessage"]);
    assert.equal(page.calls[1].args[0], "Nothing to complete here");
});

test("a page that answers nothing is left alone", async () => {
    const page = pageWith(undefined);
    await completeInPage(page.inject);
    assert.deepEqual(page.calls.map((call) => call.name), ["readCaret"]);
});

test("the whole list is sent, so the page can narrow it down on its own", async () => {
    // Asking again on every keystroke is what this avoids
    const page = pageWith(writing("\\alp"));
    await completeInPage(page.inject);
    const sent = page.calls[1].args[0].commands;
    assert.ok(sent.length > 600, "expected every command, got " + sent.length);
    assert.ok(sent.some((command) => command.insert === "\\rightarrow"));
    // The page has to say the same thing as the popup when the word has no backslash
    assert.equal(page.calls[1].args[0].noBackslash, noBackslash);
});

test("the commands the user built are sent too", async () => {
    useStorage(storageWith({
        built_commands: [{type: "\\newcommand", newInput: "\\RR", output: "\\mathbb{R}"}]
    }));
    const page = pageWith(writing("\\RR"));
    await completeInPage(page.inject);
    assert.equal(page.calls[1].args[0].commands[0].insert, "\\RR");
});

test("the box follows the colours the user chose", async () => {
    useStorage(storageWith({dark_mode: true}));
    const page = pageWith(writing("\\alp"));
    await completeInPage(page.inject);
    assert.equal(page.calls[1].args[0].dark, true);
});

test("a word without a backslash is still sent, for the page to say so", async () => {
    // The popup shows the same note rather than closing
    const page = pageWith(writing("alpha"));
    await completeInPage(page.inject);
    assert.equal(page.calls[1].args[0].word, "alpha");
});
