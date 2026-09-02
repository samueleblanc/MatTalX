#!/usr/bin/bash

copy_common () {
    cp -RT common $1  # Parameter is the name of the directory (in these cases, test_mattalx)
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
    sed -i '$d' test_mattalx/index.html
    sed -i '$d' test_mattalx/index.html
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
    # The parser lives in common/core.js, which knows nothing about the DOM,
    # so node can run it directly
    npm run test:all
}

if [[ $1 == "liveserver" ]]; then
    test_liveserver
elif [[ $1 == "parser" ]]; then
    test_parser
else
    echo "Accepted arguments: 'liveserver', 'parser'."
fi
