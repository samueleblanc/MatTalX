/*
    Listens for new update and first time users
    Stores it in storage if any of these happens
*/

chrome.runtime.onInstalled.addListener((details) => {
    // Stores "install", "update" or other depending on the reason of onIntalled's message
    // MatTalX uses it to tell the user the new version's details or other info
    chrome.storage.local.set({"reason": details.reason});
}
);