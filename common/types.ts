interface dict {
    [key: string]: string;
};

interface dictwF {
    [key: string]: string | ((arg: string[], initialCommand: string, forFrac?: boolean) => string | string[]);
};


export { dict, dictwF };