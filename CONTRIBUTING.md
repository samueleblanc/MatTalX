## Contributing to MatTalX

Thank you for considering to help out!

### Ways to contribute

#### TODO
- Spacing around symbols like '+' should depend of context. For instance, f(y+2) should return f(y+2), but 3x²+4y should return 3x² + 4y (notice the spaces). Also, a_{i}-x should return a_{i} - x, but \sum_{i}-x should return \sum_{i}-x (as in \sum_{i}(-x) or -\sum_{i}x). Again, it should take the context in consideration.
- A nice text editor for the input (and settings) box. Like all LaTeX text editor, the color of symbols like '$' should be different than plain text, the color of \commands also, etc.
- Make modifying keyboard shortcuts possible
- Make sure `bash build.sh` works for Windows and Mac users
- Write better tests to make sure MatTalX works properly and a test to keep a check on speed during MatTalX's development
- Tight up the types, to make development more strict

#### TO(maybe)DO
- Adding new environment like *proof*, *theorem*, etc. with their corresponding style and font.
- New packages are welcomed! However, please submit packages that might benefit multiple users.
- Cleaning up the code (including HTML and CSS) or simply adding comments that helps with code readability is always appreciated!
- Improve the documentation
- Improve the error messages

### Important info

- Please add comments to your code!
- If you are unsure about a contribution, you can open a discussion or create an issue

### Testing

A basic test can be ran with `bash build.sh test`

For a full test, it's recommended to build the extension or add-on (`bash build.sh chrome` or `bash build.sh firefox` respectively) and then test it in the browser.

Links for testing in the browser:
* chrome://extensions/
* about:debugging#/runtime/this-firefox

It is also possible to run test on Firefox (computer version) with  
``` 
bash build.sh firefox
cd firefox_add_on
web-ext run
```
or on Firefox (android version) with
``` 
bash build.sh android
cd andoid_add_on
web-ext run --target=firefox-android
``` 
with your cellphone connected to your computer

##### Download web-ext

`npm install --global web-ext`


More info <a href="https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/" target="_blank">here</a>.