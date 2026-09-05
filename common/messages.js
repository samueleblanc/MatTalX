/*
    Messages for first time user or after an update
    This file will be pasted in popup.js
*/

// Message for first time users
function firstMessage(version) {
    // Fills both boxes: something to convert on the left, what to do with it on the right.
    // The first thing someone does should be pressing Convert and seeing it work, rather
    // than reading a list of what can go wrong.
    const example = "For all $\\epsilon > 0$, there is $N > 0$ such that $n > N$ implies $|x_n - x| < \\epsilon$, where $x \\in \\mathbb R$.";
    const tutorial = "Welcome to 𝑀ᴀᴛ𝑇ᴀʟ𝑋 " + version + "! Press Convert to see what the box above gives.\r\n\r\n" +
    "You do not need this popup. Wherever you write on the web:\r\n" +
    "  Alt+Shift+W  converts what you have written\r\n" +
    "  Alt+Shift+C  suggests a command as you write it\r\n" +
    "  Alt+Shift+M  opens and closes 𝑀ᴀᴛ𝑇ᴀʟ𝑋\r\n\r\n" +
    "The maths goes between $ ... $, so an ordinary sentence stays an ordinary sentence. " +
    "To convert everything without writing the dollar signs, tick 'Math mode' under the question mark (?).\r\n\r\n" +
    "Commands are the ones from 𝐿ᴬ𝑇ᴇ𝑋, and they all start with a backslash. If you cannot " +
    "remember one, write a part of it and press Alt+Shift+C: '\\arrow' finds '\\rightarrow'.\r\n\r\n" +
    "Everything has to fit on a line, so x^{x^{x}} has no answer. When a command has none, " +
    "𝑀ᴀᴛ𝑇ᴀʟ𝑋 names it under the second box.";
    textIn.value = example;  // In "text_input" form
    textOut.value = tutorial;  // In "text_input" form
};

// Message after an update
function updateMessage(version) {
    // Writes explanation in the second box
    // To be changed by hand every version
    const majorChanges = "Welcome to 𝑀ᴀᴛ𝑇ᴀʟ𝑋 " + version + "\r\n\r\n" +
    "𝑀ᴀᴛ𝑇ᴀʟ𝑋 now works where you write, without opening this popup:\r\n" +
    "  Alt+Shift+W  converts what you have written, in the page\r\n" +
    "  Alt+Shift+C  suggests a command as you write it, here or in the page\r\n" +
    "  Alt+Shift+M  opens and closes 𝑀ᴀᴛ𝑇ᴀʟ𝑋\r\n\r\n" +
    "The shortcuts moved to Alt+Shift, out of the way of Outlook and other sites. Yours are " +
    "listed under Settings, where you can also change them.\r\n\r\n" +
    "Major changes: \r\n" +
    " 1) Math mode starts off, so an ordinary sentence stays one. The maths goes between " +
    "$ ... $, \\( ... \\) or \\[ ... \\].\r\n" +
    " 2) A suggestion shows what the command gives: '\\implies: ⟹'.\r\n" +
    " 3) A command takes what follows it, curly brackets or not: '\\mathbf x' and " +
    "'\\mathbf {x}' both give 𝒙.\r\n" +
    " 4) Converting a text a second time no longer breaks it.\r\n" +
    " 5) When nothing happens, 𝑀ᴀᴛ𝑇ᴀʟ𝑋 says why.\r\n" +
    " 6) Converting is about ten times faster.";
    textOut.value = majorChanges;  // In "text_input" form
};
