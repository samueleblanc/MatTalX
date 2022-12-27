import { dict } from "../types";

const textCommands: dict = {
    "\\^" : "^",
    "\\_" : "_",
    "\\LaTeX" : "𝐿ᴬ𝑇ᴇ𝑋",
    "\\TeX" : "𝑇ᴇ𝑋",
    "\\MatTalX" : "𝑀ᴀᴛ𝑇ᴀʟ𝑋",
    "\\CaMuS" : "𝐶ᴬ𝑀ᴜ𝑆",  // http://camus.math.usherbrooke.ca/index.html
    "\\textbullet" : "\u2022",
    "\\%" : "%",
    "\\{" : "{",
    "\\}" : "}",
    "\\backslash" : "\\",
    "\\textbackslash" : "\\",
    "\\\\" : "\u000A",
    "\\linebreak" : "\u000A",
    "\\newline" : "\u000A",
    "\\tab" : "\u0009"
};


export { textCommands };