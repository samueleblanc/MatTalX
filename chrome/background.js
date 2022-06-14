/*
    Listens for new update and first time users
    Stores it in storage if any of these happens
*/

// Tells the user if it's a new version of MatTalX, or some info if they are first time users
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason == "install") {
        chrome.storage.local.set({"reason": "install"});
    } else if (details.reason == "update") {
        chrome.storage.local.set({"reason": "update"});
    } else {
        chrome.storage.local.set({"reason": "default"});
    };
}
);