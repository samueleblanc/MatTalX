/*
    Checks what MatTalX suggests while a command is being written

    The popup and the page both read this list, so what is checked here holds for both.
    What only makes sense inside a page is in inline-completion.test.js
*/

import test from "node:test";
import assert from "node:assert/strict";
import { findWord, semiAutoCompletion, everyCommand, matching, completionList,
         noBackslash } from "../common/completion.js";

const commands = everyCommand([]);
const inserts = (word) => matching(commands, word).matches.map((match) => match.insert);

test("the word under the cursor is the one being written", () => {
    // The cursor is given as the place of the last letter, as the popup reads it
    assert.equal(findWord("\\alpha", 5), "\\alpha");
    assert.equal(findWord("x + \\bet", 7), "\\bet");
    assert.equal(findWord("\\alpha \\beta", 11), "\\beta");
    // A command inside an argument is still the one being written
    assert.equal(findWord("\\mathbf{\\alp", 11), "\\alp");
});

test("a word that is not a command is read as it was typed", () => {
    assert.equal(findWord("hello", 4), "hello");
    assert.equal(findWord("", 0), "");
});

test("the letter that was just pressed is taken into account", () => {
    // The key is read before the page has had the time to write it
    assert.equal(findWord("\\alph", 4, "a"), "\\alpha");
    assert.equal(findWord("\\alpha", 5, "Backspace"), "\\alph");
});

test("a command is suggested for any part of its name", () => {
    // The point of it: '\arrow' has to bring up '\rightarrow'
    assert.ok(inserts("\\arrow").includes("\\rightarrow"));
    assert.ok(inserts("\\alpha").includes("\\alpha"));
    assert.ok(inserts("\\BB").includes("\\mathbb{}"));
});

test("a command that takes an argument is suggested with its curly brackets", () => {
    assert.ok(inserts("\\mathbf").includes("\\mathbf{}"));
    assert.ok(inserts("\\sqrt").includes("\\sqrt[]{}"));
    assert.ok(inserts("\\frac").includes("\\frac{}{}"));
});

test("a suggestion says what the command gives", () => {
    const shown = matching(commands, "\\alpha").matches;
    assert.equal(shown.find((match) => match.insert === "\\alpha").label, "\\alpha: \u{1D6FC}");
    const root = matching(commands, "\\sqrt").matches.find((match) => match.insert === "\\sqrt[]{}");
    assert.ok(root.label.includes("√"), root.label);
});

test("there is something to say when there is nothing to suggest", () => {
    // An empty box would read as MatTalX being broken
    assert.equal(matching(commands, "arrow").note, noBackslash);
    assert.ok(matching(commands, "\\zzzz").note.includes("\\zzzz"));
    assert.deepEqual(matching(commands, "\\zzzz").matches, []);
    // Nothing is being written, so there is nothing to say either
    assert.equal(matching(commands, "").note, null);
    assert.deepEqual(matching(commands, "").matches, []);
});

test("the commands the user built are suggested too", () => {
    const own = [
        {type: "\\newcommand", newInput: "\\RR", output: "\\mathbb{R}"},
        {type: "\\DeclareMathOperator", newInput: "\\Aut", output: "Aut"},
        {type: "\\DeclareUnicodeCharacter", newInput: "\\snow", output: "\\u2744"}
    ];
    const mine = matching(everyCommand(own), "\\RR").matches;
    assert.equal(mine[0].insert, "\\RR");
    assert.equal(mine[0].label, "\\RR: ℝ");
    // An operator is written with an argument, so it is suggested with one
    const operator = matching(everyCommand(own), "\\Aut").matches;
    assert.equal(operator[0].insert, "\\Aut{}");
    assert.equal(operator[0].label, "\\Aut: A → \u{1D434}\u{1D462}\u{1D461}[\u{1D434}]");
    // A character the user declared is worth suggesting as much as the rest
    assert.equal(matching(everyCommand(own), "\\snow").matches[0].label, "\\snow: ❄");
});

test("the user's own commands come before the ones MatTalX knows", () => {
    const own = [{type: "\\newcommand", newInput: "\\ar", output: "\\rightarrow"}];
    assert.equal(matching(everyCommand(own), "\\ar").matches[0].insert, "\\ar");
});

test("a command the user redefined is suggested once, with what they made of it", () => {
    const own = [{type: "\\renewcommand", newInput: "\\alpha", output: "\\beta"}];
    const shown = matching(everyCommand(own), "\\alpha").matches.filter((m) => m.insert === "\\alpha");
    assert.equal(shown.length, 1);
    assert.equal(shown[0].label, "\\alpha: \u{1D6FD}");
});

test("a command that was half built is left out", () => {
    // The settings box keeps a row around while it is being filled in
    for (const half of [{}, {type: "\\newcommand"}, {type: "\\newcommand", newInput: "\\a"}]) {
        assert.equal(everyCommand([half]).length, commands.length);
    };
});

test("choosing a suggestion replaces the command being written", () => {
    assert.equal(semiAutoCompletion("\\alp", 4, "\\alpha"), "\\alpha");
    assert.equal(semiAutoCompletion("x + \\bet", 8, "\\beta"), "x + \\beta");
    // The end of the word is taken too, wherever the cursor sits inside it
    assert.equal(semiAutoCompletion("\\alha", 3, "\\alpha"), "\\alpha");
});

test("the list the page is given is the same one the popup reads", () => {
    assert.deepEqual(completionList("\\alpha"), matching(everyCommand([]), "\\alpha"));
});

test("a suggestion shows what the command gives, next to its name", () => {
    // On hover it could not be read without looking for it first
    const at = (insert, font) => everyCommand([], font).find((c) => c.insert === insert).label;
    assert.equal(at("\\implies", true), "\\implies: ⟹");
    assert.equal(at("\\mathcal{}", true), "\\mathcal: A → 𝒜");
    assert.equal(at("\\frac{}{}", true), "\\frac: A,B → ᴬ∕ʙ");
    // Whether the letters are in a mathematical font follows what the user chose
    assert.equal(at("\\alpha", true), "\\alpha: \u{1D6FC}");
    assert.equal(at("\\alpha", false), "\\alpha: \u03B1");
    // The ones whose argument is not a letter, or whose answer doesn't fit on a line
    assert.equal(at("\\quad", true), "\\quad: 3 spaces");
    assert.equal(at("\\!", true), "\\!: removes a space");
    assert.equal(at("\\hspace{}", true), "\\hspace: 3 → 3 spaces");
    assert.equal(at("\\id2", true), "\\id2: the 2x2 identity matrix");
});

test("every suggestion has a name and an answer, and none shows a raw command", () => {
    for (const command of everyCommand([], true)) {
        assert.ok(command.label.includes(":"), "no answer for " + command.insert);
        assert.ok(!/→ *\\\\/.test(command.label), "unconverted: " + command.label);
        assert.ok(command.label.length < 45, "too long to read: " + command.label);
    };
});

test("the list is not built again when nothing about it changed", () => {
    // The popup asks for it on every keystroke
    assert.equal(everyCommand([], true), everyCommand([], true));
    assert.notEqual(everyCommand([], true), everyCommand([], false));
});

test("a name that was once misspelled is not suggested", () => {
    // It still converts, but there is no reason to put the old spelling in front of anyone
    const arrows = matching(commands, "\\squig").matches.map((match) => match.insert);
    assert.ok(arrows.includes("\\longrightsquigarrow"), arrows.join(" "));
    assert.ok(!arrows.includes("\\longrightsquiglearrow"), "the misspelling is still suggested");
});
