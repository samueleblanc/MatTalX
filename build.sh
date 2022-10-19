#!/usr/bin/bash

# Creates a directory and a zip file for either a chrome extension or firefox addon

if  [[ $1 == "firefox" ]]; then
    if [[ -e addon ]]; then
        echo "'addon' directory already exists"
    else
        mkdir addon
        cp -RT common addon
        cp -RT firefox addon
        cat addon/messages.js >> addon/popup.js
        cat addon/popup-specific.js >> addon/popup.js
        rm addon/messages.js
        rm addon/popup-specific.js
        zip -r -q addon.zip addon
    fi
elif [[ $1 == "chrome" ]]; then
    if [[ -e extension ]]; then
        echo "'extension' directory already exists"
    else
        mkdir extension
        cp -RT common extension
        cp -RT chrome extension
        cat extension/messages.js >> extension/popup.js
        cat extension/popup-specific.js >> extension/popup.js
        rm extension/messages.js
        rm extension/popup-specific.js
        zip -r -q extension.zip extension
    fi
else
    echo "The only accepted parameter is either 'chrome' or 'firefox'."
fi
