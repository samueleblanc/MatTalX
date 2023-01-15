/*
    Messages for first time user or after an update
    This file will be pasted in popup.js
*/

// Message for first time users
function firstMessage(version) {
    // Writes explanation in the two text boxes
    const text = "Welcome to MatTalX version " + version + "! At any moment, you can look at the documentation by putting your mouse above the question mark (?) " + 
    "on the top right corner. MatTalX almost always uses the same command as LaTeX, but there are some differences.";
    const tutorial = "First and foremost, it is important to remember that MatTalX converts the command into text, therefore a command like: \r\n" + 
    "x^{x^{x^{x}}} will give an error, since it can't fit in a line.\r\n \r\n" +
    "Every commands (except superscript and subscript) starts with a backslash ('\\'). If you are unsure about a command, open the suggestion " + 
    "popup by looking at the shortcut (will appear if you hover your mouse on the question mark) or click on the button if you are on a screen-only device! \r\n\r\n" +
    "Every letter will automatically be converted to a mathematical font, if you do not want that, you can uncheck 'Mathematical font'. " + 
    "If you simply want a single letter to not be in this font, add '\\' before the letter:\r\n" + 
    " a → \u{1d44e} | \\a (or \\text{a}) → a\r\n \r\n" + 
    "As a last tip, if you get an error and the command seems right, the character that you want might not exist in unicode:\r\n" + 
    " x^{y} → 𝑥ʸ | x^{Y} → 𝑥^(𝑌) (ie y exists in superscript but not Y)\r\n \r\n" +
    "But, before jumping to conclusion, please look at the documentation! The command, for various reason, might be different than in LaTeX!";
    textIn.value = text;  // In "text_input" form
    textOut.value = tutorial;  // In "text_input" form
};

// Message after an update
function updateMessage(version) {
    // Writes explanation in the second box
    // To be changed by hand every version
    const majorChanges = "Welcome to MatTalX version " + version + "\r\n \r\n" + 
    "Major changes: \r\n" +
    " 1) Colors automatically change based on the user's prefered color scheme (light or dark)\r\n" + 
    " 2) It is now possible to convert (or not) characters in a mathematical font\r\n" + 
    " 3) By unchecking 'Math mode', you can now work outside of the math environement. Use '$', '$$' or '\\[' to enter " + 
    "math mode and '$', '$$' and '\\]' respectively to exit\r\n" + 
    " 4) If the suggestion popup is open, you can now close it by clicking outside of the box\r\n" + 
    " 5) MatTalX is now supported on android (Firefox)\r\n" + 
    " 6) Added commands like \\!, \\pmod, \\bmod, and more!";
    textOut.value = majorChanges;  // In "text_input" form
};