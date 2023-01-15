#!/usr/bin/bash

# Creates a directory and a zip file for either a chrome extension or firefox add-on
# Can also test MatTalX, however, it's not a complete test

copy_common () {
    cp -RT common $1  # Parameter is the name of the directory (e.g. 'extension', 'firefox_add_on', etc.)
    echo "Files from 'common' transfered"
}

chrome_ext () {
    if [[ -e extension ]]; then
        echo "'extension' directory already exists"
    else
        echo "Creating 'extension' directory..."
        mkdir extension
        copy_common extension
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

testing () {
    if [[ -e test_mattalx ]]; then
        rm -r test_mattalx
    fi
    echo "Creating 'test_mattalx' directory..."
    mkdir test_mattalx
    copy_common test_mattalx
    cp -RT firefox test_mattalx
    cat test_mattalx/popup-specific.js >> test_mattalx/popup.js
    rm test_mattalx/popup-specific.js
    mv test_mattalx/popup.html test_mattalx/index.html
    sed '$d' test_mattalx/index.html
    sed '$d' test_mattalx/index.html
    # sed -i '' -e '$ d' test_mattalx/index.html  # For Mac users
    # sed -i '' -e '$ d' test_mattalx/index.html
    cat test.txt >> test_mattalx/index.html
    echo "Directory made"
    echo "Opening MatTalX on localhost"
    cd test_mattalx
    http-server -s -o &
    echo "--Done--"
}

if  [[ $1 == "firefox" ]]; then
    firefox_addon
elif [[ $1 == "chrome" ]]; then
    chrome_ext
elif [[ $1 == "b-all" ]]; then
    firefox_addon
    chrome_ext
elif [[ $1 == "test" ]]; then
    testing
else
    echo "Accepted arguments: 'firefox', 'chrome', 'b-all' or 'test'." # b-all stands for build all
fi
