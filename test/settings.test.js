/*
    Checks how the settings are read, written and turned into what convert() expects
*/

import test from "node:test";
import assert from "node:assert/strict";
import {
    defaultSettings,
    loadSettings,
    saveSettings,
    conversionSettings,
    takeInstallReason,
    useStorage,
    isShortcut
} from "../common/settings.js";

function fakeStorage(content = {}) {
    // Behaves like storage.sync and storage.local do in the browser
    const stored = {...content};
    return {
        stored,
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

test("nothing stored gives every default", async () => {
    useStorage(fakeStorage());
    const settings = await loadSettings();
    assert.deepEqual(settings, defaultSettings);
});

test("what is stored wins over the default", async () => {
    useStorage(fakeStorage({font: false, font_size: 22, font_family: "Georgia"}));
    const settings = await loadSettings();
    assert.equal(settings["font"], false);
    assert.equal(settings["font_size"], 22);
    assert.equal(settings["font_family"], "Georgia");
    assert.equal(settings["mode"], defaultSettings["mode"]);   // untouched
});

test("false is kept, and not mistaken for nothing stored", async () => {
    // The three checkboxes default to true, so storing false has to survive
    useStorage(fakeStorage({spaces: false, mode: false, completion_button: false}));
    const settings = await loadSettings();
    assert.equal(settings["spaces"], false);
    assert.equal(settings["mode"], false);
    assert.equal(settings["completion_button"], false);
});

test("saving leaves the other settings alone", async () => {
    const storage = fakeStorage({font_size: 22});
    useStorage(storage);
    await saveSettings({font_family: "Calibri"});
    assert.equal(storage.stored["font_size"], 22);
    assert.equal(storage.stored["font_family"], "Calibri");
});

test("what is written can be read back", async () => {
    useStorage(fakeStorage());
    await saveSettings({dark_mode: true, built_commands: [{type: "\\newcommand", newInput: "\\RR", output: "\\mathbb{R}"}]});
    const settings = await loadSettings();
    assert.equal(settings["dark_mode"], true);
    assert.equal(settings["built_commands"][0].newInput, "\\RR");
});

test("the stored settings become what convert() expects", () => {
    const settings = {...defaultSettings, mode: false, font: true, spaces: false, built_commands: [1]};
    assert.deepEqual(conversionSettings(settings), {
        mathMode: false,
        mathFont: true,
        adjustSpaces: false,
        customCommands: [1]
    });
});

test("the install reason is read once and then gone", async () => {
    const storage = fakeStorage({reason: "install"});
    useStorage(storage);
    assert.equal(await takeInstallReason(), "install");
    assert.equal(await takeInstallReason(), undefined);
});

test("a key press is matched against the shortcut the browser owns", () => {
    const press = (key, held = {}) => ({key: key, altKey: false, ctrlKey: false,
                                        shiftKey: false, metaKey: false, ...held});
    assert.ok(isShortcut(press("c", {altKey: true}), "Alt+C"));
    assert.ok(isShortcut(press("C", {altKey: true}), "Alt+C"));
    // Every other key has to match, or Alt+Shift+C would answer to Alt+C
    assert.ok(!isShortcut(press("c", {altKey: true, shiftKey: true}), "Alt+C"));
    assert.ok(isShortcut(press("c", {altKey: true, shiftKey: true}), "Alt+Shift+C"));
    assert.ok(!isShortcut(press("c", {altKey: true}), "Alt+Shift+C"));
    assert.ok(!isShortcut(press("w", {altKey: true}), "Alt+C"));
    assert.ok(!isShortcut(press("c", {ctrlKey: true}), "Alt+C"));
    assert.ok(isShortcut(press("c", {ctrlKey: true}), "Ctrl+C"));
    // What a Mac says, and what the browser shows when there is nothing to show
    assert.ok(isShortcut(press("c", {metaKey: true}), "Command+C"));
    assert.ok(isShortcut(press("c", {ctrlKey: true}), "MacCtrl+C"));
    assert.ok(!isShortcut(press("c", {altKey: true}), "Not set"));
    assert.ok(!isShortcut(press("c", {altKey: true}), ""));
    assert.ok(!isShortcut(press("c", {altKey: true}), undefined));
});

test("math mode starts off, so prose stays prose", () => {
    // Someone who writes an ordinary sentence and presses the shortcut should get their
    // sentence back, not every letter of it in a mathematical font. The maths is what
    // goes between '$', '\\(' or '\\['
    assert.equal(defaultSettings["mode"], false);
    assert.equal(conversionSettings(defaultSettings).mathMode, false);
});

test("the keys a phone hides follow the touch screen, like the completion button", () => {
    // '$', '\\', '{' and '}' are a few taps deep on a phone keyboard, so MatTalX offers
    // them as buttons wherever it offers the completion button: on a touch screen, and
    // anywhere else the user asks for them
    assert.ok("main_symbols" in defaultSettings);
    assert.equal(defaultSettings["main_symbols"], defaultSettings["completion_button"]);
    // Neither is part of the conversion, so neither reaches core.js
    assert.ok(!("main_symbols" in conversionSettings(defaultSettings)));
});

test("a setting the user changed comes back, and the rest keep their defaults", () => {
    // Nothing stored for main_symbols means the touch screen decides, as on a fresh install
    useStorage(fakeStorage({"main_symbols": true, "mode": true}));
    return loadSettings().then((settings) => {
        assert.equal(settings["main_symbols"], true);
        assert.equal(settings["mode"], true);
        assert.equal(settings["font"], defaultSettings["font"]);
    });
});
