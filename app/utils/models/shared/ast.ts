export type TextChunk = {
    type: "text";
    content: string;
};

export type LinkChunk = {
    type: "externalLink" | "localLink";
    content: string;
    href: string;
};
