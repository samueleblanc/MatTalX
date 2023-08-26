# Contributing to MatTalX

Thank you for considering to help out!

## Ways to contribute

- Add symbols
- Improve the error messages
- Write better tests to make sure MatTalX works properly and a test to keep a check on speed during MatTalX's development
- Make sure `bash build.sh` works for Windows and Mac users
- Improve the documentation
- Cleaning up the code (including HTML and CSS) or simply adding comments that help with code readability is always appreciated!
- Create a Safari extension from the Chrome extension (see <a href="https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari" target="_blank">link</a>.)
- Improve automatic spacing (see below for a specific case)
- Spacing around symbols like '+' should depend on context. For instance, f(y+2) should return f(y+2), but 3x²+4y should return 3x² + 4y (notice the spaces). Also, a_{i}-x should return a_{i} - x, but \sum_{i}-x should return \sum_{i}-x (as in \sum_{i}(-x) or -\sum_{i}x). Again, it should take the context into consideration
- Add a nice text editor for the input box. Like all LaTeX text editors, the color of symbols like '$' should be different than plain text, the color of \commands also, etc
- Enable !matrix to be used within a regular mathmode environment
- Improve *\newcommand*, *\renewcommand*, and *\DeclareMathOperator* to include the possibility of having one or more arguments, like in LaTeX
- Adding new environments like *proof*, *theorem*, etc. with their corresponding style and font

#### Extreme way to contribute

- Rewrite MatTalX in TypeScript

## Important info

- Please add comments to your code!
- If you are unsure about a contribution, you can open a discussion or create an issue

## Testing

A basic test can be run with `bash build.sh test`

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