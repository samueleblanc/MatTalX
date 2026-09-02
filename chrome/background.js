/*
    Runs in the background: remembers why MatTalX was loaded, and converts what the user
    wrote in the page when the shortcut is pressed.
*/

import { convertInPage } from "./inline.js";

chrome.runtime.onInstalled.addListener((details) => {
    // Stores "install", "update" or other depending on the reason of onInstalled's message
    // MatTalX uses it to tell the user the new version's details or other info
    chrome.storage.local.set({"reason": details.reason});
});

chrome.commands.onCommand.addListener(async (command) => {
    if (command !== "convert_inline") {
        return;
    };
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    if (tabs.length === 0) {
        return;
    };
    // Pressing the shortcut is what gives access to the tab, and only to this one
    await convertInPage(async (toRun, args) => {
        const results = await chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            func: toRun,
            args: args
        });
        return results[0].result;
    });
});
