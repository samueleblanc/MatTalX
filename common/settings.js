/*
    Reads and writes the user's settings.

    Knows nothing about the DOM, so the popup, background.js and the tests all use the same
    code. The interface is in charge of putting the values in the Settings box and of reading
    them back; this file only knows how they are stored and what they are worth by default.
*/

"use strict";

// Firefox gives the promise based 'browser', Chrome only gives 'chrome'
// Neither exists in node, where the tests put their own storage in their place
const onFirefox = (typeof browser !== "undefined");
const api = onFirefox ? browser : ((typeof chrome !== "undefined") ? chrome : undefined);

// Chrome has always kept the settings in sync storage and Firefox in local storage
// Moving either one would lose the settings of everyone already using that browser
let area = api ? (onFirefox ? api.storage.local : api.storage.sync) : undefined;
let localArea = api ? api.storage.local : undefined;

// What is kept on the device rather than carried between the user's machines. The first
// box holds work in progress rather than a preference, and it is the one thing here with
// no size to it: Chrome refuses a whole write when a single item is over 8192 bytes, so
// leaving it among the settings is what quietly stops the settings being saved at all
const onDevice = ["box1"];

export function useStorage(storage, deviceStorage) {
    // Only used by the tests, to read and write somewhere other than the browser
    // The second one stands in for local storage where the two are not the same
    area = storage;
    localArea = (deviceStorage) ? deviceStorage : storage;
};

// Both are read in a service worker too, where there is no window, hence the guards
export const prefersDarkMode = ((typeof window !== "undefined") && (window.matchMedia)) ?
    window.matchMedia("(prefers-color-scheme: dark)").matches : false;

// A phone or a tablet, rather than anything that merely reports a touch digitiser:
// plenty of laptops answer yes to 'ontouchstart' and to maxTouchPoints while being
// driven with a trackpad, and were being given buttons meant for fingers
export const touchScreen = ((typeof window !== "undefined") && (window.matchMedia)) ?
    window.matchMedia("(hover: none) and (pointer: coarse)").matches : false;

export const defaultSettings = {
    "box1" : "",                          // The text left in the first box
    "spaces" : true,
    "font" : true,
    "mode" : false,                       // Off, so '$', '\(' and '\[' say where the maths is
    "dark_mode" : prefersDarkMode,
    "font_size" : 14,
    "font_family" : "monospace",
    "open_mattalx_shortcut" : "Alt+Shift+M",   // Only a fallback: the browser owns this one
    "copy_input_key" : "Alt",
    "copy_input_letter" : "I",
    "copy_output_key" : "Alt",
    "copy_output_letter" : "O",
    "completion_button" : touchScreen,    // Shown by default on a device with a touch screen
    "main_symbols" : touchScreen,         // '$', '\\', '{' and '}', hard to reach on a phone
    "built_commands" : []                 // Array of {type, newInput, output}
};

export function isShortcut(keyPressed, shortcut) {
    // Says if a key press is the shortcut the browser is showing (e.g. "Alt+Shift+C")
    // Read the way the browser writes it, so changing it there changes it here as well
    if ((!shortcut) || (!shortcut.includes("+"))) {
        return false;   // "Not set", or a shortcut with no key to press
    };
    const parts = shortcut.split("+");
    const letter = parts[parts.length-1];
    if ((letter.length !== 1) || (keyPressed.key.toUpperCase() !== letter.toUpperCase())) {
        return false;
    };
    // Every other key has to match too, or Alt+Shift+C would answer to Alt+C
    const asked = (name) => parts.slice(0, -1).includes(name);
    return (Boolean(keyPressed.altKey) === asked("Alt")) &&
           (Boolean(keyPressed.shiftKey) === asked("Shift")) &&
           (Boolean(keyPressed.ctrlKey) === (asked("Ctrl") || asked("MacCtrl"))) &&
           (Boolean(keyPressed.metaKey) === asked("Command"));
};

export function loadSettings() {
    // Gives back every setting, with its default value when nothing is stored
    // The two reads go out together rather than one after the other: nothing the user
    // does is kept until both are back, so the time they take is time that can be lost
    return new Promise((resolve) => {
        let stored = null;
        let kept = null;
        const bothBack = () => {
            if ((stored === null) || (kept === null)) {
                return;
            };
            const settings = {...defaultSettings};
            for (const key in defaultSettings) {
                if (stored[key] !== undefined) {
                    settings[key] = stored[key];
                };
            };
            // What the device holds wins over the copy an older version left in sync
            // storage, and that copy is taken across the first time it is read, so that
            // nobody upgrading loses what they had left in the first box
            for (const key of onDevice) {
                if (kept[key] !== undefined) {
                    settings[key] = kept[key];
                } else if ((stored[key] !== undefined) && (area !== localArea)) {
                    localArea.set({[key]: stored[key]});
                };
            };
            resolve(settings);
        };
        area.get(Object.keys(defaultSettings), (found) => { stored = found; bothBack(); });
        localArea.get(onDevice, (found) => { kept = found; bothBack(); });
    });
};

export function saveSettings(settings) {
    // Stores the settings it is given, and leaves the others alone
    // Gives back what stopped the write, or nothing when it went through
    const forDevice = {};
    const forBrowser = {};
    for (const key in settings) {
        ((onDevice.includes(key)) ? forDevice : forBrowser)[key] = settings[key];
    };
    return Promise.all([
        write(localArea, forDevice),
        write(area, forBrowser)
    ]).then((refused) => refused.find(Boolean));
};

function write(storage, values) {
    if (Object.keys(values).length === 0) {
        return Promise.resolve(undefined);
    };
    return new Promise((resolve) => {
        storage.set(values, () => resolve(refusal()));
    });
};

function refusal() {
    // Chrome says a write was refused here rather than by throwing, and saying nothing is
    // how a storage that is full or over its limit stops saving without anyone noticing
    const problem = (api) && (api.runtime) && (api.runtime.lastError);
    return (problem) ? (problem.message || "the browser would not save it") : undefined;
};

export function sameRelease(one, other) {
    // "3.0.0" and "3.0.1" are the same release: a fix has nothing to announce
    const release = (version) => String(version).split(".").slice(0, 2).join(".");
    return (Boolean(one)) && (Boolean(other)) && (release(one) === release(other));
};

export function conversionSettings(settings) {
    // Turns the stored settings into what convert() expects
    // Everything that converts text goes through this, so the popup and the page agree
    return {
        mathMode : settings["mode"],
        mathFont : settings["font"],
        adjustSpaces : settings["spaces"],
        customCommands : settings["built_commands"]
    };
};

export function installReason() {
    // background.js stores why MatTalX was just loaded, and this says what it found
    // It is left where it is: a popup can be closed, or reloaded by the phone, before the
    // message has been read, and a message nobody has read should come back
    // Always in local storage, on both browsers, since it shouldn't follow the user around
    return new Promise((resolve) => {
        localArea.get("reason", (details) => resolve(details.reason));
    });
};

export function forgetInstallReason() {
    // Called once the message has been read: converted, cleared, typed over or closed
    return new Promise((resolve) => {
        localArea.remove("reason", resolve);
    });
};
