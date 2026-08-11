import type { UUID } from "crypto";
import { abbreviateUnit, fractionalizeQuantity, pluralizeUnit } from "./measurements.ts";

export type IngredientJSON = {
    // Accept UUIDs as strings for more seamless type checking against raw JSON
    id?: UUID | string;
    quantity: number;
    unit?: string | null;
    name: string;
    note?: string | null;
    substitutions?: IngredientJSON[][] | null;
};

export type TextChunk = {
    type: "text";
    content: string;
};

export type InlineIngredient = {
    id: UUID | string;
    quantity?: number | null;
    unit?: string | null;
};

export type IngredientChunk = {
    type: "ingredient";
    content: InlineIngredient;
};

export type IngredientChainChunk = {
    type: "ingredientChain";
    content: InlineIngredient[];
};

export type LinkChunk = {
    type: "externalLink" | "localLink";
    content: string;
    href: string;
};

export type InstructionChunk = TextChunk | IngredientChunk | IngredientChainChunk | LinkChunk;

type Instruction = InstructionChunk[];

export type RecipeJSON = {
    name: string;
    slug: string;
    thumbnailURL: string;
    description?: string | null;
    prepTimeMinutes?: number | null;
    cookTimeMinutes?: number | null;
    tags: string[];
    ingredients: IngredientJSON[];
    instructions: Instruction[];
};

export class Ingredient {
    private _id: UUID;
    private _name: string;
    private _quantity: number;
    private _unit?: string;
    private _note?: string;
    private _substitutions: Ingredient[][] = [];

    /**
     * {@linkcode Ingredient.fromJSON()} is the only valid way to construct a new Ingredient instance.
     */
    private constructor(
        id: UUID = crypto.randomUUID(),
        quantity: number,
        name: string,
        unit?: string,
        note?: string,
        substitutions: Ingredient[][] = []
    ) {
        this._id = id;
        this._name = name;
        this._quantity = quantity;
        this._unit = unit;
        this._note = note;
        this._substitutions = substitutions;
    }

    public static fromJSON(json: IngredientJSON): Ingredient {
        // Nulls should be on JSON only. Missing values should be undefined in the object.
        return new Ingredient(
            json.id as UUID,
            json.quantity,
            json.name,
            json.unit ?? undefined,
            json.note ?? undefined,
            (json.substitutions ?? []).map((substitution) =>
                substitution.map((ingredient) => Ingredient.fromJSON(ingredient))
            )
        );
    }

    public toJSON(): IngredientJSON {
        return {
            id: this._id,
            name: this._name,
            quantity: this._quantity,
            // Coalesce undefined to null for JSON only
            unit: this._unit ?? null,
            note: this._note ?? null,
            substitutions: this._substitutions.map((substitution) =>
                substitution.map((ingredient) => ingredient.toJSON())
            )
        };
    }

    public get id(): UUID {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get quantity(): number {
        return this._quantity;
    }

    public get unit(): string | undefined {
        return this._unit;
    }

    public get note(): string | undefined {
        return this._note;
    }

    public get substitutions(): Ingredient[][] {
        return this._substitutions;
    }

    public getFractionalizedQuantity() {
        return fractionalizeQuantity(this.quantity);
    }

    public toScaledString(scaleFactor: number) {
        const json = this.toJSON();
        json.quantity *= scaleFactor;
        if (json.unit) {
            json.unit = pluralizeUnit(json.unit, json.quantity);
        }
        return Ingredient.fromJSON(json).toString();
    }

    public toAbbreviatedString(): string {
        return `${this.getFractionalizedQuantity()} ${this._unit ? pluralizeUnit(abbreviateUnit(this._unit), this._quantity) + " " : ""}${this._name}`;
    }

    // TODO: handle overrides more comprehensively - they should help calculate substitution scale factor in inline ingredient tooltips.
    public toAbbreviatedStringWithOverrides(quantityOverride: number, unitOverride?: string) {
        return `${fractionalizeQuantity(quantityOverride)} ${unitOverride ? pluralizeUnit(abbreviateUnit(unitOverride), quantityOverride) + " " : ""}${this._name}`;
    }

    /**
     * Get this ingredient as a string in the format "quantity (unit? )name", e.g.
     * "1 lb ground beef" or "2 eggs"
     * @returns A string representation of the ingredient in the format "quantity (unit? )name"
     */
    public toString(): string {
        return `${this.getFractionalizedQuantity()} ${this._unit ? pluralizeUnit(this._unit, this._quantity) + " " : ""}${this._name}`;
    }
}

export class Recipe {
    private _name: string;
    private _slug: string;
    private _description?: string;
    private _ingredients: Ingredient[];
    private _instructions: Instruction[];
    private _tags: string[] = [];
    private _thumbnailURL: URL;
    private _prepTimeMinutes?: number;
    private _cookTimeMinutes?: number;

    /**
     * {@linkcode Recipe.fromJSON()} is the only valid way to construct a new Recipe instance.
     */
    private constructor(
        name: string,
        slug: string,
        ingredients: Ingredient[],
        instructions: Instruction[],
        thumbnailURL: URL,
        description?: string,
        prepTimeMinutes?: number,
        cookTimeMinutes?: number
    ) {
        this._name = name;
        this._slug = slug;
        this._ingredients = ingredients;
        this._instructions = instructions;
        this._description = description;
        this._thumbnailURL = thumbnailURL;
        this._prepTimeMinutes = prepTimeMinutes;
        this._cookTimeMinutes = cookTimeMinutes;
    }

    public static fromJSON(json: RecipeJSON): Recipe {
        if (json.thumbnailURL) {
            try {
                const thumbnailURLasURL = new URL(json.thumbnailURL);
                if (thumbnailURLasURL.protocol !== "https:") {
                    throw new Error("Error in thumbnailURL: image URLs must be secure (starting with 'https://').");
                }
            } catch {
                throw new Error("Invalid thumbnailURL (is it missing or an incorrect URL?)");
            }
        }

        // Nulls should be on JSON only. Missing values should be undefined in the object.
        return new Recipe(
            json.name,
            json.slug,
            json.ingredients.map((ingredient) => Ingredient.fromJSON(ingredient)),
            json.instructions,
            new URL(json.thumbnailURL),
            json.description ?? undefined,
            json.prepTimeMinutes ?? undefined,
            json.cookTimeMinutes ?? undefined
        );
    }

    public toJSON(): RecipeJSON {
        return {
            name: this._name,
            slug: this._slug,
            description: this._description ?? null,
            ingredients: this._ingredients.map((ingredient) => ingredient.toJSON()),
            instructions: this._instructions,
            tags: this._tags,
            thumbnailURL: this._thumbnailURL.toString(),
            prepTimeMinutes: this._prepTimeMinutes ?? null,
            cookTimeMinutes: this._cookTimeMinutes ?? null
        };
    }

    public get name(): string {
        return this._name;
    }

    public get slug(): string {
        return this._slug;
    }

    public get description(): string | undefined {
        return this._description;
    }

    public get ingredients(): Ingredient[] {
        return this._ingredients;
    }

    public get instructions(): Instruction[] {
        return this._instructions;
    }

    public get tags(): string[] | undefined {
        return this._tags;
    }

    public get thumbnailURL(): URL {
        return this._thumbnailURL;
    }

    public get prepTimeMinutes(): number | undefined {
        return this._prepTimeMinutes;
    }

    public get cookTimeMinutes(): number | undefined {
        return this._cookTimeMinutes;
    }

    public get totalTimeMinutes(): number | undefined {
        const totalTime = (this._prepTimeMinutes || 0) + (this._cookTimeMinutes || 0);
        return totalTime > 0 ? totalTime : undefined;
    }

    public prepTimeFormatted(): string | undefined {
        if (this._prepTimeMinutes === undefined) return undefined;
        const hours = Math.floor(this._prepTimeMinutes / 60);
        const minutes = this._prepTimeMinutes % 60;
        return `${hours > 0 ? hours + "h " : ""}${minutes > 0 ? " " + minutes + "m" : ""}`;
    }

    public cookTimeFormatted(): string | undefined {
        if (this._cookTimeMinutes === undefined) return undefined;
        const hours = Math.floor(this._cookTimeMinutes / 60);
        const minutes = this._cookTimeMinutes % 60;
        return `${hours > 0 ? hours + "h " : ""}${minutes > 0 ? " " + minutes + "m" : ""}`;
    }

    public totalTimeFormatted(): string | undefined {
        const totalTime = this.totalTimeMinutes;
        if (totalTime === undefined) return undefined;
        const hours = Math.floor(totalTime / 60);
        const minutes = totalTime % 60;
        return `${hours > 0 ? hours + "h " : ""}${minutes > 0 ? " " + minutes + "m" : ""}`;
    }

    public ingredientsFormatted(): string[] {
        return this._ingredients.map((ingredient) => ingredient.toString());
    }
}
