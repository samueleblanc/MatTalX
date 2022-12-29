import { dict } from "common/types";
import { lettersMath } from "common/unicode/letters";


const standardShortcuts: dict = {
    "\\max" : "max",
    "\\min" : "min",
    "\\grad" : "grad",
    "\\curl" : "curl",
    "\\det" : "det",
    "\\rank" : "rank",
    "\\mod" : "mod",
    "\\Mod" : "Mod",
    "\\Ker" : "Ker",
    "\\Im" : "Im"
};


const standardGreek: dict = {
    // Greek alphabet
    "\\Alpha" : "\u{1D6E2}",
    "\\alpha" : "\u{1D6FC}",
    "\\Beta" : "\u{1D6E3}",
    "\\beta" : "\u{1D6FD}",
    "\\Gamma" : "\u{1D6E4}",
    "\\gamma" : "\u{1D6FE}",
    "\\Delta" : "\u0394",
    "\\delta" : "\u03B4",
    "\\Epsilon" : "\u{1D6E6}",
    "\\epsilon" : "\u03F5",
    "\\varepsilon" : "\u03B5",
    "\\Zeta" : "\u{1D6E7}",
    "\\zeta" : "\u{1D701}",
    "\\Eta" : "\u{1D6E8}",
    "\\eta" : "\u{1D702}",
    "\\Theta" : "\u0398",
    "\\theta" : "\u{1D703}",
    "\\vartheta" : "\u03D1",
    "\\Iota" : "\u{1D6EA}",
    "\\iota" : "\u{1D704}",
    "\\Kappa" : "\u{1D6EB}",
    "\\kappa" : "\u{1D705}",
    "\\varkappa" : "\u{1D718}",
    "\\Lambda" : "\u039B",
    "\\lambda" : "\u03BB",
    "\\Mu" : "\u{1D6ED}",
    "\\mu" : "\u{1D707}",
    "\\Nu" : "\u{1D6EE}",
    "\\nu" : "\u{1D708}",
    "\\Xi" : "\u039E",
    "\\xi" : "\u{1D709}",
    "\\Omicron" : "\u{1D6F0}",
    "\\omicron" : "\u{1D70A}",
    "\\Pi" : "\u03A0",
    "\\pi" : "\u{1D70B}",
    "\\varpi" : "\u{1D71B}",
    "\\Rho" : "\u{1D6F2}",
    "\\rho" : "\u{1D70C}",
    "\\varrho" : "\u03F1",
    "\\Sigma" : "\u{1D6F4}",
    "\\sigma" : "\u{1D70E}",
    "\\varsigma" : "\u03C2",
    "\\Tau" : "\u{1D6F5}",
    "\\tau" : "\u{1D70F}",
    "\\Upsilon" : "\u{1D6F6}",
    "\\upsilon" : "\u{1D710}",
    "\\Phi" : "\u03A6",
    "\\phi" : "\u{1D719}",
    "\\varphi" : "\u{1D711}",
    "\\Chi" : "\u{1D6F8}",
    "\\chi" : "\u{1D712}",
    "\\Psi" : "\u{1D6F9}",
    "\\psi" : "\u{1D713}",
    "\\Omega" : "\u2126",
    "\\omega" : "\u{1D714}",
};


export { standardShortcuts, lettersMath, standardGreek };