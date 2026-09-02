# Contributing to MatTalX

Thank you for considering to help out!

## Ways to contribute

- Add symbols
- Improve the error messages
- Add cases to `test/cases.js`, especially for commands that aren't covered yet
- Make sure `bash build.sh` works for Windows and Mac users
- Improve the documentation
- Cleaning up the code (including HTML and CSS) or simply adding comments that help with code readability is always appreciated!
- Create a Safari extension from the Chrome extension (see <a href="https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari" target="_blank">link</a>.)
- Adapt the current Firefox add-on for it to also work as an Android version (see <a href="https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/" target="_blank">link</a>.)
- Improve automatic spacing (see below for a specific case)
- Spacing around symbols like '+' should depend on context. For instance, f(y+2) should return f(y+2), but 3x²+4y should return 3x² + 4y (notice the spaces). Also, a_{i}-x should return a_{i} - x, but \sum_{i}-x should return \sum_{i}-x (as in \sum_{i}(-x) or -\sum_{i}x). Again, it should take the context into consideration
- Add a nice text editor for the input box. Like all LaTeX text editors, the color of symbols like '$' should be different than plain text, the color of \commands also, etc
- Improve *\newcommand*, *\renewcommand*, and *\DeclareMathOperator* to include the possibility of having one or more arguments, like in LaTeX
- Adding new environments like *proof*, *theorem*, etc. with their corresponding style and font

#### Extreme way to contribute

- Rewrite MatTalX in TypeScript

## Important info

- Please add comments to your code!
- If you are unsure about a contribution, you can open a discussion or create an issue

## Code structure

`common/core.js` holds the dictionaries and the parser, and never touches the DOM, so node can run it
directly and the tests don't need a browser. `common/settings.js` reads and writes the user's settings and
knows nothing about the DOM either. `common/popup.js` is the interface: it asks settings.js what the user
chose and core.js for a conversion, with `convert(text, conversionSettings(settings))`.

`common/inline.js` converts what the user wrote straight in a page, when the shortcut is pressed.
The functions it sends to the page can only use what is written inside them, since they are sent
as text, which is why they don't call helpers.

`chrome/popup-specific.js`, `firefox/popup-specific.js` and the two `background.js` hold only what
the browsers name differently. They are copied over `common` by `build.sh`.

## Testing

```
npm test          # the conversion cases of test/cases.js
npm run test:all  # same, plus every command MatTalX knows against test/snapshot.json
npm run bench     # how fast a sentence is converted
```

The snapshot converts every command under a few settings combinations, so a change to the parser, the
dictionaries or the spacing shows up as a diff. If the change was on purpose, run `npm run snapshot`
and read the diff before committing it.

Both run on every push (see `.github/workflows/test.yml`).

## The web version

<a href="https://mattalx.org/web-version.html" target="_blank">The web version</a> lives in the
<a href="https://github.com/samueleblanc/MatTalX_website" target="_blank">website repository</a> and runs
the very same `core.js`. A change to `core.js` opens a pull request there on its own
(see `.github/workflows/sync-website.yml`), so `js/core.js` on the website should never be edited by hand.
Its interface, `js/web-version.js`, is the website's own and is not synced.

For a full test, it's recommended to build the extension or add-on (`bash build.sh chrome` or `bash build.sh firefox` respectively) and then test it in the browser.

Links for testing in the browser:
* chrome://extensions/
* about:debugging#/runtime/this-firefox

It is also possible to run a test on Firefox (computer version) with  
``` 
bash build.sh firefox
cd firefox_add_on
web-ext run
```
or on Firefox (android version) with
``` 
bash build.sh firefox
cd firefox_add_on
web-ext run --target=firefox-android
``` 
with your cellphone connected to your computer

##### Download web-ext

`npm install --global web-ext`


More info <a href="https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/" target="_blank">here</a>.