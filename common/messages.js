
// Message for first time users
function firstMessage(version) {
    // Writes explanation in the two text boxes
    let text = "Welcome to MatTalX version " + version + "! At any moment, you can look at the documentation by putting your mouse above the question mark (?) " + 
    "on the top right corner. MatTalX almost always uses the same command as LaTeX, but there are some differences.";
    let tutorial = "First and foremost, it is important to remember that MatTalX converts the command into text, therefore a command like: \r\n" + 
    "x^{x^{x^{x}}} will give an error, since it can't fit in a line.\r\n \r\n" +
    "Every letter will automatically be converted to a mathematical font, if you do not want that, you can put the text inside the command \\text{}. " + 
    "If you simply want a single letter to not be in the mathematical font, add '\\' before the letter:\r\n" + 
    " a → \u{1d44e} | \\a (or \\text{a}) → a\r\n \r\n" + 
    "As a last tip, if you get an error and the command seems right, the character that you want might not exist in unicode:\r\n" + 
    " x^{y} → 𝑥ʸ | x^{Y} → 𝑥^(𝑌) (ie y exists in superscript but not Y)\r\n \r\n" +
    "But, before jumping to conclusion, please look at the documentation! The command, for various reason, might be different than in LaTeX!";
    document.text_input.text_in.value = text;
    document.text_input.text_out.value = tutorial;
};

// Message after an update
function updateMessage(version) {
    // Writes explanation in the second box
    // To be changed by hand every version
    let majorChanges = "Welcome to MatTalX version " + version + "\r\n \r\n" + 
    "Major changes: \r\n" +
    " 1) Better error messages\r\n" + 
    " 2) Improved 'Adjust spaces'\r\n" + 
    " 3) Better looking info box";
    document.text_input.text_out.value = majorChanges;
};
