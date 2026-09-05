/*
    Suggesting commands directly in the page, without opening MatTalX.

    Same idea as inline.js: the list is built here, in the extension, where the dictionaries
    are, and readCaret() and showCompletion() are sent to the page as text and run there.
    They can only use what is written inside them, which is why the rule for matching a word
    and the one for finding it back in the field are spelled out again rather than imported.

    The whole list is sent at once so that the page can narrow it down on its own while the
    user keeps typing, exactly as the popup does, without asking anything again.
*/

"use strict";

import { loadSettings } from "./settings.js";
import { findWord, everyCommand, noBackslash } from "./completion.js";
import { showMessage } from "./inline.js";

export async function completeInPage(inject) {
    // 'inject' runs one of the functions below in the page and gives back what it returned
    const target = await inject(readCaret, []);
    if (!target) {
        return;
    };
    if (!target.editable) {
        await inject(showMessage, ["Nothing to complete here"]);
        return;
    };

    const settings = await loadSettings();
    await inject(showCompletion, [{
        commands : everyCommand(settings["built_commands"]),
        word : findWord(target.text, target.caret - 1),
        dark : settings["dark_mode"],
        noBackslash : noBackslash
    }]);
};

export function readCaret() {
    // Runs in the page: says what is being written and where the cursor is inside it
    const fieldTypes = ["text", "search", "url", "email", ""];
    const element = document.activeElement;

    if (element && ((element.tagName === "TEXTAREA") ||
        ((element.tagName === "INPUT") && (fieldTypes.includes(element.type))))) {
        return {editable: true, text: element.value, caret: element.selectionEnd};
    };

    if (element && element.isContentEditable) {
        const selection = window.getSelection();
        // The text around the cursor lives in one text node, which is what gets rewritten
        if ((selection) && (selection.anchorNode) && (selection.anchorNode.nodeType === 3)) {
            return {editable: true, text: selection.anchorNode.textContent, caret: selection.anchorOffset};
        };
    };

    return {editable: false, text: "", caret: 0};
};

export function showCompletion(options) {
    // Runs in the page: draws the list of suggestions and follows what the user does next
    // Pressing the shortcut again closes it, the way it does in the popup
    const open = document.getElementById("mattalx-completion");
    if (open) {
        // The run that drew it is listening for this and takes itself out of the page:
        // pressing the shortcut again closes the box, the way it does in the popup
        // An event rather than something left on the element, which each run sees differently
        open.dispatchEvent(new Event("mattalx-close"));
        open.remove();
        return true;
    };

    const element = document.activeElement;
    if (!element) {
        return false;
    };
    const delimiters = [" ", "\u000A", "^", "_", "(", ")", "[", "]", "{", "}", ".", ",",
                        "/", "-", "+", "=", "<", ">", "|", "?", "!", "$"];
    const dark = options.dark;
    const editable = (element.isContentEditable);
    let word = options.word;
    let shown = [];
    let chosen = 0;

    const colours = {
        background : (dark) ? "rgb(39,39,39)" : "white",
        border : (dark) ? "rgb(31,31,31)" : "rgb(238,238,238)",
        text : (dark) ? "whitesmoke" : "black",
        picked : (dark) ? "rgb(61,61,61)" : "rgb(230,229,229)"
    };

    const box = document.createElement("div");
    box.id = "mattalx-completion";
    box.style.cssText = "position:fixed;z-index:2147483647;max-height:210px;overflow-y:auto;" +
        "min-width:170px;max-width:340px;padding:3px;border-radius:6px;" +
        "font:14px/1.5 system-ui,sans-serif;box-shadow:0 3px 14px rgba(0,0,0,.35);" +
        "background:" + colours.background + ";color:" + colours.text +
        ";border:1px solid " + colours.border + ";";

    place();
    document.body.appendChild(box);
    element.addEventListener("keydown", onKey, true);
    window.addEventListener("scroll", place, true);
    element.addEventListener("blur", close);
    box.addEventListener("mattalx-close", close);
    draw();
    return true;

    function place() {
        // Next to the cursor when the page says where it is, under the field otherwise:
        // a text field keeps the position of its cursor to itself
        let rect = element.getBoundingClientRect();
        if (editable) {
            const selection = window.getSelection();
            if ((selection) && (selection.rangeCount > 0)) {
                const caret = selection.getRangeAt(0).getBoundingClientRect();
                if ((caret.top !== 0) || (caret.left !== 0)) {
                    rect = caret;
                };
            };
        };
        const under = (window.innerHeight - rect.bottom > 220);
        box.style.left = Math.min(rect.left, window.innerWidth - 350) + "px";
        if (under) {
            box.style.top = (rect.bottom + 4) + "px";
            box.style.bottom = "auto";
        } else {
            box.style.top = "auto";
            box.style.bottom = (window.innerHeight - rect.top + 4) + "px";
        };
    };

    function note(text) {
        const line = document.createElement("div");
        line.textContent = text;
        line.style.cssText = "padding:5px 7px;opacity:.8;";
        box.appendChild(line);
    };

    function draw() {
        box.textContent = "";
        chosen = 0;
        if (word === "") {
            close();
            return;
        };
        if (word[0] !== "\\") {
            note(options.noBackslash);
            return;
        };
        // The backslash is dropped so that, for instance, '\arrow' also shows '\rightarrow'
        const looked = word.substring(1).toLowerCase();
        shown = options.commands.filter((command) => command.insert.toLowerCase().indexOf(looked) !== -1);
        if (shown.length === 0) {
            note("No command contains '" + word + "'");
            return;
        };
        for (let i=0; i<shown.length; i++) {
            const line = document.createElement("div");
            line.textContent = shown[i].insert;
            line.style.cssText = "padding:3px 7px;border-radius:3px;cursor:pointer;white-space:pre;";
            // Shows what the command gives while the pointer is on it, as the popup does
            line.addEventListener("mouseover", () => {
                line.textContent = shown[i].preview;
                pick(i);
            });
            line.addEventListener("mouseout", () => {
                line.textContent = shown[i].insert;
            });
            // mousedown rather than click, so the field doesn't lose the cursor first
            line.addEventListener("mousedown", (event) => {
                event.preventDefault();
                insert(shown[i].insert);
            });
            box.appendChild(line);
        };
        pick(0);
    };

    function pick(i) {
        if ((shown.length === 0) || (!box.children[chosen])) {
            return;
        };
        box.children[chosen].style.backgroundColor = "";
        chosen = (i + shown.length) % shown.length;
        box.children[chosen].style.backgroundColor = colours.picked;
        box.children[chosen].scrollIntoView({block: "nearest"});
    };

    function onKey(event) {
        if ((event.key === "Escape") || (event.code === "Space")) {
            close();
            return;
        };
        if ((event.key === "ArrowLeft") || (event.key === "ArrowRight")) {
            close();  // The cursor left the command that was being written
            return;
        };
        if ((event.key === "ArrowDown") || (event.key === "ArrowUp")) {
            event.preventDefault();
            pick(chosen + ((event.key === "ArrowDown") ? 1 : -1));
            return;
        };
        if (((event.key === "Enter") || (event.key === "Tab")) && (shown.length > 0)) {
            event.preventDefault();
            insert(shown[chosen].insert);
            return;
        };
        // The letter is left to the page to write, only the word being looked up is kept up
        // to date, since the key is read before the page has had the time to write it
        if (event.key === "Backspace") {
            word = word.substring(0, word.length - 1);
            setTimeout(draw, 0);
        } else if ((event.key.length === 1) && (!event.ctrlKey) && (!event.metaKey)) {
            word += event.key;
            setTimeout(draw, 0);
        };
    };

    function insert(command) {
        // Puts the chosen command in place of the one being written
        if (editable) {
            const selection = window.getSelection();
            if ((selection) && (selection.anchorNode) && (selection.anchorNode.nodeType === 3)) {
                const node = selection.anchorNode;
                const bounds = around(node.textContent, selection.anchorOffset);
                if (bounds) {
                    const range = document.createRange();
                    range.setStart(node, bounds.start);
                    range.setEnd(node, bounds.end);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    write(command);
                };
            };
        } else {
            const bounds = around(element.value, element.selectionEnd);
            if (bounds) {
                element.setSelectionRange(bounds.start, bounds.end);
                write(command);
            };
        };
        close();
    };

    function around(text, caret) {
        // Where the command being written starts and ends, the backslash included
        let end = caret;
        while ((end < text.length) && (!delimiters.includes(text.charAt(end))) &&
               (text.charAt(end) !== "\\")) {
            ++end;
        };
        let start = caret;
        while ((start > 0) && (text.charAt(start - 1) !== "\\") &&
               (!delimiters.includes(text.charAt(start - 1)))) {
            --start;
        };
        return (text.charAt(start - 1) === "\\") ? {start: start - 1, end: end} : null;
    };

    function write(command) {
        // An editor that keeps its own copy of what it holds (X, Discord and the like) is
        // handed a paste, which is a change it makes itself: writing straight into the page
        // leaves the two disagreeing and the editor stops taking anything at all
        const ownItself = "[data-lexical-editor],[data-slate-editor],.ProseMirror," +
                          ".public-DraftEditor-content,[data-contents],.cm-content,.ql-editor";
        if ((editable) && (element.closest) && (element.closest(ownItself) !== null)) {
            try {
                const data = new DataTransfer();
                data.setData("text/plain", command);
                element.dispatchEvent(new ClipboardEvent("paste",
                    {clipboardData: data, bubbles: true, cancelable: true}));
            } catch (err) {};
            return;
        };
        // insertText is what lets the page notice the change and what keeps Ctrl+Z working
        let written = false;
        try {
            written = document.execCommand("insertText", false, command);
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
            setValue.call(element, element.value.slice(0, start) + command + element.value.slice(end));
            element.dispatchEvent(new Event("input", { bubbles: true }));
            element.setSelectionRange(start + command.length, start + command.length);
        };
    };

    function close() {
        element.removeEventListener("keydown", onKey, true);
        window.removeEventListener("scroll", place, true);
        element.removeEventListener("blur", close);
        box.remove();
    };
};
