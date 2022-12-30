import { mistakes } from "convert";

function matrix(text: string): string {
    // Used in \documentclass{matrix}
    // Converts arrays into a matrix (i.e. [a,b,c][1,2,3] will be converted to a matrix 2x3)
    text = text.replace(/ /g, "");
    let matrixText: string = "";
    let cpt: number = 0;
    let rceil: number = 0;
    let lceil: number = 0;
    let lfloor: number = 0;
    let rfloor: number = 0;

    let i: number;

    for (i=0; i<text.length; i++) {
        if (text[i] == "[" || text[i] == "]") {
            cpt += 1;
        };
    };
    if (cpt == 2) {
        // vector (ie single line matrix)
        matrixText = text.replace(/ /g, "");
        matrixText = matrixText.replace(/\[/g, "[ ");
        matrixText = matrixText.replace(/\]/g, " ]");
        matrixText = matrixText.replace(/,/g, "\u2710");
        return matrixText;
    } else {
        for (i=0; i<text.length; i++) {
            if (text[i] == "[" && rceil == 0) {
                matrixText += "\u23A1 ";
                rceil += 1;
            } else if (text[i] == "]" && lceil == 0) {
                matrixText += " \u23A4\u000A";
                lceil += 1;
            } else if (text[i] == "]") {
                matrixText += " \u23A5\u000A";
            } else if (text[i] == "[") {
                matrixText += "\u23A2 ";
            } else {
                matrixText += text[i];
            }
        };
        let matrixArr: string[];
        for (i = matrixText.length; i>0; i--) {
            if (matrixText[i] == "\u23A5" && i > rfloor) {
                matrixArr = matrixText.split("");
                matrixArr[i] = "\u23A6";
                matrixArr[i+1] = "";  // removes "\u000A" since it's the last line
                matrixText = matrixArr.join("");
                rfloor = i;
            } else if (matrixText[i] == "\u23A2" && i > lfloor) {
                matrixArr = matrixText.split("");
                matrixArr[i] = "\u23A3";
                matrixText = matrixArr.join("");
                lfloor = i;
            };
        };
    };
    matrixText = matrixCols(matrixText);  // Adjusts columns width
    matrixText = matrixText.replace(/,/g, " ");  // Add spaces between characters
    if ((cpt % 2 != 0) || (cpt == 0)) {
        matrixText = "";
        mistakes('Wrong arguments given" \r\n \r\nExample: "$matrix [a,b,c] [d,e,f] [1,2,3]', undefined);
    };
    return matrixText;
};

function matrixCols(matrix: string): string {
    // Adjusts columns length for $matrix package
    // So, if the input is [100,10,1][0,0,0], the output should still be a 2x3 matrix with the elements aligned
    let positionLength: number = 0;
    let posLengths: number[] = [];
    let matrixPositions: number[] = [];
    let matrixPos: number = 0;
    let realPositions: number[] = [];
    
    let i,j: number;
    for (i=0; i<matrix.length; i++) {
        if (matrix[i] == ",") {
            matrixPositions.push(matrixPos);
            matrixPos += 1;
            posLengths.push(positionLength);
            positionLength = 0;
            realPositions.push(i-1);
        } else if ((matrix[i] === "\u23A4") || (matrix[i] === "\u23A5") || (matrix[i] === "\u23A6")) {  // right bracket
            matrixPositions.push(matrixPos);
            matrixPos = 0;
            posLengths.push(positionLength);
            positionLength = 0;
            realPositions.push(i-2);
        } else if ((matrix[i] === "\u23A1") || (matrix[i] === "\u23A2") || (matrix[i] === "\u23A3") || (matrix[i] === " ") || (matrix[i] === "\u000A")) {  // left bracket and spaces
            continue;
        } else {
            positionLength += 1;
        };
    };
    // Add spaces to adjust columns length
    let spacesAdded: number = 1;
    let matrixArr: string[];
    for (i=0; i<posLengths.length; i++) {
        for (j=0; j<matrixPositions.length; j++) {
            if (matrixPositions[i] == matrixPositions[j]) {
                matrixArr = matrix.split("");
                while (posLengths[i] < posLengths[j]) {
                    matrixArr.splice(realPositions[i] + spacesAdded, 0, " ");
                    posLengths[i] += 1;
                    spacesAdded += 1;
                };
                matrix = matrixArr.join("");
            };
        };
    };
    return matrix;
};

export { matrix };