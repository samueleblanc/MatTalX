import { spaceCommand } from "convert";
import { Superscript, Subscript } from "unicode/sub_super";
import { Above, Below } from "unicode/mathfunctions";


// Used in adjustSpacesCommon, depending of package used and if the user wants the automatic space adjusting
// Specific symbols where spaces around them should be added (standard list, there's another one for the chem package)
const symbolSpaced: string[] = ["=", "\u003D", "\u21D2", "\u21D0", "\u21CD", "\u21CF", "\u21CE", "\u2192", "\u27F6", "\u2190", "\u27F5", 
"\u2194", "\u21AE", "\u219A", "\u219B", "\u27F8", "\u27F9", "\u27F9", "\u21D4", "\u27FA", "\u27FC", "\u21CC", "\u21CB", 
"\u21C0", "\u21C1", "\u21BC", "\u21BD", "\u219E", "\u21A0", "\u21C7", "\u21C9", "\u21F6", "\u21C6", "\u21C4", "\u21DA", 
"\u21DB", "\u21A2", "\u21A3", "\u21DC", "\u21DD", "\u21AD", "\u27FF", "\u21E0", "\u21E2", "\u2208", "\u2209", "\u220B",
"\u2282", "\u2284", "\u2286", "\u2288", "\u2283", "\u2285", "\u2287", "\u2289", "\u228F", "\u2290", "\u2291", "\u2292",
"\u22D0", "\u22D1", "\u2ABF", "\u2AC0", "\u27C3", "\u27C4", "\u2245", "\u2247", "\u221D", "\u2261", "\u2A67", "\u2263",
"\u2260", "\u226E", "\u226F", "\u2264", "\u2A7D", "\u2265", "\u2A7E", "\u2270", "\u2271", "\u2A87", "\u2268", "\u2A88",
"\u2269", "\u2A89", "\u2A8A", "\u22E6", "\u22E7", "\u226A", "\u22D8", "\u226B", "\u22D9", "\u227A", "\u227B", "\u2280",
"\u2281", "\u227C", "\u227D", "\u2AB5", "\u2AB6", "\u2AB9", "\u2ABA", "\u22E8", "\u22E9", "\u27C2", "\u2AEB", "\u2225",
"\u2226", "\u2AF4", "\u2AF5", "\u224D", "\u2227", "\u2228", "\u27CE", "\u27CF", "\u2971", "\u2972", "\u2974", "\u2250",
"\u2A66", "\u00D7", "\u22CA", "\u22C9", "\u225D"];

const conditionalSpaces: string[] = ["+", "-", "\u002B", "\u2212", "\u00B1", "\u2213", "\u2248", "\u223C", "\u224C", "\u2241"];

// Used in adjustSpacesCommon to chose which symbols to surround with spaces (if touched by a specific symbol like '=')
const characters: string = "AÀÂBCÇDEÉÈËÊFGHIJKLMNOÔPQRSTUÙVWXYZaàâbcçdeéèêëfghijklmnoôpqrstuùvwxyz0123456789"+
                   "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧"+
                   "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"+
                   "𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛"+
                   "𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏"+
                   "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷"+
                   "𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟"+
                   "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃"+
                   "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵"+
                   "𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻"+
                   "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿"+
                   "𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯"+
                   "𝛢𝛼𝛣𝛽𝛤𝛾Δδ𝛦ϵε𝛧𝜁𝛨𝜂Θ𝜃ϑ𝛪𝜄𝛫𝜅𝜘Λλ𝛭𝜇𝛮𝜈Φ𝜙𝜑Ξ𝜉𝛰𝜊Π𝜋𝜛𝛲𝜌ϱΣσ𝛵𝜏𝛶𝜐𝛸𝜒𝛹𝜓Ω𝜔"+
                   "𝜜𝜶𝜝𝜷𝜞𝜸𝚫𝛅𝜠𝛜𝛆𝜡𝜻𝜢𝜼𝚽𝜽𝛝𝜤𝜾𝜥𝜿𝝒𝚲𝛌𝜧𝝁𝜨𝝂𝚽𝝓𝝋𝚵𝝃𝜪𝝄𝚷𝝅𝝕𝜬𝝆𝛠𝚺𝛔𝜯𝝉𝜰𝝊𝜲𝝌𝜳𝝍𝛀𝝎"+
                   "ℾℽℿℼ⅀";

function adjustSpacesCommon(input: string, symbolSpaced: string[], conditionalSpaces: string[]): string {
    // Removes spaces and add some depending on surrounding symbols
    // Used if 'Adjust space' is on

    /* 
        TODO: Spacing around symbols like '+' should depend of context
        For instance f(y+2) should return f(y+2), but 3x²+4y should return 3x² + 4y 

        Also, a_{i}-x should return a_{i} - x, but \sum_{i}-x should return \sum_{i}-x (as in \sum_{i}(-x) or -\sum_{i}x)
        Again, it should take the context in consideration
    */
    input = input.slice(0, input.length - 1)  // Since the last char is a space
    if (input.length > 2) {
        const noSpaceSymbols: string[] = Object.values(Superscript).concat(Object.values(Subscript), Object.values(Above), Object.values(Below)).filter(x => {return x !== "\u2710";});
        const spacedChar: string = characters.concat(...noSpaceSymbols);  // Add space around 'conditionalSpaces' if the previous symbol is in spacedChar
        let output: string = "";
        input = input.replace(/ /g, "");
        let delayedSpace: boolean = false;
        let spaceStored: string[] = [];

        let i: number;
        for (i=0; i<input.length; i++) {
            delayedSpace = noSpaceSymbols.includes(input[i+1]);
            if (symbolSpaced.includes(input[i])) {
                if ((output[output.length - 1] !== " ") && (output[output.length - 1] !== undefined)) {
                    if (delayedSpace) {
                        output += " " + input[i];
                        spaceStored.push(" ");
                    } else {
                        output += " " + input[i] + " ";
                    }
                } else {
                    if (delayedSpace) {
                        output += input[i];
                        spaceStored.push(" ");
                    } else {
                        output += input[i] + " ";
                    };
                };
            } else if (conditionalSpaces.includes(input[i])) {
                if ((output[output.length - 1] !== " ") && (output[output.length - 1] !== undefined) && (spacedChar.includes(output[output.length - 1]))) {
                    if (delayedSpace) {
                        output += " " + input[i];
                    } else {
                        output += " " + input[i] + " ";
                    };
                } else {
                    output += input[i];
                };
            } else {
                if (delayedSpace) {
                    output += input[i];
                } else {
                    if (spaceStored.length >= 1) {
                        output += input[i] + " ";
                        spaceStored = [];
                    }
                    else {
                        output += input[i];
                    };
                };
            };
        };
        return spaceCommand(output);
    } else {
        return spaceCommand(input);
    };
};


export { symbolSpaced, conditionalSpaces, adjustSpacesCommon };