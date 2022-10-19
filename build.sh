#!/usr/bin/bash

# Creates a directory and a zip file for either a chrome extension or firefox addon

chrome_ext () {
    mkdir extension
    cp -RT common extension
    cp -RT chrome extension
    cat extension/messages.js >> extension/popup.js
    cat extension/popup-specific.js >> extension/popup.js
    rm extension/messages.js
    rm extension/popup-specific.js
    zip -r -q extension.zip extension
}

firefox_addon () {
    mkdir addon
    cp -RT common addon
    cp -RT firefox addon
    cat addon/messages.js >> addon/popup.js
    cat addon/popup-specific.js >> addon/popup.js
    rm addon/messages.js
    rm addon/popup-specific.js
    zip -r -q addon.zip addon
}

website () {
    cat common/popup.js > ~/Website/mattalx/convert-text.js
    cat web_version/web-specific.js >> ~/Website/mattalx/convert-text.js
    cat web_version/web-version.html > ~/Website/mattalx/web-version.html
    cat web_version/web-version.css > ~/Website/mattalx/web-version.css
    cd ~/Website/mattalx
    git commit -a -m "update to newest version"
    git push origin master
}

if  [[ $1 == "firefox" ]]; then
    if [[ -e addon ]]; then
        echo "'addon' directory already exists"
    else
        firefox_addon
    fi
elif [[ $1 == "chrome" ]]; then
    if [[ -e extension ]]; then
        echo "'extension' directory already exists"
    else
        chrome_ext
    fi
elif [[ $1 == "website" ]]; then
    website
elif [[ $1 == "all" ]]; then
    firefox_addon
    chrome_ext
    website
else
    echo "Accepted arguments: 'firefox', 'chrome', 'website' or 'all'."
fi
