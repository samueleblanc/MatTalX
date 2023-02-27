#!/usr/bin/bash

copy_common () {
    cp -RT common $1  # Parameter is the name of the directory (e.g. 'extension', 'firefox_add_on', etc.)
    echo "Files from 'common' transfered"
}

test_liveserver () {
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
    cat test/liveserver_test.txt >> test_mattalx/index.html
    echo "Directory made"
    echo "Opening MatTalX on localhost"
    cd test_mattalx
    http-server -s -o &
    echo "--Done--"
}

test_parser () {
    if [[ -e test_mattalx ]]; then
        rm -r test_mattalx
    fi
    echo "Creating 'test_mattalx' directory..."
    mkdir test_mattalx
    copy_common test_mattalx
    echo "Deleting lines associated with html"
    sed -i -e '/HTMLElements/,/Other/d' test_mattalx/popup.js
    sed -i '/^const touchScreen/d' test_mattalx/popup.js
    sed -i -e '/if (touchScreen)/,/};/d' test_mattalx/popup.js
    cat test/parser_test.js >> test_mattalx/popup.js
    echo "Directory made"
    cd test_mattalx
    echo ""
    echo "--Start--"
    echo ""
    node popup.js
    echo ""
    echo "--Done--"
}

if [[ $1 == "liveserver" ]]; then
    test_liveserver
elif [[ $1 == "parser" ]]; then
    test_parser
else
    echo "Accepted arguments: 'liveserver', 'parser'."
fi