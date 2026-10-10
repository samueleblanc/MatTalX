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
        const done = convertPieces(target.pieces, settings);
        if (done === null) {
            await inject(showMessage, [nothingHappened(target.text, settings)]);
            return;
        };
        const written = await inject(writePieces, [target.pieces, done.edits]);
        if (written === "page") {
            await inject(showMessage, [resultMessage("page")]);
            return;
        };
        // The page moved between reading it and writing to it, or the editor keeps its
        // own copy of what it holds and takes a paste instead: X, Discord, Messenger.
        // Replacing the lot is what MatTalX did before all of this, and getting the
        // maths at the cost of the formatting beats getting neither. The text comes
        // from the chunks rather than from converting the whole, so the line breaks
        // between paragraphs survive: convert() reads a newline the way LaTeX does,
        // as nothing at all
        const wroteFlat = await inject(writeBack, [done.flat, target.kind, target.whole]);
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
    // What to do to the page, or null when nothing changes.
    // 'edits' is one edit per chunk that converts, covering only what differs in it: the
    // prose around the maths is the same before and after, and is left out, so that
    // nothing that has not changed is touched. 'flat' is the whole text as converted, for
    // an editor that has to be handed the lot
    const chunks = chunkPieces(pieces, settings);
    const converted = pieces.map((piece) => ({text: piece.text, apart: piece.apart}));
    const edits = [];
    for (const chunk of chunks) {
        const before = chunk.map((i) => pieces[i].text).join("");
        // The space is only there to let the parser finish the last command
        const result = convert(before + " ", settings);
        const after = (result.text.endsWith(" ")) ? result.text.slice(0, -1) : result.text;
        if (after === before) {
            continue;
        };
        for (const run of keptInsideNodes(pieces, chunk, changedRuns(before, after), after)) {
            edits.push({
                start: placeIn(pieces, chunk, run.from, false),
                end: placeIn(pieces, chunk, run.to, true),
                text: run.text
            });
        };
        converted[chunk[0]].text = after;
        for (let i=1; i<chunk.length; i+=1) {
            converted[chunk[i]].text = "";
        };
    };
    return (edits.length > 0) ? {edits: edits, flat: joinPieces(converted).text} : null;
};

export function whatDiffers(before, after) {
    // How much the two texts share at the start and at the end
    let same = 0;
    while ((same < before.length) && (same < after.length) && (before[same] === after[same])) {
        same += 1;
    };
    let tail = 0;
    while ((tail < before.length - same) && (tail < after.length - same) &&
           (before[before.length-1-tail] === after[after.length-1-tail])) {
        tail += 1;
    };
    return [same, tail];
};

// A symbol MatTalX writes takes two places in a string, and a boundary must never fall
// between them: half a character is not a character, and a range that starts on one
// cannot be written to
const lowHalf = (code) => (code >= 0xDC00) && (code <= 0xDFFF);
const highHalf = (code) => (code >= 0xD800) && (code <= 0xDBFF);

const shortestAnchor = 3;   // Shorter than this is not worth an edit of its own

function longestShared(before, aFrom, aTo, after, bFrom, bTo) {
    // The longest run of text the two have in common, which is where they line up again
    const n = aTo - aFrom;
    const m = bTo - bFrom;
    if ((n <= 0) || (m <= 0) || (n * m > 250000)) {
        return null;   // Nothing to look in, or more work than the answer is worth
    };
    let previous = new Array(m + 1).fill(0);
    let current = new Array(m + 1).fill(0);
    let best = 0;
    let endsBefore = 0;
    let endsAfter = 0;
    for (let i = 1; i <= n; i += 1) {
        for (let j = 1; j <= m; j += 1) {
            current[j] = (before[aFrom+i-1] === after[bFrom+j-1]) ? previous[j-1] + 1 : 0;
            if (current[j] > best) {
                best = current[j];
                endsBefore = aFrom + i;
                endsAfter = bFrom + j;
            };
        };
        const swap = previous;
        previous = current;
        current = swap;
        current.fill(0);
    };
    let at = endsBefore - best;
    let to = endsAfter - best;
    // A run that starts on the second half of a symbol, or ends on the first, is holding
    // half a character: it is shortened until it holds whole ones
    if ((best > 0) && (lowHalf(before.charCodeAt(at)))) {
        at += 1;
        to += 1;
        best -= 1;
    };
    if ((best > 0) && (highHalf(before.charCodeAt(at + best - 1)))) {
        best -= 1;
    };
    return (best > 0) ? {at: at, to: to, length: best} : null;
};

export function changedRuns(before, after) {
    // Every stretch of 'before' that 'after' replaces, in order, as {from, to, text}.
    //
    // A line of a message usually holds more than one expression, with the user's own
    // prose between them. Taking only what the two texts share at each end would leave
    // that prose inside the edit, so it would be deleted and typed again exactly as it
    // was. Nothing would look different, but it is no longer the text the editor
    // remembers the user writing, and its undo stops lining up with it.
    //
    // So the two are lined up again on the longest run they share, and each side of it
    // is looked at in turn. What is left over at the end is the maths, and nothing else
    const runs = [];
    const walk = (aFrom, aTo, bFrom, bTo) => {
        while ((aFrom < aTo) && (bFrom < bTo) && (before[aFrom] === after[bFrom])) {
            aFrom += 1;
            bFrom += 1;
        };
        if ((aFrom > 0) && (lowHalf(before.charCodeAt(aFrom)))) {
            aFrom -= 1;   // Stopped between the two halves of a symbol
            bFrom -= 1;
        };
        while ((aFrom < aTo) && (bFrom < bTo) && (before[aTo-1] === after[bTo-1])) {
            aTo -= 1;
            bTo -= 1;
        };
        if ((aTo < before.length) && (highHalf(before.charCodeAt(aTo-1)))) {
            aTo += 1;
            bTo += 1;
        };
        if ((aFrom >= aTo) && (bFrom >= bTo)) {
            return;   // The two are the same here
        };
        const shared = longestShared(before, aFrom, aTo, after, bFrom, bTo);
        if ((shared === null) || (shared.length < shortestAnchor)) {
            runs.push({from: aFrom, to: aTo, text: after.slice(bFrom, bTo)});
            return;
        };
        walk(aFrom, shared.at, bFrom, shared.to);
        walk(shared.at + shared.length, aTo, shared.to + shared.length, bTo);
    };
    walk(0, before.length, 0, after.length);
    return runs;
};

function keptInsideNodes(pieces, chunk, runs, after) {
    // Text written over a range that starts where a text node starts, and that holds a
    // space, is put before the element that node belongs to rather than inside it: the
    // bold half of an expression ends up beside the bold rather than in it. Replacing the
    // whole of a node is not caught by that, so when a run begins where a node begins and
    // does not reach its end, the chunk is written as one piece, the way it used to be
    let at = 0;
    const spans = [];
    for (const i of chunk) {
        spans.push({start: at, end: at + pieces[i].text.length});
        at += pieces[i].text.length;
    };
    const startsANode = (run) => spans.some(
        (span) => (run.from === span.start) && (run.to !== span.end));
    if (!runs.some(startsANode)) {
        return runs;
    };
    const before = chunk.map((i) => pieces[i].text).join("");
    const [same, tail] = whatDiffers(before, after);
    return [{from: same, to: before.length - tail, text: after.slice(same, after.length - tail)}];
};

function placeIn(pieces, chunk, offset, closing) {
    // Where an offset in a chunk's text falls: which text node, and where in it
    // A boundary between two pieces belongs to the earlier one when it closes an edit and
    // to the later one when it opens one, so an edit never reaches into a node it changes
    // nothing in
    let counted = 0;
    for (const i of chunk) {
        const length = pieces[i].text.length;
        const here = (closing) ? ((offset > counted) && (offset <= counted + length)) :
                                 ((offset >= counted) && (offset < counted + length));
        if (here) {
            return {index: pieces[i].index, at: pieces[i].from + (offset - counted)};
        };
        counted += length;
    };
    // The very edges: opening at the end of the chunk, or closing at its start
    const i = (closing) ? chunk[0] : chunk[chunk.length-1];
    return {index: pieces[i].index, at: (closing) ? pieces[i].from : pieces[i].to};
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

export function writePieces(pieces, edits) {
    // Runs in the page: makes each edit where it falls, and touches nothing else. The
    // colours, the fonts, the links and the paragraphs are all held by the elements
    // around the text, and an edit only ever covers the text that changed

    // Editors that keep their own copy of what they hold: X, Discord and the like. Writing
    // straight into the page leaves the two disagreeing, and the editor stops taking input
    // altogether, so those are left to writeBack(), which hands them a paste instead
    const ownItself = "[data-lexical-editor],[data-slate-editor],.ProseMirror," +
                      ".public-DraftEditor-content,[data-contents],.cm-content,.ql-editor";

    const element = document.activeElement;
    if ((!element) || (!element.isContentEditable) || (element.closest(ownItself) !== null)) {
        return "";
    };

    // The text nodes in order, counted the way readTarget() counted them
    const textNodes = () => {
        const found = [];
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
            found.push(node);
        };
        return found;
    };
    const nodes = textNodes();

    // The page had a life of its own between being read and being written to. Nothing is
    // touched at all unless every piece is still exactly where it was left
    for (const piece of pieces) {
        const held = nodes[piece.index];
        if ((!held) || (held.nodeValue.slice(piece.from, piece.to) !== piece.text)) {
            return "stale";
        };
    };

    // Places are counted in characters of text from the start of the message rather than
    // held as a node and an offset: the browser is free to split and join text nodes as
    // it writes, and does, so the cursor is found again afterwards by counting
    const countTo = (list, node, at) => {
        let counted = 0;
        for (const held of list) {
            if (held === node) {
                return counted + at;
            };
            counted += held.nodeValue.length;
        };
        return -1;
    };
    const countAll = (list) => list.reduce((sum, held) => sum + held.nodeValue.length, 0);

    // The cursor stays where the user left it. Before what changed it is left alone; after
    // it, it is carried along; inside it there is no place in the converted text that
    // answers to one in the LaTeX, so it goes after, the way it would after typing it.
    // Only a selection has nowhere to stay, and is collapsed after the last edit
    const selection = window.getSelection();
    let cursor = ((selection) && (selection.rangeCount > 0) && (selection.isCollapsed)) ?
        countTo(nodes, selection.anchorNode, selection.anchorOffset) : -1;

    // The node and offset a count falls on, in the nodes as they are now. On a boundary
    // between two nodes it is the end of the earlier one when closing an edit and the
    // start of the later one when opening it, so an edit never reaches into a node it
    // changes nothing in
    const locate = (count, closing) => {
        const list = textNodes();
        let counted = 0;
        for (const held of list) {
            const length = held.nodeValue.length;
            const here = (closing) ? ((count > counted) && (count <= counted + length)) :
                                     ((count >= counted) && (count < counted + length));
            if (here) {
                return {node: held, at: count - counted};
            };
            counted += length;
        };
        if (list.length === 0) {
            return null;
        };
        const edge = (closing) ? list[0] : list[list.length-1];
        return {node: edge, at: (closing) ? 0 : edge.nodeValue.length};
    };

    // Writing straight into a text node tells the editor nothing, so it is told afterwards.
    // The browser's own editing says so itself, once per edit, and saying it again over
    // the top of that is how an editor is given a change it has already seen
    let toldByHand = false;

    // From the end of the message back to the start, so no edit moves the ones still to
    // come: what an edit does to the count only reaches what comes after it
    const ordered = edits.map((edit) => ({
        text: edit.text,
        from: countTo(nodes, nodes[edit.start.index], edit.start.at),
        to: countTo(nodes, nodes[edit.end.index], edit.end.at)
    })).sort((one, other) => other.from - one.from);

    for (const edit of ordered) {
        // Found again each time rather than held on to: the browser is free to join
        // and remake the text nodes around every edit it makes, and does
        const start = locate(edit.from, false);
        const end = locate(edit.to, true);
        if ((start === null) || (end === null)) {
            break;
        };
        const before = countAll(textNodes());

        // Through the browser's own editing, so that the editor sees it as typing: Ctrl+Z
        // takes it back, its own history stays right, and a newline becomes a line break
        // rather than a character nobody can see. What is typed over a selection keeps
        // the formatting the selection started in, which is what keeps the bold bold
        let written = false;
        try {
            const range = document.createRange();
            range.setStart(start.node, start.at);
            range.setEnd(end.node, end.at);
            selection.removeAllRanges();
            selection.addRange(range);
            written = document.execCommand("insertText", false, edit.text);
        } catch (err) {
            written = false;
        };
        if (!written) {
            writeStraight(start, end, edit.text);
            toldByHand = true;
        };

        // What the write did to the count. A newline became a line break, not a character
        const grew = countAll(textNodes()) - before;
        const endedAt = edit.from + (edit.to - edit.from) + grew;
        if (cursor === -1) {
            cursor = endedAt;   // The last edit in the message is the first one made
        } else if (cursor >= edit.to) {
            cursor += grew;
        } else if (cursor > edit.from) {
            cursor = endedAt;
        };
    };

    if (toldByHand) {
        try {
            element.dispatchEvent(new Event("input", {bubbles: true}));
        } catch (err) {};
    };

    // The cursor, found again by counting
    try {
        let counted = 0;
        for (const held of textNodes()) {
            if (cursor <= counted + held.nodeValue.length) {
                const range = document.createRange();
                range.setStart(held, cursor - counted);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
                break;
            };
            counted += held.nodeValue.length;
        };
    } catch (err) {};
    return "page";

    function writeStraight(start, end, text) {
        // For an editor that refuses the browser's own editing: straight into the nodes.
        // A newline is a line break, not a character, so it becomes a <br> here, the way
        // the editing engine would have made one
        const list = textNodes();
        const head = start.node.nodeValue.slice(0, start.at);
        const rest = end.node.nodeValue.slice(end.at);
        for (let i = list.indexOf(start.node) + 1; i < list.indexOf(end.node); i += 1) {
            list[i].nodeValue = "";
        };
        if (end.node !== start.node) {
            end.node.nodeValue = rest;
            start.node.nodeValue = head + text;
        } else {
            start.node.nodeValue = head + text + rest;
        };
        let node = start.node;
        let from = head.length;
        let left = text.length;
        let cut;
        while ((left > 0) && ((cut = node.nodeValue.indexOf("\n", from)) !== -1) &&
               (cut < from + left)) {
            const after = node.splitText(cut);
            after.nodeValue = after.nodeValue.slice(1);
            node.parentNode.insertBefore(document.createElement("br"), after);
            left -= (cut - from) + 1;
            node = after;
            from = 0;
        };
    };
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
