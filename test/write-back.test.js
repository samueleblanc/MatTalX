/*
    Checks how the converted text is put back into the page

    writeBack() runs in the page, so it is given a stand-in for one here. What matters is
    what it decides: whether the text went in, and whether it noticed when it didn't.

    An editor like the one on X keeps its own copy of what it holds. Writing straight into
    the page leaves the two disagreeing, and the editor stops taking anything at all, which
    is what these check against.
*/

import test from "node:test";
import assert from "node:assert/strict";
import { writeBack } from "../common/inline.js";

// Neither of these is a real DOM: only what writeBack asks for is answered
function page({owner = null, takesInsertText = true, takesPaste = false,
               takesValueSet = true, text = "$\\alpha$"}) {
    const copied = {value: null};
    const element = {
        tagName: "DIV",
        innerText: text,
        value: text,
        isContentEditable: (owner !== null),
        focused: false,
        closest: (selector) => ((owner) && (selector.includes(owner))) ? element : null,
        focus() { element.focused = true; },
        setSelectionRange(start, end) { element.start = start; element.end = end; },
        dispatchEvent(event) {
            // A framework editor takes a paste through its own code and rewrites itself
            if ((event.type === "paste") && (takesPaste)) {
                element.innerText = event.clipboardData.getData("text/plain");
            };
            return true;
        }
    };
    const area = {value: "", style: {}, select() {}, remove() {}};
    global.document = {
        activeElement: element,
        body: {appendChild() {}},
        createElement: () => area,
        createRange: () => ({selectNodeContents() {}}),
        execCommand(name, _, written) {
            if (name === "copy") { copied.value = area.value; return true; };
            if ((name === "insertText") && (takesInsertText)) {
                element.innerText = written;
                element.value = written;
                return true;
            };
            return false;
        }
    };
    const held = {range: {name: "what the user had selected"}, rangeCount: 1};
    const selection = {
        get rangeCount() { return held.rangeCount; },
        getRangeAt: () => ({cloneRange: () => held.range}),
        removeAllRanges() { held.rangeCount = 0; held.range = null; },
        addRange(range) { held.rangeCount = 1; held.range = range; }
    };
    const prototype = {};
    Object.defineProperty(prototype, "value", {
        set(written) { if (takesValueSet) element.value = written; },
        get() { return element.value; },
        configurable: true
    });
    global.window = {
        getSelection: () => selection,
        HTMLTextAreaElement: {prototype: prototype},
        HTMLInputElement: {prototype: prototype}
    };
    element.held = held;
    global.DataTransfer = class {
        constructor() { this.held = {}; };
        setData(type, value) { this.held[type] = value; };
        getData(type) { return this.held[type]; };
    };
    global.ClipboardEvent = class {
        constructor(type, options) { this.type = type; this.clipboardData = options.clipboardData; };
    };
    global.Event = class { constructor(type) { this.type = type; } };
    return {element, copied};
};

test("an ordinary field is written into", () => {
    const there = page({});
    assert.equal(writeBack("𝛼", "field", true), "page");
    assert.equal(there.element.value, "𝛼");
    assert.equal(there.copied.value, null, "the clipboard should not have been touched");
});

test("an editor that keeps its own copy is handed a paste, not a write", () => {
    // X and Discord: the paste is a change they make themselves, so they stay in step
    const there = page({owner: "[data-lexical-editor]", takesPaste: true, takesInsertText: false});
    assert.equal(writeBack("𝛼", "editable", true), "page");
    assert.equal(there.element.innerText, "𝛼");
});

test("an editor that ignores the paste is left alone and the text is copied", () => {
    // Nothing happened to the page, which is the safe way to be wrong: writing into it
    // is what left the editor stuck
    const there = page({owner: ".ProseMirror", takesPaste: false, takesInsertText: false});
    assert.equal(writeBack("𝛼", "editable", true), "clipboard");
    assert.equal(there.element.innerText, "$\\alpha$", "the page should not have been touched");
    assert.equal(there.copied.value, "𝛼");
});

test("the cursor is given back after copying, so Ctrl+V lands where it should", () => {
    const there = page({owner: ".public-DraftEditor-content", takesPaste: false, takesInsertText: false});
    writeBack("𝛼", "editable", true);
    assert.ok(there.element.focused, "the field should have been focused again");
});

test("a write that silently does nothing is noticed", () => {
    // execCommand said it worked, but the page says otherwise
    const there = page({});
    document.execCommand = (name) => {
        if (name === "copy") { there.copied.value = "𝛼"; return true; };
        return true;   // insertText says it worked without writing anything
    };
    assert.equal(writeBack("𝛼", "field", true), "clipboard");
});

test("every editor MatTalX knows about is recognised", () => {
    for (const marker of ["[data-lexical-editor]", "[data-slate-editor]", ".ProseMirror",
                          ".public-DraftEditor-content", "[data-contents]", ".cm-content", ".ql-editor"]) {
        const there = page({owner: marker, takesPaste: true, takesInsertText: false});
        assert.equal(writeBack("𝛼", "editable", true), "page", marker + " was not recognised");
        assert.equal(there.element.innerText, "𝛼", marker);
    };
});

test("nothing editable means the text goes to the clipboard", () => {
    const there = page({});
    assert.equal(writeBack("𝛼", "clipboard", false), "clipboard");
    assert.equal(there.copied.value, "𝛼");
});

test("what the user selected is still selected after copying", () => {
    // They asked for part of it to be converted, so Ctrl+V has to land on that part
    const there = page({owner: ".ProseMirror", takesPaste: false, takesInsertText: false});
    assert.equal(writeBack("𝛼", "editable", false), "clipboard");
    assert.equal(there.element.held.rangeCount, 1, "nothing is selected any more");
    assert.equal(there.element.held.range.name, "what the user had selected");
});

test("converting the whole thing leaves the whole thing selected", () => {
    // Ctrl+V then puts the answer in its place, rather than after it
    const there = page({owner: ".ProseMirror", takesPaste: false, takesInsertText: false});
    assert.equal(writeBack("𝛼", "editable", true), "clipboard");
    assert.equal(there.element.held.rangeCount, 1, "nothing is selected any more");
});

test("a field that refuses every write keeps what was selected in it", () => {
    const there = page({takesInsertText: false, takesValueSet: false});
    there.element.tagName = "TEXTAREA";
    there.element.selectionStart = 4;
    there.element.selectionEnd = 9;
    assert.equal(writeBack("𝛼", "field", false), "clipboard");
    assert.equal(there.element.start, 4, "the selection should be back where it was");
    assert.equal(there.element.end, 9);
});
