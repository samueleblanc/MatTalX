/*
    Listens for new update and first time users
    Stores it in storage if any of these happens
*/

browser.runtime.onInstalled.addListener((details) => {
    // Stores "install", "update" or other depending on the reason of onIntalled's message
    // MatTalX uses it to tell the user the new version's details or other info
    browser.storage.local.set({"reason": details.reason});
}
);

browser.runtime.onUpdateAvailable.addListener((details) => {
    // Seems to work fine for Chrome, but requires that for Firefox
    browser.runtime.reload();
}
);