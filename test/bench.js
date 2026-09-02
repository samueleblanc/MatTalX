/*
    Keeps an eye on how fast MatTalX converts

    Time to parse (12 sentences, one conversion each):

        v 2.5.7 - 0.0035s/sentence
        v 2.7.3 - 0.0112s/sentence
        v 2.7.4 - 0.0121s/sentence
*/

import { convert } from "../common/core.js";
import { cases } from "./cases.js";

const RUNS = 20;
let time = process.hrtime();
for (let run=0; run<RUNS; run++) {
    for (const testCase of cases) {
        convert(testCase.in + " ", {mathMode: false, ...testCase.settings});
    };
};
time = process.hrtime(time);

const seconds = time[0] + (time[1] / 1e9);
const conversions = RUNS * cases.length;
console.log(conversions + " conversions in " + seconds.toFixed(3) + "s");
console.log((seconds / conversions).toFixed(4) + "s per sentence");
