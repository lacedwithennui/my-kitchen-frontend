export type CitationObject = {
    href: string;
    displayText: string;
    displayIndex: number;
};

export type CitationList = Record<string, CitationObject>;