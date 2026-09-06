/*
    Wiring specific to Firefox

    This file is copy-pasted in popup.js
    Therefore, a special attention to variable names is needed.

    Reading and writing the settings is in common/settings.js, which both browsers share.
    What is left here is what Firefox names differently from Chrome.
*/

window.addEventListener("blur", () => {
    // Saves everything, so nothing is lost if you change page or close MatTalX
    saveSettings(settingsFromBox());
});

window.addEventListener("focus", () => {
    applyStoredSettings();
    textIn.focus();
});

function applyStoredSettings() {
    // Everything the popup needs from storage and from the browser, in one place, so
    // that opening it and returning to it put the same things in place
    loadSettings().then((settings) => {
        applyTextAndToggles(settings);
        applySettingsBox(settings);
    });
    browser.commands.getAll().then(
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
};

window.addEventListener("DOMContentLoaded", () => {
    // The settings have to be put in place as soon as the popup exists. Waiting for
    // 'focus' works on a desktop, but Firefox for Android opens the popup as a page and
    // never fires it: the buttons that depend on a setting stayed hidden, and the
    // shortcuts stayed blank, which applySettings() then read as three identical ones
    applyStoredSettings();

    // Tells the user what changed, when background.js says MatTalX was just installed or updated
    const manifest = browser.runtime.getManifest();
    takeInstallReason().then((reason) => {
        if (reason === "install") {
            firstMessage(manifest.version);
        } else if (reason === "update") {
            updateMessage(manifest.version);
        };
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
    verifySettings(fontSize.value, "font");
    verifySettings(setCopyInputLetter.value, "letter");
    verifySettings(setCopyOutputLetter.value, "letter");

    saveSettings(settingsFromBox());
    applySettings();

    settingsBox.style.display = "none";
};

function openShortcutSettings() {
    // Firefox opens the shortcut page itself since version 127
    // Older versions get the add-ons page, where the shortcuts are under the gear menu
    if (browser.commands.openShortcutSettings) {
        browser.commands.openShortcutSettings();
    } else {
        browser.tabs.create({url: "about:addons"});
    };
};
