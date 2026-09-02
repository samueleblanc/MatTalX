/*
    Converting what the user wrote directly in the page, without opening MatTalX.

    background.js calls convertInPage() when the shortcut is pressed. The conversion itself
    stays here, in the extension: readTarget() and the two functions after it are sent to the
    page as text and run there, so they can only use what is written inside them. That is why
    they repeat a few things instead of calling a helper.
*/

"use strict";

import { convert } from "./core.js";
import { loadSettings, conversionSettings } from "./settings.js";

export async function convertInPage(inject) {
    // 'inject' runs one of the functions below in the page and gives back what it returned
    // Each browser passes it along differently, which is all background.js has to know
    const target = await inject(readTarget, []);
    if (!target) {
        return;
    };
    if (!looksLikeLatex(target.text)) {
        // A field of ordinary words would come back in a mathematical font with its spaces
        // taken out, which is never what the user meant by pressing the shortcut
        await inject(showMessage, ["Nothing to convert"]);
        return;
    };

    const settings = conversionSettings(await loadSettings());
    if (/\$|\\\(|\\\[/.test(target.text)) {
        // The text says itself which parts are mathematics, so the rest is left as prose
        // even when the user writes everything in math mode inside MatTalX
        settings.mathMode = false;
    };
    const result = convert(target.text + " ", settings);

    // The space was only there to let the parser finish the last command
    const converted = (result.text.endsWith(" ")) ? result.text.slice(0, -1) : result.text;

    if (converted === target.text) {
        await inject(showMessage, ["Nothing to convert"]);
        return;
    };
    await inject(writeBack, [converted, target.kind, target.whole]);
};

export function looksLikeLatex(text) {
    // Nothing to do unless the text holds something MatTalX could convert:
    // a command, a superscript, a subscript, or the start of math mode
    return /\\|\^|_|\$/.test(text);
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
        const selection = window.getSelection();
        const selected = (selection) && (!selection.isCollapsed);
        return {
            kind: "editable",
            text: (selected) ? selection.toString() : element.innerText,
            whole: !selected
        };
    };

    // Nothing that can be written in, so whatever is selected is converted and copied
    const selection = window.getSelection();
    return { kind: "clipboard", text: (selection) ? selection.toString() : "", whole: false };
};

export function showMessage(message) {
    // Runs in the page: the same small message writeBack shows, on its own
    const box = document.createElement("div");
    box.textContent = message;
    box.style.cssText = "position:fixed;z-index:2147483647;bottom:16px;right:16px;" +
        "padding:7px 11px;border-radius:4px;font:13px/1.4 system-ui,sans-serif;" +
        "background:rgba(39,39,39,.94);color:whitesmoke;pointer-events:none;" +
        "box-shadow:0 2px 8px rgba(0,0,0,.3);transition:opacity .35s;";
    document.body.appendChild(box);
    setTimeout(() => { box.style.opacity = "0"; }, 1100);
    setTimeout(() => { box.remove(); }, 1500);
    return true;
};

export function writeBack(converted, kind, whole) {
    // Runs in the page: puts the converted text back where it was read from
    const message = (text) => {
        const box = document.createElement("div");
        box.textContent = text;
        box.style.cssText = "position:fixed;z-index:2147483647;bottom:16px;right:16px;" +
            "padding:7px 11px;border-radius:4px;font:13px/1.4 system-ui,sans-serif;" +
            "background:rgba(39,39,39,.94);color:whitesmoke;pointer-events:none;" +
            "box-shadow:0 2px 8px rgba(0,0,0,.3);transition:opacity .35s;";
        document.body.appendChild(box);
        setTimeout(() => { box.style.opacity = "0"; }, 1100);
        setTimeout(() => { box.remove(); }, 1500);
    };

    if (kind === "clipboard") {
        // The page can't be written in, so the text is put on the clipboard to be pasted
        const area = document.createElement("textarea");
        area.value = converted;
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
        message((copied) ? "Converted, press Ctrl+V to paste it" : "Could not copy");
        return copied;
    };

    const element = document.activeElement;
    if (!element) {
        return false;
    };

    // With nothing selected the whole field is replaced, so all of it is selected first
    if (whole) {
        if (kind === "field") {
            element.setSelectionRange(0, element.value.length);
        } else {
            const range = document.createRange();
            range.selectNodeContents(element);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        };
    };

    // insertText is what lets the page notice the change and what keeps Ctrl+Z working
    let written = false;
    try {
        written = document.execCommand("insertText", false, converted);
    } catch (err) {
        written = false;
    };

    if ((!written) && (kind === "field")) {
        // Some fields refuse insertText. Assigning to value would be ignored by React and
        // the like, so the value is set through the prototype and an event is sent after
        const prototype = (element.tagName === "TEXTAREA") ?
            window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        const setValue = Object.getOwnPropertyDescriptor(prototype, "value").set;
        const start = element.selectionStart;
        const end = element.selectionEnd;
        setValue.call(element, element.value.slice(0, start) + converted + element.value.slice(end));
        element.dispatchEvent(new Event("input", { bubbles: true }));
        written = true;
    };

    message((written) ? "Converted" : "Nothing to convert here");
    return written;
};
