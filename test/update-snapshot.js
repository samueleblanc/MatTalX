/*
    Rewrites snapshot.json from the current state of core.js

    Run it after a deliberate change to the conversion, then read the diff to check
    that every line that moved was supposed to move.
*/

import { writeFileSync } from "node:fs";
import { convert } from "../common/core.js";
import { runCorpus } from "./snapshot-cases.js";

const snapshot = runCorpus(convert);

// One case per line, so a diff points at the commands that changed
let text = "{\n";
const names = Object.keys(snapshot);
names.forEach((name, i) => {
    text += "\"" + name + "\": [\n";
    text += snapshot[name].map((row) => JSON.stringify(row)).join(",\n");
    text += "\n]" + ((i < names.length - 1) ? "," : "") + "\n";
});
text += "}\n";

writeFileSync(new URL("./snapshot.json", import.meta.url), text);
const total = names.reduce((sum, name) => sum + snapshot[name].length, 0);
console.log("snapshot.json written: " + total + " cases over " + names.length + " configurations");
