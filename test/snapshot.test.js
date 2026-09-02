/*
    Compares every command MatTalX knows against the recorded snapshot

    A failure here is not necessarily a bug: it means the conversion changed. If the change
    was on purpose, run `node test/update-snapshot.js` and read the diff before committing it.
*/

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { convert } from "../common/core.js";
import { runCorpus, configs } from "./snapshot-cases.js";

const recorded = JSON.parse(readFileSync(new URL("./snapshot.json", import.meta.url), "utf8"));
const current = runCorpus(convert);

for (const config of configs) {
    test("snapshot: " + config.name, () => {
        const was = recorded[config.name];
        const is = current[config.name];
        assert.ok(was !== undefined, "no snapshot recorded for " + config.name);
        assert.equal(is.length, was.length, "the corpus changed size, run update-snapshot.js");
        for (let i=0; i<is.length; i++) {
            assert.equal(is[i][0], was[i][0], "case " + i + " is not the same input");
            assert.equal(is[i][1], was[i][1], "output changed for " + JSON.stringify(is[i][0]));
            assert.equal(is[i][2], was[i][2], "errors changed for " + JSON.stringify(is[i][0]));
        };
    });
};
