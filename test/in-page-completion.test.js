/*
    Checks the suggestion box that is drawn inside the page

    showCompletion() runs in the page, so it is given a stand-in for one here: enough of a
    document to say what it decides — which commands it keeps, what the arrows move, what
    ends up written in the field — but nothing about how any of it looks. That part is only
    worth trying in a real browser.
*/

import test from "node:test";
import assert from "node:assert/strict";
import { showCompletion } from "../common/inline-completion.js";
import { everyCommand, matching, noBackslash } from "../common/completion.js";

const commands = everyCommand([]);

global.Event = class { constructor(type) { this.type = type; } };

function fakeElement() {
    const node = {
        children: [], style: {}, listeners: {}, text: "",
        get textContent() { return node.text; },
        set textContent(value) { node.text = value; node.children.length = 0; },
        appendChild(child) { node.children.push(child); return child; },
        remove() { node.gone = true; },
        addEventListener(type, fn) { (node.listeners[type] = node.listeners[type] || []).push(fn); },
        removeEventListener(type, fn) {
            node.listeners[type] = (node.listeners[type] || []).filter((f) => f !== fn);
        },
        scrollIntoView() {},
        dispatchEvent(event) {
            for (const fn of (node.listeners[event.type] || [])) fn(event);
            return true;
        },
        getBoundingClientRect: () => ({top: 100, bottom: 120, left: 50, right: 300})
    };
    return node;
};

// A page with one text field in it, and just enough document to draw a box in
function fakePage(value, caret) {
    const field = fakeElement();
    field.tagName = "TEXTAREA";
    field.value = value;
    field.selectionStart = caret;
    field.selectionEnd = caret;
    field.isContentEditable = false;
    field.setSelectionRange = (start, end) => {
        field.selectionStart = start;
        field.selectionEnd = end;
    };

    const body = fakeElement();
    global.document = {
        activeElement: field,
        body: body,
        createElement: () => fakeElement(),
        getElementById: (id) => body.children.find((child) => child.id === id) || null,
        execCommand(name, _, text) {
            if (name !== "insertText") return false;
            field.value = field.value.slice(0, field.selectionStart) + text +
                          field.value.slice(field.selectionEnd);
            field.selectionStart = field.selectionEnd = field.selectionStart + text.length;
            return true;
        }
    };
    // The box listens on the window, so that nothing in the page sees the keys first
    const listeners = {};
    global.window = {
        innerHeight: 800, innerWidth: 1200,
        listeners: listeners,
        addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
        removeEventListener(type, fn) {
            listeners[type] = (listeners[type] || []).filter((f) => f !== fn);
        },
        getSelection: () => null
    };
    return {field, body, listeners};
};

const openBox = (page) => page.body.children.find((child) => child.id === "mattalx-completion");
const shownNow = (page) => openBox(page).children.map((line) => line.textContent);

function press(page, key) {
    // The page writes the letter itself, so a letter is put in the field by hand too
    const field = page.field;
    const seen = {stopped: false};
    for (const listener of [...(page.listeners["keydown"] || [])]) {
        listener({key: key, code: (key === " ") ? "Space" : "Key",
                  preventDefault() { seen.prevented = true; },
                  stopImmediatePropagation() { seen.stopped = true; }});
    };
    page.lastKey = seen;
    if (key === "Backspace") {
        field.value = field.value.slice(0, -1);
        field.selectionStart = field.selectionEnd = field.value.length;
    } else if (key.length === 1) {
        field.value += key;
        field.selectionStart = field.selectionEnd = field.value.length;
    };
    return new Promise((resolve) => setTimeout(resolve, 1));  // draw() waits a tick
};

const open = (page, word) => showCompletion({
    commands: commands, word: word, dark: false, noBackslash: noBackslash
});

test("the box shows what the popup would show for the same word", () => {
    const page = fakePage("\\alp", 4);
    open(page, "\\alp");
    assert.deepEqual(shownNow(page), matching(commands, "\\alp").matches.map((m) => m.label));
});

test("typing narrows the list without asking for it again", async () => {
    const page = fakePage("\\ma", 3);
    open(page, "\\ma");
    const before = shownNow(page).length;
    await press(page, "t");
    const after = shownNow(page);
    assert.ok(after.length < before, "the list should be shorter, was " + before + " now " + after.length);
    assert.deepEqual(after, matching(commands, "\\mat").matches.map((m) => m.label));
});

test("erasing a letter brings the other commands back", async () => {
    const page = fakePage("\\mat", 4);
    open(page, "\\mat");
    await press(page, "Backspace");
    assert.deepEqual(shownNow(page), matching(commands, "\\ma").matches.map((m) => m.label));
});

test("the arrows move down the list and Enter writes what is picked", async () => {
    const page = fakePage("x + \\alp", 8);
    open(page, "\\alp");
    // What is shown is the command and what it gives; what is written is only the command
    const second = matching(commands, "\\alp").matches[1];
    assert.equal(shownNow(page)[1], second.label);
    await press(page, "ArrowDown");
    await press(page, "Enter");
    assert.equal(page.field.value, "x + " + second.insert);
});

test("the command being written is the only thing replaced", async () => {
    const page = fakePage("$\\mathbf{\\alp} + y$", 13);
    open(page, "\\alp");
    const first = matching(commands, "\\alp").matches[0].insert;
    await press(page, "Enter");
    assert.equal(page.field.value, "$\\mathbf{" + first + "} + y$");
});

test("the end of the word is replaced too, wherever the cursor sits in it", async () => {
    // '\alha' with the cursor after '\al': the 'ha' after it goes as well
    const page = fakePage("\\alha", 3);
    open(page, "\\al");
    const first = matching(commands, "\\al").matches[0].insert;
    await press(page, "Enter");
    assert.equal(page.field.value, first);
});

test("a word without a backslash says so instead of suggesting", () => {
    const page = fakePage("alpha", 5);
    open(page, "alpha");
    assert.deepEqual(shownNow(page), [noBackslash]);
});

test("a command that doesn't exist says so rather than showing nothing", () => {
    const page = fakePage("\\zzzz", 5);
    open(page, "\\zzzz");
    assert.equal(shownNow(page).length, 1);
    assert.ok(shownNow(page)[0].includes("\\zzzz"));
});

test("the shortcut closes the box when it is already open", () => {
    const page = fakePage("\\alp", 4);
    open(page, "\\alp");
    assert.ok(openBox(page));
    open(page, "\\alp");
    assert.ok(openBox(page).gone, "the box should have been taken out of the page");
    // And the run that drew it stopped listening, rather than being left behind
    assert.deepEqual(page.listeners["keydown"], []);
});

test("Escape and space both close the box", async () => {
    for (const key of ["Escape", " "]) {
        const page = fakePage("\\alp", 4);
        open(page, "\\alp");
        await press(page, key);
        assert.ok(openBox(page).gone, key + " should close the box");
    };
});

test("nothing is left listening in the page once the box is closed", async () => {
    const page = fakePage("\\alp", 4);
    open(page, "\\alp");
    await press(page, "Escape");
    assert.deepEqual(page.listeners["keydown"], []);
    assert.deepEqual(page.field.listeners["blur"], []);
});

test("the keys the box answers to never reach the page", async () => {
    // Enter used to pick a command and send the post on X at the same time
    for (const key of ["Enter", "ArrowDown", "ArrowUp", "Escape"]) {
        const page = fakePage("\\alp", 4);
        open(page, "\\alp");
        await press(page, key);
        assert.ok(page.lastKey.stopped, key + " should not reach the page");
        assert.ok(page.lastKey.prevented, key + " should not do what the page would do");
    };
});

test("the keys the box does not answer to are left to the page", async () => {
    // Tab moves on, space is a space: the box just gets out of the way
    for (const key of ["Tab", " "]) {
        const page = fakePage("\\alp", 4);
        open(page, "\\alp");
        await press(page, key);
        assert.ok(!page.lastKey.stopped, key + " belongs to the page");
        assert.ok(openBox(page).gone, key + " should close the box");
    };
});

test("a suggestion is written even in an editor that keeps its own copy", async () => {
    // Replacing the word being typed is the same change as typing it, so insertText is
    // what every editor takes. Handing it a paste instead left the word only selected
    const page = fakePage("x + \\alp", 8);
    page.field.isContentEditable = false;
    page.field.closest = () => ({});   // says it is one of those editors
    open(page, "\\alp");
    const first = matching(commands, "\\alp").matches[0].insert;
    await press(page, "Enter");
    assert.equal(page.field.value, "x + " + first);
});

test("a command the user built is written like any other", async () => {
    const own = everyCommand([{type: "\\newcommand", newInput: "\\RR", output: "\\mathbb{R}"}]);
    const page = fakePage("x \\in \\R", 8);
    showCompletion({commands: own, word: "\\R", dark: false, noBackslash: noBackslash});
    await press(page, "Enter");
    assert.equal(page.field.value, "x \\in \\RR");   // theirs comes first, so Enter takes it
});
