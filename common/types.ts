/*
    Defining and checking for types
*/

// Used for most dictionary
interface dict {
    [key: string]: string;
};

type fct = ((arg: string[], initialCommand: string, forFrac?: boolean) => string | string[]);

// Used for mathDictionary, where some commands return function
interface dictwF {
    [key: string]: string | fct;
};

function Str(a: any): string {
    // Type checking
    if (typeof a === "string") {
        return a;
    } else {
        throw "Parameter is not a string"
    };
};

function Fct(a: any): Function {
    // Type checking
    if (typeof a === "function") {
        return a;
    } else {
        throw "Parameter is not a function"
    };
};


export { dict, dictwF, Str, Fct };