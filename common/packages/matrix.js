import { mistakes } from "../convert";

function matrix(text) {
    // If the keyword $matrix is used as the first word of the input text, this function is called
    // Converts arrays into a matrix (i.e. $matrix [a,b,c][1,2,3] will be converted to a matrix 2x3)
    text = text.replace(/ /g, "");
    let matrixText = "";
    let i, x;
    let cpt = 0;
    let rceil = 0;
    let lceil = 0;
    let lfloor = 0;
    let rfloor = 0;

    for (x in text) {
        if (text[x] == "[" || text[x] == "]") {
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
        for (i in text) {
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
        for (let n = matrixText.length; n > 0; n--) {
            if (matrixText[n] == "\u23A5" && n > rfloor) {
                matrixText = matrixText.split("");
                matrixText[n] = "\u23A6";
                matrixText[n+1] = "";  // removes "\u000A" since it's the last line
                matrixText = matrixText.join("");
                rfloor = n;
            } else if (matrixText[n] == "\u23A2" && n > lfloor) {
                matrixText = matrixText.split("");
                matrixText[n] = "\u23A3";
                matrixText = matrixText.join("");
                lfloor = n;
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

function matrixCols(matrix) {
    // Adjusts columns length for $matrix package
    // So, if the input is [100,10,1][0,0,0], the output should still be a 2x3 matrix with the elements aligned
    let positionLength = 0;
    let posLengths = [];
    let matrixPositions = [];
    let matrixPos = 0;
    let realPositions = [];
    for (let i in matrix) {
        if (matrix[i] == ",") {
            matrixPositions.push(matrixPos);
            matrixPos += 1;
            posLengths.push(positionLength);
            positionLength = 0;
            realPositions.push(i-1);
        } else if ((matrix[i] == "\u23A4") || (matrix[i] == "\u23A5") || (matrix[i] == "\u23A6")) {  // right bracket
            matrixPositions.push(matrixPos);
            matrixPos = 0;
            posLengths.push(positionLength);
            positionLength = 0;
            realPositions.push(i-2);
        } else if ((matrix[i] == "\u23A1") || (matrix[i] == "\u23A2") || (matrix[i] == "\u23A3") || (matrix[i] == " ") || (matrix[i] == "\u000A")) {  // left bracket and spaces
            continue;
        } else {
            positionLength += 1;
        };
    };
    // Add spaces to adjust columns length
    let spacesAdded = 1;
    for (let i in posLengths) {
        for (let n in matrixPositions) {
            if (matrixPositions[i] == matrixPositions[n]) {
                matrix = matrix.split("");
                while (posLengths[i] < posLengths[n]) {
                    matrix.splice(realPositions[i] + spacesAdded, 0, " ");
                    posLengths[i] += 1;
                    spacesAdded += 1;
                };
                matrix = matrix.join("");
            };
        };
    };
    return matrix;
};

export { matrix };