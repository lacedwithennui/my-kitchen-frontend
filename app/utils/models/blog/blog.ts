import type { LinkChunk, TextChunk } from "../shared/ast.ts";

export type BlogPostContentChunk = TextChunk | LinkChunk;

export type BlogPostContent = BlogPostContentChunk[];

export type BlogPostMetadata = {
    name: string;
    slug: string;
    thumbnailURL?: string;
    description?: string | null;
    tags: string[];
};

export type BlogPostJSON = BlogPostMetadata & {
    content: BlogPostContent;
};

export class BlogPost {
    private _name: string;
    private _slug: string;
    private _tags: string[];
    private _thumbnailURL?: URL;
    private _description?: string;
    private _content: BlogPostContent;

    private constructor(
        name: string,
        slug: string,
        tags: string[],
        content: BlogPostContent,
        thumbnailURL?: URL,
        description?: string
    ) {
        this._name = name;
        this._slug = slug;
        this._tags = tags;
        this._content = content;
        this._thumbnailURL = thumbnailURL;
        this._description = description;
    }

    public static fromJSON(json: BlogPostJSON) {
        if (json.thumbnailURL) {
            try {
                const thumbnailURLasURL = new URL(json.thumbnailURL);
                if (thumbnailURLasURL.protocol !== "https:") {
                    throw new Error("Error in thumbnailURL: image URLs must be secure (starting with 'https://').");
                }
            } catch {
                throw new Error("Invalid thumbnailURL (is it a malformed URL?)");
            }
        }

        return new BlogPost(
            json.name,
            json.slug,
            json.tags,
            json.content,
            json.thumbnailURL ? new URL(json.thumbnailURL) : undefined,
            json.description ?? undefined
        );
    }

    public get name(): string {
        return this._name;
    }

    public get slug(): string {
        return this._slug;
    }

    public get tags(): string[] {
        return this._tags;
    }

    public get content(): BlogPostContent {
        return this._content;
    }

    public get thumbnailURL(): URL | undefined {
        return this._thumbnailURL;
    }

    public get description(): string | undefined {
        return this._description;
    }
}
