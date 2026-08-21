import type { UUID } from "crypto";
import { abbreviateUnit, fractionalizeQuantity, pluralizeUnit } from "./measurements.ts";

export type IngredientJSON = {
    // Accept UUIDs as strings for more seamless type checking against raw JSON
    id?: UUID | string;
    quantity: number;
    unit?: string | null;
    name: string;
    inlineNote?: string | null;
    longNote?: string | null;
    // Substitution ingredients themselves do not have substitution arrays and are considered Ingredients
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

export type RecipeMetadata = {
    name: string;
    slug: string;
    thumbnailURL: string;
    description?: string | null;
    prepTimeMinutes?: number | null;
    cookTimeMinutes?: number | null;
    tags: string[];
};

export type RecipeJSON = RecipeMetadata & {
    ingredients: IngredientJSON[];
    instructions: Instruction[];
};

export class Ingredient {
    private _id: UUID;
    private _name: string;
    private _quantity: number;
    private _unit?: string;
    private _inlineNote?: string;
    private _longNote?: string;
    private _substitutions: Ingredient[][];

    /**
     * {@linkcode Ingredient.fromJSON()} is the only valid way to construct a new Ingredient instance.
     */
    private constructor(
        id: UUID = crypto.randomUUID(),
        quantity: number,
        name: string,
        substitutions: Ingredient[][] = [],
        unit?: string,
        inlineNote?: string,
        longNote?: string
    ) {
        this._id = id;
        this._name = name;
        this._quantity = quantity;
        this._substitutions = substitutions;
        this._unit = unit;
        this._inlineNote = inlineNote;
        this._longNote = longNote;
    }

    public static fromJSON(json: IngredientJSON): Ingredient {
        // Nulls should be on JSON only. Missing values should be undefined in the object.
        return new Ingredient(
            json.id as UUID,
            json.quantity,
            json.name,
            (json.substitutions ?? []).map((substitution) =>
                substitution.map((ingredient) => Ingredient.fromJSON(ingredient))
            ),
            json.unit ?? undefined,
            json.inlineNote ?? undefined,
            json.longNote ?? undefined
        );
    }

    public toJSON(): IngredientJSON {
        return {
            id: this._id,
            name: this._name,
            quantity: this._quantity,
            // Coalesce undefined to null for JSON only
            unit: this._unit ?? null,
            inlineNote: this._inlineNote ?? null,
            longNote: this._longNote ?? null,
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

    public get rawQuantity(): number {
        return this._quantity;
    }

    public get quantity(): string {
        return fractionalizeQuantity(this._quantity);
    }

    public get rawUnit(): string | undefined {
        return this._unit;
    }

    public get unit(): string | undefined {
        return this._unit ? pluralizeUnit(this._unit, this._quantity) : undefined;
    }

    public get inlineNote(): string | undefined {
        return this._inlineNote;
    }

    public get longNote(): string | undefined {
        return this._longNote;
    }

    public get substitutions(): Ingredient[][] {
        return this._substitutions;
    }

    /**
     * Get this ingredient as a string in the format "quantity (unit? )name", e.g.
     * "1 lb ground beef" or "2 eggs"
     * @returns A string representation of the ingredient in the format "quantity (unit? )name"
     */
    public toString(): string {
        return `${this.quantity} ${this._unit ? this.unit + " " : ""}${this._name}`;
    }

    public toStringWithOverrides(quantityOverride: number, unitOverride?: string) {
        return `${fractionalizeQuantity(quantityOverride)} ${unitOverride ? pluralizeUnit(unitOverride, quantityOverride) + " " : this._unit ? this.unit + " " : ""}${this._name}`;
    }

    public toScaledString(scaleFactor: number) {
        const quantity = this._quantity * scaleFactor;
        const unit = this._unit ? pluralizeUnit(this._unit, quantity) : undefined;
        return this.toStringWithOverrides(quantity, unit);
    }

    public toAbbreviatedString(): string {
        return `${this.quantity} ${this._unit ? pluralizeUnit(abbreviateUnit(this._unit), this._quantity) + " " : ""}${this._name}`;
    }

    // TODO: handle overrides more comprehensively - they should help calculate substitution scale factor in inline ingredient tooltips.
    public toAbbreviatedStringWithOverrides(quantityOverride: number, unitOverride?: string) {
        return `${fractionalizeQuantity(quantityOverride)} ${unitOverride ? pluralizeUnit(abbreviateUnit(unitOverride), quantityOverride) + " " : ""}${this._name}`;
    }
}

export class Recipe {
    private _name: string;
    private _slug: string;
    private _description?: string;
    private _ingredients: Ingredient[];
    private _instructions: Instruction[];
    private _tags: string[];
    private _thumbnailURL: URL;
    private _prepTimeMinutes?: number;
    private _cookTimeMinutes?: number;

    /**
     * {@linkcode Recipe.fromJSON()} is the only valid way to construct a new Recipe instance.
     */
    private constructor(
        name: string,
        slug: string,
        tags: string[],
        ingredients: Ingredient[],
        instructions: Instruction[],
        thumbnailURL: URL,
        description?: string,
        prepTimeMinutes?: number,
        cookTimeMinutes?: number
    ) {
        this._name = name;
        this._slug = slug;
        this._tags = tags;
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
            json.tags,
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

    public get tags(): string[] {
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

    formatFromMinutes(minutes: number = 0): string {
        const hoursSlice = Math.floor(minutes / 60);
        const minutesSlice = minutes % 60;
        return `${hoursSlice > 0 ? hoursSlice + "h " : ""}${minutesSlice > 0 ? " " + minutesSlice + "m" : ""}`;
    }

    public get prepTime(): string | undefined {
        // Need to explicitly check for undefined because 0 is falsy
        return this._prepTimeMinutes === undefined ? undefined : this.formatFromMinutes(this._prepTimeMinutes);
    }

    public get cookTime(): string | undefined {
        // Need to explicitly check for undefined because 0 is falsy
        return this._cookTimeMinutes === undefined ? undefined : this.formatFromMinutes(this._cookTimeMinutes);
    }

    public get totalTime(): string | undefined {
        // Need to explicitly check for undefined because 0 is falsy
        return this.totalTimeMinutes === undefined ? undefined : this.formatFromMinutes(this.totalTimeMinutes);
    }
}
