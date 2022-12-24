interface dict {
    [key: string]: string;
};

interface dictwF {
    [key: string]: string | ((arg: string[], initialCommand: string) => (string | string[])[] | string);
};

const specific = <T>() => <U extends T>(argument: U) => argument;  // https://stackoverflow.com/questions/62823059/typescript-interface-not-all-constituents-of-type-string-string-are

export { dict, dictwF, specific};