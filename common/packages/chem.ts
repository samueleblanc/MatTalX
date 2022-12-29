/*
    Used in \documentclass{chem}
*/

import { dict } from "common/types";

const chemShortcuts: dict = {
    // Can be used with \usepackage{chem} *and* \documentclass{chem}
    "\\midp" : "\u2E31",  // mid point
    "\\middp" : "\u003A",  // mid double point
    "\\tbond" : "\u2261",
    "\\qbond" : "\u2263"
};

// Used in adjustSpacesCommon (common/spacing.ts)

// Specific symbols where spaces around them should be added
const symbolSpaced: string[] = ["\u21D2", "\u21D0", "\u21CD", "\u21CF", "\u21CE", "\u2192", "\u27F6", "\u2190", "\u27F5", 
"\u2194", "\u21AE", "\u219A", "\u219B", "\u27F8", "\u27F9", "\u27F9", "\u21D4", "\u27FA", "\u27FC", "\u21CC", "\u21CB", 
"\u21C0", "\u21C1", "\u21BC", "\u21BD", "\u219E", "\u21A0", "\u21C7", "\u21C9", "\u21F6", "\u21C6", "\u21C4", "\u21DA", 
"\u21DB", "\u21A2", "\u21A3", "\u21DC", "\u21DD", "\u21AD", "\u27FF", "\u21E0", "\u21E2", "\u2208", "\u2209", "\u220B",
"\u2282", "\u2284", "\u2286", "\u2288", "\u2283", "\u2285", "\u2287", "\u2289", "\u228F", "\u2290", "\u2291", "\u2292",
"\u22D0", "\u22D1", "\u2ABF", "\u2AC0", "\u27C3", "\u27C4", "\u2245", "\u2247", "\u221D", "\u2A67", "\u2250", "\u2A66",
"\u2260", "\u226E", "\u226F", "\u2264", "\u2A7D", "\u2265", "\u2A7E", "\u2270", "\u2271", "\u2A87", "\u2268", "\u2A88",
"\u2269", "\u2A89", "\u2A8A", "\u22E6", "\u22E7", "\u226A", "\u22D8", "\u226B", "\u22D9", "\u227A", "\u227B", "\u2280",
"\u2281", "\u227C", "\u227D", "\u2AB5", "\u2AB6", "\u2AB9", "\u2ABA", "\u22E8", "\u22E9", "\u27C2", "\u2AEB", "\u2225",
"\u2226", "\u2AF4", "\u2AF5", "\u224D", "\u2227", "\u2228", "\u27CE", "\u27CF", "\u2971", "\u2972", "\u2974", "\u00D7", 
"\u22CA", "\u22C9", "\u225D"];
const conditionalSpaces: string[] = ["+", "\u002B", "\u00B1", "\u2213", "\u2248", "\u223C", "\u224C", "\u2241"];


export { chemShortcuts, symbolSpaced, conditionalSpaces };