/*
    Listens for new update, first time users and keyboard shortcuts
    Sends a message to "convert.js" if any of these happens
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

// Lets you copy the text in (first box) or text out (second box) with simple commands
// (Alt+1 and Alt+2 respectively)
chrome.commands.onCommand.addListener((command) => {
    if (command == "copy-text-in") {
        chrome.runtime.sendMessage("copyFirst");
    } else if (command == "copy-text-out") {
        chrome.runtime.sendMessage("copySecond");
    } else if (command == "close-popup") {
        chrome.runtime.sendMessage("closePopup");
    };
}
);
