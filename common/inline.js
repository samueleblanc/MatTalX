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
    if (!target.text.trim()) {
        await inject(showMessage, ["Nothing to convert"]);
        return;
    };

    // The user's settings decide, here as in the popup. With math mode off, which is how it
    // starts, only what is between '$', '\(' or '\[' is converted and the prose is left alone
    const settings = conversionSettings(await loadSettings());
    const result = convert(target.text + " ", settings);

    // The space was only there to let the parser finish the last command
    const converted = (result.text.endsWith(" ")) ? result.text.slice(0, -1) : result.text;

    if (converted === target.text) {
        await inject(showMessage, [nothingHappened(target.text, settings)]);
        return;
    };
    const written = await inject(writeBack, [converted, target.kind, target.whole]);
    await inject(showMessage, [resultMessage(target.kind, written)]);
};

export function resultMessage(kind, written) {
    // What the message says once the text has been put back, or not
    if (!written) {
        return (kind === "clipboard") ? "Could not copy" : "Nothing to convert here";
    };
    return (kind === "clipboard") ? "Converted, press Ctrl+V to paste it" : "Converted";
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
    // Says whether it managed to, and showMessage tells the user afterwards
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

    return written;
};
