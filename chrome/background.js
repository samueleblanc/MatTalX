/*
    Runs in the background: remembers why MatTalX was loaded, and answers the shortcuts
    that work inside the page, converting what the user wrote or suggesting a command.
*/

import { convertInPage } from "./inline.js";
import { completeInPage } from "./inline-completion.js";

chrome.runtime.onInstalled.addListener((details) => {
    // Stores "install", "update" or other depending on the reason of onInstalled's message
    // MatTalX uses it to tell the user the new version's details or other info
    chrome.storage.local.set({"reason": details.reason});
});

const shortcuts = {
    "convert_inline" : convertInPage,
    "complete_inline" : completeInPage
};

chrome.commands.onCommand.addListener(async (command) => {
    const inPage = shortcuts[command];
    if (inPage === undefined) {
        return;
    };
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    if (tabs.length === 0) {
        return;
    };
    // Pressing the shortcut is what gives access to the tab, and only to this one
    await inPage(async (toRun, args) => {
        const results = await chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            func: toRun,
            args: args
        });
        return results[0].result;
    });
});
