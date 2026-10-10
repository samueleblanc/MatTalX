/*
    Checks that converting inside a message in a page leaves the message alone.

    A page holds its text in a tree: a paragraph, a link, a run in bold, each with its own
    text node. What is converted has to go back into those same nodes, or the fonts, the
    colours, the links and the paragraphs all go with it.

    readTarget() and writePieces() run in the page, so they are given a stand-in for one
    here: only what they ask for is answered.
*/

import test from "node:test";
import assert from "node:assert/strict";
import {
    joinPieces,
    chunkPieces,
    convertPieces,
    whatDiffers,
    changedRuns,
    readTarget,
    writePieces
} from "../common/inline.js";
import { convert } from "../common/core.js";
import { buildInputs } from "./snapshot-cases.js";

const plain = {mathMode: false, mathFont: true, adjustSpaces: true, customCommands: []};
const everything = {...plain, mathMode: true};

// A tree, built by hand. 'display' is what the stylesheet would have said
function text(value) {
    const node = {nodeType: 3, nodeValue: value, parentElement: null};
    Object.defineProperty(node, "parentNode", {get: () => node.parentElement});
    node.splitText = (at) => {
        // The tail becomes a node of its own, right after this one
        const tail = text(node.nodeValue.slice(at));
        node.nodeValue = node.nodeValue.slice(0, at);
        const siblings = node.parentElement.childNodes;
        siblings.splice(siblings.indexOf(node) + 1, 0, tail);
        tail.parentElement = node.parentElement;
        return tail;
    };
    return node;
};
function element(tagName, display, children) {
    const node = {nodeType: 1, tagName: tagName, display: display, childNodes: children,
                  parentElement: null, isContentEditable: true, closest: () => null,
                  dispatched: [], dispatchEvent(event) { node.dispatched.push(event); return true; }};
    node.insertBefore = (child, before) => {
        node.childNodes.splice(node.childNodes.indexOf(before), 0, child);
        child.parentElement = node;
    };
    for (const child of children) {
        child.parentElement = node;
    };
    return node;
};

function inThePage(root, selection = null, {takesInsertText = true} = {}) {
    // Only the handful of things the two functions reach for
    const walk = (node, seen) => {
        for (const child of node.childNodes || []) {
            seen.push(child);
            walk(child, seen);
        };
        return seen;
    };
    const nothing = {rangeCount: 0, isCollapsed: true, placed: null, range: null,
                     removeAllRanges() {}, addRange(range) { nothing.range = range; nothing.placed = range; }};
    const held = (selection) ? selection : nothing;
    global.NodeFilter = {SHOW_ELEMENT: 1, SHOW_TEXT: 4};
    global.Node = {ELEMENT_NODE: 1, TEXT_NODE: 3};
    global.InputEvent = function (type, options) { return {type: type, ...options}; };
    global.Event = function (type, options) { return {type: type, ...options}; };
    global.document = {
        activeElement: root,
        createTreeWalker(from, show) {
            const all = walk(from, []).filter((node) => (
                ((node.nodeType === 1) && (show & 1)) || ((node.nodeType === 3) && (show & 4))
            ));
            let at = -1;
            return {nextNode: () => { at += 1; return (at < all.length) ? all[at] : null; }};
        },
        createRange: () => {
            const range = {};
            range.setStart = (node, at) => { range.node = node; range.at = at; };
            range.setEnd = (node, at) => { range.endNode = node; range.endAt = at; };
            range.collapse = () => {};
            return range;
        },
        createElement: (tagName) => element(tagName.toUpperCase(), "inline", []),
        execCommand(name, _, written) {
            // What the browser does with insertText over the selection, less the tidying
            // up: a newline stays a character here, and an emptied element stays put
            if ((name !== "insertText") || (!takesInsertText)) {
                return false;
            };
            const range = held.range;
            if (range.node === range.endNode) {
                range.node.nodeValue = range.node.nodeValue.slice(0, range.at) + written +
                                       range.node.nodeValue.slice(range.endAt);
            } else {
                const all = walk(root, []).filter((node) => node.nodeType === 3);
                for (let i = all.indexOf(range.node) + 1; i < all.indexOf(range.endNode); i += 1) {
                    all[i].nodeValue = "";
                };
                range.endNode.nodeValue = range.endNode.nodeValue.slice(range.endAt);
                range.node.nodeValue = range.node.nodeValue.slice(0, range.at) + written;
            };
            return true;
        }
    };
    global.window = {
        getComputedStyle: (node) => ({display: node.display || "inline"}),
        getSelection: () => held
    };
    return root;
};

function cursorIn(node, at) {
    // A cursor, and nothing selected. Remembers the last place it was put
    const cursor = {rangeCount: 1, isCollapsed: true, anchorNode: node, anchorOffset: at,
                    placed: null, range: null, removeAllRanges() {},
                    addRange(range) { cursor.range = range; cursor.placed = range; }};
    return cursor;
};

// The tree as it reads now, so a test can say what should and should not have moved
function shownAs(node) {
    if (node.nodeType === 3) {
        return node.nodeValue;
    };
    return "<" + node.tagName + ">" + node.childNodes.map(shownAs).join("") +
           "</" + node.tagName + ">";
};


test("a boundary at a space is a boundary the conversion cannot see", () => {
    // '<b>hello</b> $\\alpha$' -- two nodes, nothing between them to read together
    const pieces = [{text: "hello", apart: false}, {text: " $\\alpha$", apart: false}];
    assert.deepEqual(chunkPieces(pieces, plain), [[0], [1]]);
});

test("maths that runs across two nodes is read as one", () => {
    // '$\\mathbf ' in one node and 'x$' in the next, which is what bolding half of it does
    const pieces = [{text: "$\\mathbf ", apart: false}, {text: "x$", apart: false}];
    assert.deepEqual(chunkPieces(pieces, plain), [[0, 1]]);
});

test("a word cut in two is read as one", () => {
    const pieces = [{text: "$\\al", apart: false}, {text: "pha$", apart: false}];
    assert.deepEqual(chunkPieces(pieces, plain), [[0, 1]]);
});

test("a paragraph is never read together with the next one", () => {
    // An expression cannot start in one paragraph and finish in another, and reading them
    // as one would move the text of the second into the first
    const pieces = [{text: "$\\alpha", apart: false}, {text: "\\beta$", apart: true}];
    assert.deepEqual(chunkPieces(pieces, plain), [[0], [1]]);
});

test("with math mode on the whole line is maths, so the line is read as one", () => {
    const pieces = [{text: "\\alpha ", apart: false}, {text: "\\beta", apart: false}];
    assert.deepEqual(chunkPieces(pieces, everything), [[0, 1]]);
    // But still not across a paragraph
    const across = [{text: "\\alpha", apart: false}, {text: "\\beta", apart: true}];
    assert.deepEqual(chunkPieces(across, everything), [[0], [1]]);
});

test("the pieces read as one text, with a line break where the page shows one", () => {
    const pieces = [{text: "one", apart: false}, {text: "two", apart: true},
                    {text: "three", apart: false}];
    assert.equal(joinPieces(pieces).text, "one\ntwothree");
    assert.deepEqual(joinPieces(pieces).starts, [0, 4, 7]);
});

test("an edit covers what changed, and not the prose around it", () => {
    const pieces = [{index: 0, from: 0, to: 22, text: "the limit is $\\alpha$ ", apart: false},
                    {index: 1, from: 0, to: 15, text: "as in this link", apart: false}];
    const done = convertPieces(pieces, plain);
    assert.equal(done.edits.length, 1);   // The link is not touched
    assert.deepEqual(done.edits[0], {start: {index: 0, at: 13}, end: {index: 0, at: 21}, text: "𝛼"});
    assert.equal(done.flat, "the limit is 𝛼 as in this link");
});

test("what differs is what is left once the shared start and end are taken off", () => {
    assert.deepEqual(whatDiffers("here: $\\alpha$ done", "here: 𝛼 done"), [6, 5]);
    assert.deepEqual(whatDiffers("$\\alpha$", "𝛼"), [0, 0]);
    assert.deepEqual(whatDiffers("same", "same"), [4, 0]);
});

test("nothing to convert gives nothing back, so nothing is written", () => {
    const pieces = [{text: "an ordinary sentence ", apart: false},
                    {text: "with a link in it", apart: false}];
    assert.equal(convertPieces(pieces, plain), null);
});

test("maths across two nodes is one edit, from the first node into the second", () => {
    const pieces = [{index: 0, from: 0, to: 9, text: "$\\mathbf ", apart: false},
                    {index: 1, from: 0, to: 2, text: "x$", apart: false}];
    const done = convertPieces(pieces, plain);
    assert.deepEqual(done.edits, [{start: {index: 0, at: 0}, end: {index: 1, at: 2}, text: "𝒙"}]);
});

test("an edit that ends on a boundary stops in the earlier node", () => {
    // '<b>$\\alpha$</b> and' -- the edit must not reach into ' and'
    const pieces = [{index: 0, from: 0, to: 8, text: "$\\alpha$", apart: false},
                    {index: 1, from: 0, to: 4, text: " and", apart: false}];
    const done = convertPieces(pieces, plain);
    assert.deepEqual(done.edits, [{start: {index: 0, at: 0}, end: {index: 0, at: 8}, text: "𝛼"}]);
});


test("a message is read one text node at a time", () => {
    const link = element("A", "inline", [text("this link")]);
    const root = element("DIV", "block", [
        element("P", "block", [text("the limit is $\\alpha$, see "), link]),
        element("P", "block", [text("and $\\beta$ too")])
    ]);
    inThePage(root);
    const target = readTarget();
    assert.equal(target.kind, "editable");
    assert.equal(target.whole, true);
    assert.deepEqual(target.pieces.map((piece) => piece.text),
        ["the limit is $\\alpha$, see ", "this link", "and $\\beta$ too"]);
    // Only the second paragraph starts a line of its own
    assert.deepEqual(target.pieces.map((piece) => piece.apart), [false, false, true]);
    assert.equal(target.text, "the limit is $\\alpha$, see this link\nand $\\beta$ too");
});

test("converting a message leaves every element where it was", () => {
    const link = element("A", "inline", [text("this link")]);
    const root = element("DIV", "block", [
        element("P", "block", [text("the limit is $\\alpha$, see "), link]),
        element("P", "block", [text("and $\\beta$ too")])
    ]);
    inThePage(root);
    const target = readTarget();
    const done = convertPieces(target.pieces, plain);
    assert.equal(writePieces(target.pieces, done.edits), "page");
    assert.equal(shownAs(root),
        "<DIV><P>the limit is 𝛼, see <A>this link</A></P><P>and 𝛽 too</P></DIV>");
    // The editor is told to look again, once
    // The browser's own editing says so itself, once per edit. Saying it again over the
    // top of that hands the editor a change it has already been told about
    assert.equal(root.dispatched.length, 0);
});

test("a run in bold that carries half the maths is put back in one piece", () => {
    const bold = element("B", "inline", [text("x$")]);
    const root = element("DIV", "block", [
        element("P", "block", [text("here is $\\mathbf "), bold, text(" and more")])
    ]);
    inThePage(root);
    const target = readTarget();
    const done = convertPieces(target.pieces, plain);
    assert.equal(writePieces(target.pieces, done.edits), "page");
    // The bold element is still there, holding nothing, and the text is where it started
    assert.equal(shownAs(root), "<DIV><P>here is 𝒙<B></B> and more</P></DIV>");
});

test("a page that moved is left alone", () => {
    const root = element("DIV", "block", [element("P", "block", [text("$\\alpha$")])]);
    inThePage(root);
    const target = readTarget();
    const done = convertPieces(target.pieces, plain);
    // Something else wrote in the message between reading it and writing to it
    root.childNodes[0].childNodes[0].nodeValue = "something else entirely";
    assert.equal(writePieces(target.pieces, done.edits), "stale");
    assert.equal(shownAs(root), "<DIV><P>something else entirely</P></DIV>");
    assert.equal(root.dispatched.length, 0);
});

test("an editor that keeps its own copy is left to the older way", () => {
    const root = element("DIV", "block", [element("P", "block", [text("$\\alpha$")])]);
    inThePage(root);
    root.closest = (selector) => (selector.includes("ProseMirror")) ? root : null;
    const target = readTarget();
    const done = convertPieces(target.pieces, plain);
    assert.equal(writePieces(target.pieces, done.edits), "");
    assert.equal(shownAs(root), "<DIV><P>$\\alpha$</P></DIV>");
});

test("a <br> is a line of its own, like a paragraph", () => {
    const root = element("DIV", "block", [
        text("$\\alpha"), element("BR", "block", []), text("\\beta$")
    ]);
    inThePage(root);
    const target = readTarget();
    assert.deepEqual(target.pieces.map((piece) => piece.apart), [false, true]);
});

test("what is selected is converted, and the rest of the node is not", () => {
    const held = text("keep $\\alpha$ drop");
    const root = element("DIV", "block", [element("P", "block", [held])]);
    inThePage(root, {
        rangeCount: 1, isCollapsed: false,
        getRangeAt: () => ({startContainer: held, startOffset: 5, endContainer: held,
                            endOffset: 13, intersectsNode: (node) => (node === held)}),
        removeAllRanges() {}, addRange() {}
    });
    const target = readTarget();
    assert.equal(target.whole, false);
    assert.deepEqual(target.pieces.map((piece) => piece.text), ["$\\alpha$"]);
    const done = convertPieces(target.pieces, plain);
    assert.equal(writePieces(target.pieces, done.edits), "page");
    assert.equal(shownAs(root), "<DIV><P>keep 𝛼 drop</P></DIV>");
});

test("a cursor in a paragraph nobody wrote to is not moved", () => {
    // Maths in the first paragraph, the user typing in the third: converting must not
    // send the cursor back up to where the maths was
    const typing = text("and now I am writing here");
    const root = element("DIV", "block", [
        element("P", "block", [text("$\\alpha$")]),
        element("P", "block", [text("some prose")]),
        element("P", "block", [typing])
    ]);
    const cursor = cursorIn(typing, typing.nodeValue.length);
    inThePage(root, cursor);
    const target = readTarget();
    assert.equal(writePieces(target.pieces, convertPieces(target.pieces, plain).edits), "page");
    assert.equal(shownAs(root), "<DIV><P>𝛼</P><P>some prose</P><P>and now I am writing here</P></DIV>");
    assert.equal(cursor.placed.node, typing, "the cursor should be where it was");
    assert.equal(cursor.placed.at, typing.nodeValue.length);
});

test("a cursor at the end of what was converted stays at the end of it", () => {
    // The usual case: the user typed the line and pressed the shortcut
    const typed = text("the limit is $\\alpha_n \\to 0$ so");
    const root = element("DIV", "block", [element("P", "block", [typed])]);
    const cursor = cursorIn(typed, typed.nodeValue.length);
    inThePage(root, cursor);
    const target = readTarget();
    assert.equal(writePieces(target.pieces, convertPieces(target.pieces, plain).edits), "page");
    assert.equal(typed.nodeValue, "the limit is 𝛼ₙ → 0 so");
    assert.equal(cursor.placed.node, typed);
    assert.equal(cursor.placed.at, typed.nodeValue.length);
});

test("a cursor before what was converted does not move either", () => {
    const typed = text("here: $\\alpha$");
    const root = element("DIV", "block", [element("P", "block", [typed])]);
    const cursor = cursorIn(typed, 3);   // In "here"
    inThePage(root, cursor);
    const target = readTarget();
    writePieces(target.pieces, convertPieces(target.pieces, plain).edits);
    assert.equal(cursor.placed.at, 3);
});

test("a cursor inside the maths goes after what it became", () => {
    // Nothing in '𝛼' answers to the third character of '\\alpha'
    const typed = text("here: $\\alpha$ done");
    const root = element("DIV", "block", [element("P", "block", [typed])]);
    const cursor = cursorIn(typed, 9);   // Inside '\\alpha'
    inThePage(root, cursor);
    const target = readTarget();
    writePieces(target.pieces, convertPieces(target.pieces, plain).edits);
    assert.equal(typed.nodeValue, "here: 𝛼 done");
    assert.equal(typed.nodeValue.slice(0, cursor.placed.at), "here: 𝛼");
});

test("a display equation goes on a line of its own", () => {
    // Through the browser's own editing a newline becomes a line break. An editor that
    // refuses that gets a <br> put in by hand, since a newline in a text node shows as
    // nothing at all
    const typed = text("so \\[x^2\\] then");
    const root = element("DIV", "block", [element("P", "block", [typed])]);
    inThePage(root, null, {takesInsertText: false});
    const target = readTarget();
    assert.equal(writePieces(target.pieces, convertPieces(target.pieces, plain).edits), "page");
    assert.equal(shownAs(root), "<DIV><P>so <BR></BR>𝑥²<BR></BR> then</P></DIV>");
    // Writing into the nodes tells the editor nothing, so it is told by hand here
    assert.equal(root.dispatched.length, 1);
    assert.equal(root.dispatched[0].type, "input");
});

test("the cursor is found again by counting, after the browser has rearranged the nodes", () => {
    // The stand-in keeps a newline as a character, so the count grows by the whole text
    const typed = text("so \\[x^2\\] then");
    const root = element("DIV", "block", [element("P", "block", [typed])]);
    const cursor = cursorIn(typed, typed.nodeValue.length);
    inThePage(root, cursor);
    const target = readTarget();
    writePieces(target.pieces, convertPieces(target.pieces, plain).edits);
    assert.equal(typed.nodeValue, "so \n𝑥²\n then");
    assert.equal(cursor.placed.node, typed);
    assert.equal(cursor.placed.at, typed.nodeValue.length);
});

test("the flat text keeps the line breaks between paragraphs", () => {
    // What X, Discord and Messenger are handed to paste. convert() reads a newline the
    // way LaTeX does, as nothing, so the flat text is put together from the chunks
    const pieces = [{index: 0, from: 0, to: 9, text: "$\\alpha$ ", apart: false},
                    {index: 1, from: 0, to: 8, text: "$\\beta$", apart: true}];
    assert.equal(convertPieces(pieces, plain).flat, "𝛼 \n𝛽");
});


test("a line with several expressions gives an edit for each, and none for the prose", () => {
    // The prose between them is the same before and after. Replacing it along with the
    // maths deletes and retypes what the user wrote, which is what left the editor's
    // undo pointing at text that was no longer there
    const line = "Let $x$ be real, so $\\alpha_n \\to 0$ and $\\sum_n a_n$ converges";
    const runs = changedRuns(line, convert(line + " ", plain).text.slice(0, -1));
    assert.deepEqual(runs.map((run) => line.slice(run.from, run.to)),
        ["$x$", "$\\alpha_n \\to 0$", "$\\sum_n a_n$"]);
    assert.deepEqual(runs.map((run) => run.text), ["𝑥", "𝛼ₙ → 0", "∑ₙ𝑎ₙ"]);
});

test("nothing to change gives nothing to do", () => {
    assert.deepEqual(changedRuns("an ordinary sentence", "an ordinary sentence"), []);
    assert.deepEqual(changedRuns("", ""), []);
});

test("a run never holds half of a symbol", () => {
    // '𝛼' and '𝛽' share their first half, so lining the two texts up on what they have
    // in common can stop between the halves of a character
    const runs = changedRuns("$\\alpha$", "𝛼");
    assert.deepEqual(runs, [{from: 0, to: 8, text: "𝛼"}]);
    const held = "𝛼 and 𝛽";
    const acrossHalves = changedRuns(held, "𝛼 and 𝛾");
    // Only the last symbol differs, and the run holds the whole of it
    assert.deepEqual(acrossHalves, [{from: 7, to: 9, text: "𝛾"}]);
    for (const run of acrossHalves) {
        for (const at of [run.from, run.to]) {
            const code = held.charCodeAt(at);   // NaN at the very end, which is no symbol
            assert.ok((at === 0) || (at === held.length) || (code < 0xDC00) || (code > 0xDFFF),
                "a run boundary fell between the two halves of a symbol");
        };
    };
});

test("the edits, put back, give exactly what the conversion gives", () => {
    // Over every command MatTalX knows. The edits are what reaches the page, so what
    // they add up to has to be what convert() said, to the character
    const apply = (before, runs) => {
        let out = "";
        let at = 0;
        for (const run of runs) {
            out += before.slice(at, run.from) + run.text;
            at = run.to;
        };
        return out + before.slice(at);
    };
    let checked = 0;
    for (const input of buildInputs()) {
        const result = convert(input + " ", plain).text;
        const after = (result.endsWith(" ")) ? result.slice(0, -1) : result;
        assert.equal(apply(input, changedRuns(input, after)), after,
            "the edits do not add up for " + JSON.stringify(input));
        checked += 1;
    };
    assert.ok(checked > 1000, "the corpus should be the whole dictionary");
});

test("a run that begins where a node begins takes the whole node with it", () => {
    // Chrome puts text holding a space before the element rather than inside it when it
    // is written over a range that starts exactly where a text node starts: the bold half
    // of an expression lands beside the bold. Replacing the whole node is not caught by
    // that, so a chunk like this is written as one piece
    const bold = "$|x_n - x| < \\epsilon$";
    const alone = [{index: 1, from: 0, to: bold.length, text: bold, apart: false}];
    assert.deepEqual(convertPieces(alone, plain).edits,
        [{start: {index: 1, at: 0}, end: {index: 1, at: bold.length}, text: "|𝑥ₙ − 𝑥| < ϵ"}]);
    // Left alone, the diff would have cut it in two and only written the halves
    assert.equal(changedRuns(bold, "|𝑥ₙ − 𝑥| < ϵ").length, 2);
});

test("a line that starts with prose still gets an edit for each expression", () => {
    // The whole point: the prose between them is not deleted and typed again
    const line = "Let $x$ be real, so $\\alpha_n \\to 0$ and $\\sum_n a_n$ converges";
    const edits = convertPieces(
        [{index: 0, from: 0, to: line.length, text: line, apart: false}], plain).edits;
    assert.deepEqual(edits.map((edit) => [edit.start.at, edit.end.at]),
        [[4, 7], [20, 36], [41, 53]]);
});
