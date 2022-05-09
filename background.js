/*
    Listens for new update and first time users
    Sends a message to "popup.js" if any of these happens
*/

// Tells the user if it's a new version of MatTalX, or some info if they are first time users
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason == "install") {
        chrome.runtime.sendMessage("installed");
    } else if (details.reason == "update") {
        chrome.runtime.sendMessage("updated");
    };
}
);