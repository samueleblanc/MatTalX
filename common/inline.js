/*
    Converting what the user wrote directly in the page, without opening MatTalX.

    background.js calls convertInPage() when the shortcut is pressed. The conversion itself
    stays here, in the extension: readTarget() and the ones after it are sent to the page as
    text and run there, so they can only use what is written inside them. That is why they
    repeat a few things instead of calling a helper.

    A message in a page is a tree rather than a line: paragraphs, links, bold runs, each
    holding its own text. Reading it as one line and writing that line back is what used to
    throw all of that away, so what is editable is read and written one text node at a time,
    and the nodes an expression runs across are the only ones read together.
*/

"use strict";

import { convert, mathSpans } from "./core.js";
import { loadSettings, conversionSettings } from "./settings.js";

export async function convertInPage(inject) {
    // 'inject' runs one of the functions below in the page and gives back what it returned
    // Each browser passes it along differently, which is all background.js has to know
    const target = await inject(readTarget, []);
    if (!target) {
        return;
    };
    if (!target.text.trim()) {
        await inject(showMessage, ["Nothing to convert"]);
        return;
    };

    // The user's settings decide, here as in the popup. With math mode off, which is how it
    // starts, only what is between '$', '\(' or '\[' is converted and the prose is left alone
    const settings = conversionSettings(await loadSettings());

    if (target.pieces) {
        const replacements = convertPieces(target.pieces, settings);
        if (replacements === null) {
            await inject(showMessage, [nothingHappened(target.text, settings)]);
            return;
        };
        const written = await inject(writePieces, [target.pieces, replacements]);
        if (written === "page") {
            await inject(showMessage, [resultMessage("page")]);
            return;
        };
        // The page moved between reading it and writing to it, or would not take the
        // change. Replacing the lot is what MatTalX did before all of this, and getting
        // the maths at the cost of the formatting beats getting neither
        const flat = joinPieces(target.pieces.map((piece, i) => (
            {text: replacements[i], apart: piece.apart}
        ))).text;
        const wroteFlat = await inject(writeBack, [flat, target.kind, target.whole]);
        await inject(showMessage, [resultMessage(wroteFlat)]);
        return;
    };

    const result = convert(target.text + " ", settings);

    // The space was only there to let the parser finish the last command
    const converted = (result.text.endsWith(" ")) ? result.text.slice(0, -1) : result.text;

    if (converted === target.text) {
        await inject(showMessage, [nothingHappened(target.text, settings)]);
        return;
    };
    const written = await inject(writeBack, [converted, target.kind, target.whole]);
    await inject(showMessage, [resultMessage(written)]);
};

export function joinPieces(pieces) {
    // The pieces as one text, the way the page reads: a line break where a paragraph, a
    // list item or a <br> separates them, and nothing at all where only a change of font
    // or a link does. Says where each piece starts in it, since that is where the
    // question of whether they can be read apart is asked
    const parts = [];
    const starts = [];
    let at = 0;
    for (let i=0; i<pieces.length; i+=1) {
        if ((i > 0) && (pieces[i].apart)) {
            parts.push("\n");
            at += 1;
        };
        starts.push(at);
        parts.push(pieces[i].text);
        at += pieces[i].text.length;
    };
    return {text: parts.join(""), starts: starts};
};

export function chunkPieces(pieces, settings) {
    // Groups the pieces that cannot be read apart, and leaves the rest alone.

    // Two pieces have to be read together when the boundary between them falls inside a
    // piece of maths -- '$\mathbf x$' with the bold half in a node of its own -- or in
    // the middle of a word, where a command could be cut in two. A boundary at a space,
    // outside the maths, is a boundary the conversion cannot see, so the pieces on either
    // side are converted on their own and everything between them is left untouched.
    // Reading too much together costs nothing where nothing converts: a chunk that comes
    // back unchanged is never written, so its links and its fonts are never touched
    const joined = joinPieces(pieces);
    const spans = mathSpans(joined.text, settings.mathMode);
    const insideMaths = (at) => spans.some((span) => (span.start < at) && (at < span.end));
    const atASpace = (at) => {
        const before = joined.text[at-1];
        const after = joined.text[at];
        return ((before === undefined) || (after === undefined) ||
                (/\s/.test(before)) || (/\s/.test(after)));
    };

    const chunks = [];
    for (let i=0; i<pieces.length; i+=1) {
        const boundary = joined.starts[i];
        const together = (i > 0) && (!pieces[i].apart) &&
                         ((insideMaths(boundary)) || (!atASpace(boundary)));
        if (together) {
            chunks[chunks.length-1].push(i);
        } else {
            chunks.push([i]);
        };
    };
    return chunks;
};

export function convertPieces(pieces, settings) {
    // What every text node should hold now, or null when nothing changes.
    // A chunk that converts is written into the first of its nodes and the others are
    // emptied: what it became is one run of text, and the first node is where it started
    const chunks = chunkPieces(pieces, settings);
    const replacements = pieces.map((piece) => piece.text);
    let changed = false;
    for (const chunk of chunks) {
        const before = chunk.map((i) => pieces[i].text).join("");
        // The space is only there to let the parser finish the last command
        const result = convert(before + " ", settings);
        const after = (result.text.endsWith(" ")) ? result.text.slice(0, -1) : result.text;
        if (after === before) {
            continue;
        };
        changed = true;
        replacements[chunk[0]] = after;
        for (let i=1; i<chunk.length; i+=1) {
            replacements[chunk[i]] = "";
        };
    };
    return (changed) ? replacements : null;
};

export function resultMessage(written) {
    // What the message says once the text has been put back, or not
    // Some editors keep the text to themselves, so it goes to the clipboard instead
    if (written === "page") {
        return "Converted";
    } else if (written === "clipboard") {
        return "Converted, press Ctrl+V to paste it";
    };
    return "Nothing to convert here";
};

export function nothingHappened(text, settings) {
    // A shortcut that changes nothing looks like a broken one, so it says why instead
    // Commands like \today or \textbf do work out of math mode, which is why this only
    // reads as an explanation once the conversion has been tried and changed nothing
    const delimited = /\$|\\\(|\\\[/.test(text);
    const looksLikeCommand = /\\|\^|_/.test(text);
    if ((!settings.mathMode) && (!delimited) && (looksLikeCommand)) {
        return "Math mode is off, put the maths between $ and $";
    };
    return "Nothing to convert";
};

export function readTarget() {
    // Runs in the page: says what should be converted, and where it came from
    const fieldTypes = ["text", "search", "url", "email", ""];
    const element = document.activeElement;

    if (element && ((element.tagName === "TEXTAREA") ||
        ((element.tagName === "INPUT") && (fieldTypes.includes(element.type))))) {
        const selected = (element.selectionStart !== element.selectionEnd);
        return {
            kind: "field",
            text: (selected) ? element.value.slice(element.selectionStart, element.selectionEnd) : element.value,
            whole: !selected
        };
    };

    if (element && element.isContentEditable) {
        // Read a text node at a time, so that what is written back can go straight into
        // those same nodes and leave every element around them where it is
        const selection = window.getSelection();
        const selected = (selection) && (selection.rangeCount > 0) && (!selection.isCollapsed);
        const range = (selected) ? selection.getRangeAt(0) : null;

        // Whether a paragraph, a list item or a <br> comes between two pieces of text,
        // which is what decides that they are two lines rather than one
        const blocks = new Map();
        const isBlock = (node) => {
            if (!blocks.has(node)) {
                const display = window.getComputedStyle(node).display;
                blocks.set(node, (display.slice(0, 6) !== "inline") && (display !== "contents"));
            };
            return blocks.get(node);
        };
        const blockOf = (node) => {
            let parent = node.parentElement;
            while ((parent) && (parent !== element) && (!isBlock(parent))) {
                parent = parent.parentElement;
            };
            return parent;
        };

        const pieces = [];
        const walker = document.createTreeWalker(element,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
        let block = null;
        let broke = false;
        let index = -1;
        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeType === 1) {
                if (node.tagName === "BR") {
                    broke = true;
                };
                continue;
            };
            const parent = node.parentElement;
            if ((parent) && ((parent.tagName === "SCRIPT") || (parent.tagName === "STYLE"))) {
                continue;   // Counted by neither this nor writePieces, so they agree
            };
            index += 1;
            if ((range) && (!range.intersectsNode(node))) {
                continue;
            };
            const from = ((range) && (node === range.startContainer)) ? range.startOffset : 0;
            const to = ((range) && (node === range.endContainer)) ?
                range.endOffset : node.nodeValue.length;
            if (from >= to) {
                continue;
            };
            const mine = blockOf(node);
            pieces.push({
                index: index,
                from: from,
                to: to,
                text: node.nodeValue.slice(from, to),
                apart: (pieces.length > 0) && ((broke) || (mine !== block))
            });
            block = mine;
            broke = false;
        };

        // What it all reads as, for the messages and for the older way of writing it back
        const text = pieces.map((piece, i) => (
            ((i > 0) && (piece.apart)) ? "\n" + piece.text : piece.text
        )).join("");
        return {kind: "editable", text: text, whole: !selected, pieces: pieces};
    };

    // Nothing that can be written in, so whatever is selected is converted and copied
    const selection = window.getSelection();
    return { kind: "clipboard", text: (selection) ? selection.toString() : "", whole: false };
};

export function writePieces(pieces, replacements) {
    // Runs in the page: puts each piece back in the text node it came from, and touches
    // nothing else. The colours, the fonts, the links and the paragraphs are all held by
    // the elements around those nodes, and not one of them is taken apart

    // Editors that keep their own copy of what they hold: X, Discord and the like. Writing
    // straight into the page leaves the two disagreeing, and the editor stops taking input
    // altogether, so those are left to writeBack(), which hands them a paste instead
    const ownItself = "[data-lexical-editor],[data-slate-editor],.ProseMirror," +
                      ".public-DraftEditor-content,[data-contents],.cm-content,.ql-editor";

    const element = document.activeElement;
    if ((!element) || (!element.isContentEditable) || (element.closest(ownItself) !== null)) {
        return "";
    };

    const nodes = [];
    const walker = document.createTreeWalker(element,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
        if (node.nodeType === 1) {
            continue;
        };
        const parent = node.parentElement;
        if ((parent) && ((parent.tagName === "SCRIPT") || (parent.tagName === "STYLE"))) {
            continue;
        };
        nodes.push(node);
    };

    // The page had a life of its own between being read and being written to. Nothing is
    // touched at all unless every piece is still exactly where it was left
    for (let i=0; i<pieces.length; i+=1) {
        const held = nodes[pieces[i].index];
        if ((!held) ||
            (held.nodeValue.slice(pieces[i].from, pieces[i].to) !== pieces[i].text)) {
            return "stale";
        };
    };

    // The cursor stays where the user left it. A node that is not written to keeps it as
    // it is; in one that is, it moves with the text around it. Only a selection has
    // nowhere to stay, and is collapsed after the last thing converted
    const selection = window.getSelection();
    const caret = ((selection) && (selection.rangeCount > 0) && (selection.isCollapsed)) ?
        {node: selection.anchorNode, at: selection.anchorOffset} : null;
    let moved = null;   // The cursor's new place, when its node was written to

    let last = null;
    for (let i=0; i<pieces.length; i+=1) {
        if (replacements[i] === pieces[i].text) {
            continue;
        };
        const held = nodes[pieces[i].index];
        const held_text = held.nodeValue;
        held.nodeValue = held_text.slice(0, pieces[i].from) + replacements[i] +
                         held_text.slice(pieces[i].to);
        if ((caret) && (caret.node === held)) {
            // Only what actually changed counts, and a piece mostly does not: the prose
            // around the maths is the same before and after. Before what changed, the
            // cursor is left alone; after it, it is carried along; inside it there is no
            // place in the converted text that answers to one in the LaTeX, so it goes
            // after, the way it would after typing it
            const was = pieces[i].text;
            const now = replacements[i];
            let same = 0;
            while ((same < was.length) && (same < now.length) && (was[same] === now[same])) {
                same += 1;
            };
            let tail = 0;
            while ((tail < was.length - same) && (tail < now.length - same) &&
                   (was[was.length-1-tail] === now[now.length-1-tail])) {
                tail += 1;
            };
            const changedFrom = pieces[i].from + same;
            const changedTo = pieces[i].to - tail;
            moved = (caret.at <= changedFrom) ? caret.at :
                    ((caret.at >= changedTo) ? caret.at + (now.length - was.length) :
                     pieces[i].from + now.length - tail);
        };
        // Where the maths ran across several nodes it went back into the first of them
        // and the others were emptied, so a cursor that has to be placed follows the
        // text rather than the last node touched: an empty one is no place to leave it
        if ((replacements[i].length > 0) || (last === null)) {
            last = {node: held, at: pieces[i].from + replacements[i].length};
        };
    };
    if (last === null) {
        return "";
    };

    // The editor keeps its own idea of what it is holding, and an input event is what
    // tells it to look again
    try {
        element.dispatchEvent(new InputEvent("input",
            {bubbles: true, inputType: "insertText", data: null}));
    } catch (err) {
        try {
            element.dispatchEvent(new Event("input", {bubbles: true}));
        } catch (err) {};
    };

    // A cursor in a node nobody wrote to is exactly where it was, and is left there
    const place = (moved !== null) ? {node: caret.node, at: moved} :
                  ((caret === null) ? last : null);
    if (place !== null) {
        try {
            const range = document.createRange();
            range.setStart(place.node, Math.min(place.at, place.node.nodeValue.length));
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        } catch (err) {};
    };
    return "page";
};

export function showMessage(message) {
    // Runs in the page: says what happened, briefly, in the corner
    // Takes the opposite colours to the ones the user asked their system for, so that it
    // stands out from a page that is following the same preference
    const prefersDark = (window.matchMedia) &&
        (window.matchMedia("(prefers-color-scheme: dark)").matches);
    const background = (prefersDark) ? "rgba(246,246,246,.97)" : "rgba(34,34,34,.97)";
    const colour = (prefersDark) ? "rgb(24,24,24)" : "rgb(246,246,246)";

    const box = document.createElement("div");
    box.textContent = message;
    box.style.cssText = "position:fixed;z-index:2147483647;bottom:20px;right:20px;" +
        "padding:11px 16px;border-radius:6px;font:15px/1.45 system-ui,sans-serif;" +
        "background:" + background + ";color:" + colour + ";pointer-events:none;" +
        "box-shadow:0 3px 14px rgba(0,0,0,.35);transition:opacity .35s;";
    document.body.appendChild(box);
    setTimeout(() => { box.style.opacity = "0"; }, 1400);
    setTimeout(() => { box.remove(); }, 1800);
    return true;
};

export function writeBack(converted, kind, whole) {
    // Runs in the page: puts the converted text back where it was read from
    // Says how it went, and showMessage tells the user afterwards

    // Editors that keep their own copy of what they hold: X, Discord and the like. Writing
    // straight into the page leaves the two disagreeing, and the editor stops taking input
    // altogether, so those are handed a paste instead, which is a change they make themselves
    const ownItself = "[data-lexical-editor],[data-slate-editor],.ProseMirror," +
                      ".public-DraftEditor-content,[data-contents],.cm-content,.ql-editor";

    function copy(text, giveBackTo) {
        // The page can't be written in, so the text is put on the clipboard to be pasted
        // What was converted stays selected, so Ctrl+V puts the answer in its place rather
        // than beside it, and the user doesn't have to select it all over again
        const selection = window.getSelection();
        const range = ((selection) && (selection.rangeCount > 0)) ?
            selection.getRangeAt(0).cloneRange() : null;
        const inField = (giveBackTo) && (giveBackTo.setSelectionRange);
        const start = (inField) ? giveBackTo.selectionStart : undefined;
        const end = (inField) ? giveBackTo.selectionEnd : undefined;

        const area = document.createElement("textarea");
        area.value = text;
        area.style.cssText = "position:fixed;top:-1000px;opacity:0;";
        document.body.appendChild(area);
        area.select();
        let copied = false;
        try {
            copied = document.execCommand("copy");
        } catch (err) {
            copied = false;
        };
        area.remove();

        // Selecting the textarea took the selection away, so it is given back
        if (giveBackTo) {
            giveBackTo.focus();
        };
        if (start !== undefined) {
            try { giveBackTo.setSelectionRange(start, end); } catch (err) {};
        } else if (range) {
            try {
                selection.removeAllRanges();
                selection.addRange(range);
            } catch (err) {};
        };
        return copied;
    };

    if (kind === "clipboard") {
        return (copy(converted, null)) ? "clipboard" : "";
    };

    const element = document.activeElement;
    if (!element) {
        return "";
    };
    const editable = (kind === "editable");
    const holds = () => (editable) ? element.innerText : element.value;
    const before = holds();

    // With nothing selected the whole field is replaced, so all of it is selected first
    if (whole) {
        if (editable) {
            const range = document.createRange();
            range.selectNodeContents(element);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            element.setSelectionRange(0, element.value.length);
        };
    };

    if ((editable) && (element.closest(ownItself) !== null)) {
        // A paste that the editor ignores changes nothing at all, which is the safe way
        // to be wrong here: what is read back below is what decides whether it worked
        try {
            const data = new DataTransfer();
            data.setData("text/plain", converted);
            element.dispatchEvent(new ClipboardEvent("paste",
                {clipboardData: data, bubbles: true, cancelable: true}));
        } catch (err) {};
    } else {
        // insertText is what lets the page notice the change and what keeps Ctrl+Z working
        let written = false;
        try {
            written = document.execCommand("insertText", false, converted);
        } catch (err) {
            written = false;
        };
        if ((!written) && (!editable)) {
            // Some fields refuse insertText. Assigning to value would be ignored by React and
            // the like, so the value is set through the prototype and an event is sent after
            const prototype = (element.tagName === "TEXTAREA") ?
                window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
            const setValue = Object.getOwnPropertyDescriptor(prototype, "value").set;
            const start = element.selectionStart;
            const end = element.selectionEnd;
            setValue.call(element, element.value.slice(0, start) + converted + element.value.slice(end));
            element.dispatchEvent(new Event("input", { bubbles: true }));
        };
    };

    // The page has the last word: whatever was tried, the text is either there or it isn't
    const now = holds();
    if ((now !== before) && (now.includes(converted))) {
        return "page";
    };
    return (copy(converted, element)) ? "clipboard" : "";
};
