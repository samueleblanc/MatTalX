/*
    Messages for first time user or after an update
    This file will be pasted in popup.js
*/

// Message for first time users
function firstMessage(version) {
    // Writes explanation in the two text boxes
    const text = "Welcome to 𝑀ᴀᴛ𝑇ᴀʟ𝑋 version " + version + "! At any moment, you can look at the documentation by putting your mouse above the question mark (?) " + 
    "on the top right corner. 𝑀ᴀᴛ𝑇ᴀʟ𝑋 almost always uses the same command as 𝐿ᴬ𝑇ᴇ𝑋, but there are some differences.";
    const tutorial = "First and foremost, it is important to remember that 𝑀ᴀᴛ𝑇ᴀʟ𝑋 converts the command into text, therefore a command like: \r\n" + 
    "x^{x^{x^{x}}} will give an error, since it can't fit in a line.\r\n \r\n" +
    "Every command (except superscript and subscript) starts with a backslash ('\\'). If you are unsure about a command, open the suggestion " + 
    "popup by looking at the shortcut (will appear if you hover your mouse on the question mark) or click on the button if you are on a screen-only device! \r\n\r\n" +
    "Every letter will automatically be converted to a mathematical font, if you do not want that, you can uncheck 'Mathematical font'. \r\n\r\n" +
    "As a last tip, if you get an error and the command seems right, the character that you want might not exist in unicode:\r\n" + 
    " x^{y} → 𝑥ʸ | x^{Y} → 𝑥^(𝑌) (ie y exists in superscript but not Y)\r\n \r\n" +
    "But, before jumping to a conclusion, please look at the documentation! The command, for various reasons, might be different than in 𝐿ᴬ𝑇ᴇ𝑋!";
    textIn.value = text;  // In "text_input" form
    textOut.value = tutorial;  // In "text_input" form
};

// Message after an update
function updateMessage(version) {
    // Writes explanation in the second box
    // To be changed by hand every version
    const majorChanges = "Welcome to 𝑀ᴀᴛ𝑇ᴀʟ𝑋 version " + version + "\r\n \r\n" + 
    "Major changes: \r\n" +
    " 1) In the settings, \\newcommand and \\renewcommand now accepts arguments.";
    textOut.value = majorChanges;  // In "text_input" form
};