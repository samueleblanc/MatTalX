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

export function useStorage(storage) {
    // Only used by the tests, to read and write somewhere other than the browser
    area = storage;
    localArea = storage;
};

// Both are read in a service worker too, where there is no window, hence the guards
export const prefersDarkMode = ((typeof window !== "undefined") && (window.matchMedia)) ?
    window.matchMedia("(prefers-color-scheme: dark)").matches : false;

export const touchScreen = (typeof window !== "undefined") ?
    (("ontouchstart" in window) || (navigator.maxTouchPoints > 0)) : false;

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
    return new Promise((resolve) => {
        area.get(Object.keys(defaultSettings), (stored) => {
            const settings = {...defaultSettings};
            for (const key in defaultSettings) {
                if (stored[key] !== undefined) {
                    settings[key] = stored[key];
                };
            };
            resolve(settings);
        });
    });
};

export function saveSettings(settings) {
    // Stores the settings it is given, and leaves the others alone
    return new Promise((resolve) => {
        area.set(settings, resolve);
    });
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

export function takeInstallReason() {
    // background.js stores why MatTalX was just loaded, and the popup reads it once
    // Always in local storage, on both browsers, since it shouldn't follow the user around
    return new Promise((resolve) => {
        localArea.get("reason", (details) => {
            localArea.remove("reason");
            resolve(details.reason);
        });
    });
};
