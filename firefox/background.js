/*
    Runs in the background: remembers why MatTalX was loaded, and answers the shortcuts
    that work inside the page, converting what the user wrote or suggesting a command.
*/

import { convertInPage } from "./inline.js";
import { completeInPage } from "./inline-completion.js";

browser.runtime.onInstalled.addListener((details) => {
    // Stores "install", "update" or other depending on the reason of onInstalled's message
    // MatTalX uses it to tell the user the new version's details or other info
    browser.storage.local.set({"reason": details.reason});
});

browser.runtime.onUpdateAvailable.addListener((details) => {
    // Seems to work fine for Chrome, but requires that for Firefox
    console.log("Updating to version " + details + ". Delete MatTalX and redownload it if it doesn't work.");
    browser.runtime.reload();
});

const shortcuts = {
    "convert_inline" : convertInPage,
    "complete_inline" : completeInPage
};

browser.commands.onCommand.addListener(async (command) => {
    const inPage = shortcuts[command];
    if (inPage === undefined) {
        return;
    };
    const tabs = await browser.tabs.query({active: true, currentWindow: true});
    if (tabs.length === 0) {
        return;
    };
    // Pressing the shortcut is what gives access to the tab, and only to this one
    await inPage(async (toRun, args) => {
        // executeScript takes code rather than a function here, so the function is sent as text
        const code = "(" + toRun.toString() + ").apply(null, " + JSON.stringify(args) + ");";
        const results = await browser.tabs.executeScript(tabs[0].id, {code: code});
        return results[0];
    });
});
