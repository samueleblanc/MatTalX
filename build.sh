#!/usr/bin/bash

# Creates a directory and a zip file for either a chrome extension or firefox add-on

copy_common () {
    cp -RT common $1  # Parameter is the name of the directory (e.g. 'chrome_extension', 'firefox_add_on', etc.)
    echo "Files from 'common' transfered"
}

chrome_ext () {
    if [[ -e chrome_extension ]]; then
        echo "'chrome_extension' directory already exists"
    else
        echo "Creating 'chrome_extension' directory..."
        mkdir chrome_extension
        copy_common chrome_extension
        cp -RT chrome chrome_extension
        cat chrome_extension/messages.js >> chrome_extension/popup.js
        cat chrome_extension/popup-specific.js >> chrome_extension/popup.js
        rm chrome_extension/messages.js
        rm chrome_extension/popup-specific.js
        echo "Directory made"
        echo "Compressing..."
        cd chrome_extension; zip -r ../chrome_extension.zip .
        echo "--Done--"
    fi
}

firefox_addon () {
    if [[ -e firefox_add_on ]]; then
        echo "'firefox_add_on' directory already exists"
    else
        echo "Creating 'firefox_add_on' directory..."
        mkdir firefox_add_on
        copy_common firefox_add_on
        cp -RT firefox firefox_add_on
        cat firefox_add_on/messages.js >> firefox_add_on/popup.js
        cat firefox_add_on/popup-specific.js >> firefox_add_on/popup.js
        rm firefox_add_on/messages.js
        rm firefox_add_on/popup-specific.js
        echo "Directory made"
        echo "Compressing..."
        cd firefox_add_on; zip -r ../firefox_add_on.zip .
        echo "--Done--"
    fi
}

if  [[ $1 == "firefox" ]]; then
    firefox_addon
elif [[ $1 == "chrome" ]]; then
    chrome_ext
else
    echo "Accepted arguments: 'firefox' or 'chrome'"
fi
