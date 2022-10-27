#!/usr/bin/bash

# Creates a directory and a zip file for either a chrome extension or firefox add-on
# Can also test MatTalX, however, it's not a complete test

chrome_ext () {
    if [[ -e extension ]]; then
        echo "'extension' directory already exists"
    else
        echo "Creating directory..."
        mkdir extension
        cp -RT common extension
        cp -RT chrome extension
        cat extension/messages.js >> extension/popup.js
        cat extension/popup-specific.js >> extension/popup.js
        rm extension/messages.js
        rm extension/popup-specific.js
        echo "Directory made"
        echo "Compressing..."
        cd extension; zip -r ../extension.zip .
        echo "--Done--"
    fi
}

firefox_addon () {
    if [[ -e addon ]]; then
        echo "'addon' directory already exists"
    else
        echo "Creating directory..."
        mkdir addon
        cp -RT common addon
        cp -RT firefox addon
        cat addon/messages.js >> addon/popup.js
        cat addon/popup-specific.js >> addon/popup.js
        rm addon/messages.js
        rm addon/popup-specific.js
        echo "Directory made"
        echo "Compressing..."
        cd addon; zip -r ../addon.zip .
        echo "--Done--"
    fi
}

website () {
    echo "Creating directory..."
    mkdir webtest
    cp -r common/Images webtest
    cp common/popup.js webtest
    cat web_version/web-specific.js >> webtest/popup.js
    mv webtest/popup.js webtest/convert-text.js
    cp web_version/web-version.css webtest
    cp web_version/web-version.html webtest
    echo "--Done--"
}

testing () {
    if [[ -e mattalx_test ]]; then
        rm -r mattalx_test
    fi
    echo "Creating directory..."
    mkdir test_mattalx
    cp -r common/Images test_mattalx
    cp common/popup.js test_mattalx
    cp common/popup_style.css test_mattalx
    cat web_version/web-specific.js >> test_mattalx/popup.js
    cp chrome/popup.html test_mattalx
    sed -i '7d' test_mattalx/popup.html
    mv test_mattalx/popup.html test_mattalx/index.html
    sed -i '37d' test_mattalx/index.html
    sed -i '37d' test_mattalx/index.html
    cat test.txt >> test_mattalx/index.html
    echo "Directory made"
    echo "Opening MatTalX on localhost"
    cd test_mattalx
    http-server -s -o
    echo "--Done--"
}

if  [[ $1 == "firefox" ]]; then
    firefox_addon
elif [[ $1 == "chrome" ]]; then
    chrome_ext
elif [[ $1 == "website" ]]; then
    website
elif [[ $1 == "b-all" ]]; then
    firefox_addon
    chrome_ext
    website
elif [[ $1 == "test" ]]; then
    testing
else
    echo "Accepted arguments: 'firefox', 'chrome', 'website', 'b-all' or 'test'." # b-all stands for build all
fi
