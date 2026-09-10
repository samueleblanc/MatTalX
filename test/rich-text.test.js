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
    readTarget,
    writePieces
} from "../common/inline.js";

const plain = {mathMode: false, mathFont: true, adjustSpaces: true, customCommands: []};
const everything = {...plain, mathMode: true};

// A tree, built by hand. 'display' is what the stylesheet would have said
function text(value) {
    return {nodeType: 3, nodeValue: value, parentElement: null};
};
function element(tagName, display, children) {
    const node = {nodeType: 1, tagName: tagName, display: display, childNodes: children,
                  parentElement: null, isContentEditable: true, closest: () => null,
                  dispatched: [], dispatchEvent(event) { node.dispatched.push(event); return true; }};
    for (const child of children) {
        child.parentElement = node;
    };
    return node;
};

function inThePage(root, selection = null) {
    // Only the handful of things the two functions reach for
    const walk = (node, seen) => {
        for (const child of node.childNodes || []) {
            seen.push(child);
            walk(child, seen);
        };
        return seen;
    };
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
        createRange: () => ({setStart() {}, collapse() {}})
    };
    global.window = {
        getComputedStyle: (node) => ({display: node.display || "inline"}),
        getSelection: () => (selection) ? selection :
            {rangeCount: 0, isCollapsed: true, removeAllRanges() {}, addRange() {}}
    };
    return root;
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

test("only the piece that changes is replaced", () => {
    const pieces = [{text: "the limit is $\\alpha$ ", apart: false},
                    {text: "as in this link", apart: false}];
    const replacements = convertPieces(pieces, plain);
    assert.equal(replacements[0], "the limit is 𝛼 ");
    assert.equal(replacements[1], "as in this link");   // Not written, since it is the same
});

test("nothing to convert gives nothing back, so nothing is written", () => {
    const pieces = [{text: "an ordinary sentence ", apart: false},
                    {text: "with a link in it", apart: false}];
    assert.equal(convertPieces(pieces, plain), null);
});

test("maths across two nodes converts into the first of them", () => {
    const pieces = [{text: "$\\mathbf ", apart: false}, {text: "x$", apart: false}];
    const replacements = convertPieces(pieces, plain);
    assert.equal(replacements[0], "𝒙");
    assert.equal(replacements[1], "");
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
    const replacements = convertPieces(target.pieces, plain);
    assert.equal(writePieces(target.pieces, replacements), "page");
    assert.equal(shownAs(root),
        "<DIV><P>the limit is 𝛼, see <A>this link</A></P><P>and 𝛽 too</P></DIV>");
    // The editor is told to look again, once
    assert.equal(root.dispatched.length, 1);
    assert.equal(root.dispatched[0].type, "input");
});

test("a run in bold that carries half the maths is put back in one piece", () => {
    const bold = element("B", "inline", [text("x$")]);
    const root = element("DIV", "block", [
        element("P", "block", [text("here is $\\mathbf "), bold, text(" and more")])
    ]);
    inThePage(root);
    const target = readTarget();
    const replacements = convertPieces(target.pieces, plain);
    assert.equal(writePieces(target.pieces, replacements), "page");
    // The bold element is still there, holding nothing, and the text is where it started
    assert.equal(shownAs(root), "<DIV><P>here is 𝒙<B></B> and more</P></DIV>");
});

test("a page that moved is left alone", () => {
    const root = element("DIV", "block", [element("P", "block", [text("$\\alpha$")])]);
    inThePage(root);
    const target = readTarget();
    const replacements = convertPieces(target.pieces, plain);
    // Something else wrote in the message between reading it and writing to it
    root.childNodes[0].childNodes[0].nodeValue = "something else entirely";
    assert.equal(writePieces(target.pieces, replacements), "stale");
    assert.equal(shownAs(root), "<DIV><P>something else entirely</P></DIV>");
    assert.equal(root.dispatched.length, 0);
});

test("an editor that keeps its own copy is left to the older way", () => {
    const root = element("DIV", "block", [element("P", "block", [text("$\\alpha$")])]);
    inThePage(root);
    root.closest = (selector) => (selector.includes("ProseMirror")) ? root : null;
    const target = readTarget();
    const replacements = convertPieces(target.pieces, plain);
    assert.equal(writePieces(target.pieces, replacements), "");
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
    const replacements = convertPieces(target.pieces, plain);
    assert.equal(writePieces(target.pieces, replacements), "page");
    assert.equal(shownAs(root), "<DIV><P>keep 𝛼 drop</P></DIV>");
});
