/*
    Commands for when outside of mathmode
*/


import { dictwF } from "../types";
import { text, textbf, textit, texttt } from "./textfonts";
import { hspace, vskip } from "./mathfunctions";

const textCommands: dictwF = {
    "\\^" : "^",
    "\\_" : "_",
    "\\LaTeX" : "𝐿ᴬ𝑇ᴇ𝑋",
    "\\TeX" : "𝑇ᴇ𝑋",
    "\\MatTalX" : "𝑀ᴀᴛ𝑇ᴀʟ𝑋",
    "\\CaMuS" : "𝐶ᴬ𝑀ᴜ𝑆",  // http://camus.math.usherbrooke.ca/index.html
    "\\textbullet" : "\u2022",
    "\\%" : "%",
    "\\#" : "#",
    "\\{" : "{",
    "\\}" : "}",
    "\\backslash" : "\\",
    "\\textbackslash" : "\\",
    "\\\\" : "\u000A",
    "\\linebreak" : "\u000A",
    "\\newline" : "\u000A",
    "\\tab" : "\u0009",
    "\\text" : text,
    "\\textbf" : textbf,
    "\\textit" : textit,
    "\\texttt" : texttt,
    "\\hspace" : hspace,
    "\\vskip" : vskip
};


export { textCommands };