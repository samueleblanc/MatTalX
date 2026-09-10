/*
    Wiring specific to Firefox

    This file is copy-pasted in popup.js
    Therefore, a special attention to variable names is needed.

    Reading and writing the settings is in common/settings.js, which both browsers share.
    What is left here is what Firefox names differently from Chrome.
*/

// Firefox for Android has no commands API at all: the shortcuts are a desktop matter,
// and reaching for browser.commands there throws rather than answering. Everything that
// asks about them goes through this, so a missing API is a blank list rather than a
// popup that stops half way through setting itself up
const browserCommands = (browser.commands) ? browser.commands : null;

// What is left to do on the way out. Everything is kept as it is changed now, so this
// only catches a change the last few hundred milliseconds have not reached yet, and puts
// away a message that has been in front of the user until now
// 'blur' is what a desktop popup gives when it closes. Firefox for Android opens the
// popup as a page and never fires it: 'pagehide' and a hidden 'visibilitychange' are
// what it does give, and none of the three can be relied on to outlive the page
const closing = () => {
    saveNow();       // Reads the boxes at once, so the message still counts as unread
    if (popupWasSeen) {
        messageRead();
    };
};
window.addEventListener("blur", closing);
window.addEventListener("pagehide", closing);
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        closing();
    };
});

window.addEventListener("focus", () => {
    applyStoredSettings();
    textIn.focus();
});

function applyStoredSettings() {
    // Everything the popup needs from storage and from the browser, in one place, so
    // that opening it and returning to it put the same things in place
    // Gives back a promise, because the welcome message writes in the same two boxes and
    // has to come after this rather than race it
    const applied = loadSettings().then((settings) => {
        applyTextAndToggles(settings);
        applySettingsBox(settings);
        // Nothing is saved before this. Until the stored settings are in place the boxes
        // hold the plain HTML the popup was built from, and writing that back is how
        // every setting, and every command the user built, would be wiped
        settingsInPlace = true;
    });
    if (browserCommands) {
        browserCommands.getAll().then(
            // Show the right shortcut used to open and close MatTalX
            // Function is different from the others since this shortcut can be modified from
            // the browser settings, not directly from MatTalX
            (commands) => {
                for (const command of commands) {
                    showBrowserShortcut(command.name, command.shortcut);
                };
            },
            () => {
                showBrowserShortcut("_execute_browser_action", defaultSettings["open_mattalx_shortcut"]);
            }
        );
    } else {
        hideBrowserShortcuts();
    };
    return applied;
};

window.addEventListener("DOMContentLoaded", () => {
    // The settings go in as soon as the popup exists. Waiting for 'focus' works on a
    // desktop, but Firefox for Android opens the popup as a page and never fires it.
    // The welcome message writes in the same two boxes, so it comes after, rather than
    // racing it
    const manifest = browser.runtime.getManifest();
    applyStoredSettings().then(installReason).then((reason) => {
        if (reason === "install") {
            firstMessage(manifest.version);
        } else if (reason === "update") {
            updateMessage(manifest.version);
        } else {
            return;
        };
        // The message is not stored anywhere. It is put back every time the popup opens
        // until it has been read -- converted, cleared, typed over or closed -- so a
        // popup the phone reloads or takes away first does not swallow it
        welcomeStanding = true;
    });
});

window.addEventListener("click", (event) => {
    // Closes the suggestion popup if the users clicks anywhere except on the suggestion popup itself or input box
    if (completionPopup.style.display === "inline-block") {
        if ((event.target.id !== "text_in") && (event.target.id !== "completionBtn")) {
            closeCompletion();
        };
    } else if (settingsBox.style.display === "block") {
        if (event.target.id === "settingsBox") {
            closeSettings();
        };
    };
});

function getSettings() {
    // Puts the stored settings back in the Settings box
    // Leaves the first box alone, since the user might be writing in it
    return loadSettings().then(applySettingsBox);
};

function openSettings() {
    if ((settingsBox.style.display === "none") || (settingsBox.style.display === "")) {
        getSettings();
        settingsBox.style.display = "block";
    };
};

function closeSettings() {
    // Everything in the box is checked, applied and kept as it is changed, so closing
    // the box only puts it away
    settingsBox.style.display = "none";
};

function openShortcutSettings() {
    // Firefox opens the shortcut page itself since version 127
    // Older versions get the add-ons page, where the shortcuts are under the gear menu
    if ((browserCommands) && (browserCommands.openShortcutSettings)) {
        browserCommands.openShortcutSettings();
    } else {
        browser.tabs.create({url: "about:addons"});
    };
};
