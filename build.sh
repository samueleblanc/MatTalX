#!/usr/bin/bash

# Creates a directory and a zip file for either a chrome extension or firefox add-on
# Can also test MatTalX, however, it's not a complete test

compile_common () {
    cd common
    tsc  # TypeScript compiler
    cd ../
}

copy_common () {
    for file in common/*; do
        case $file in
            *.js)
            mv $file $1  # Parameter is the name of the directory (e.g. 'extension', 'firefox_add_on', etc.)
            ;;
            *.html | *.css)
            cp $file $1
            ;;
            *)
            continue  # i.e. don't copy .ts (or other) files
            ;;
        esac
    done
    cd $1
    mkdir packages
    cd ../
    for file in common/packages/*.json; do
        cp $file $1/packages
    done
    cp -r common/images $1
    echo "Files from 'common' transfered"
}

chrome_ext () {
    if [[ -e extension ]]; then
        echo "'extension' directory already exists"
    else
        echo "Compiling..." 
        compile_common
        echo "Compilation done"
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
        echo "Compiling..." 
        compile_common
        echo "Compilation done"
        echo "Creating 'firefox_add_on' directory..."
        mkdir firefox_add_on
        copy_common firefox_add_on
        cp -RT firefox/main firefox_add_on
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

android_addon () {
    if [[ -e andoid_add_on ]]; then
        echo "'android_add_on' directory already exists"
    else
        echo "Compiling..." 
        compile_common
        echo "Compilation done"
        echo "Creating 'android_add_on' directory..."
        mkdir android_add_on
        copy_common andoid_add_on
        cp -RT firefox/android andoid_add_on
        cat andoid_add_on/messages.js >> andoid_add_on/popup.js
        cat andoid_add_on/popup-specific.js >> andoid_add_on/popup.js
        rm andoid_add_on/messages.js
        rm andoid_add_on/popup-specific.js
        echo "Directory made"
        echo "Compressing..."
        cd andoid_add_on; zip -r ../andoid_add_on.zip .
        echo "--Done--"
    fi
}

# Will soon be removed
website () {
    echo "Creating 'webtest' directory..."
    mkdir webtest
    cp -r common/images webtest
    cp common/popup.js webtest
    cat web_version/web-specific.js >> webtest/popup.js
    mv webtest/popup.js webtest/convert-text.js
    cp web_version/web-version.css webtest
    cp web_version/web-version.html webtest
    echo "--Done--"
}

testing () {
    # Might use this in the future
    #   https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/
    if [[ -e test_mattalx ]]; then
        rm -r test_mattalx
    fi
    echo "Compiling..." 
    compile_common
    echo "Compilation done"
    echo "Creating 'test_mattalx' directory..."
    mkdir test_mattalx
    copy_common test_mattalx
    cp -RT firefox/main test_mattalx
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
    http-server -s -o
    echo "--Done--"
}

if  [[ $1 == "firefox" ]]; then
    firefox_addon
elif  [[ $1 == "android" ]]; then
    android_addon
elif [[ $1 == "chrome" ]]; then
    chrome_ext
elif [[ $1 == "website" ]]; then
    website
elif [[ $1 == "b-all" ]]; then
    firefox_addon
    android_addon
    chrome_ext
elif [[ $1 == "test" ]]; then
    testing
else
    echo "Accepted arguments: 'firefox', 'android', 'chrome', 'website', 'b-all' or 'test'." # b-all stands for build all
fi
