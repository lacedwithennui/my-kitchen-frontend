type IngredientJSON = {
    name: string;
    quantity: number;
    unit?: string | null;
    substitutionIds: string[];
};

type RecipeJSON = {
    name: string;
    subtitle?: string;
    description?: string;
    ingredients: IngredientJSON[];
    instructions: string[];
    tags?: string[];
    thumbnailURL?: string;
    prepTimeMinutes?: number;
    cookTimeMinutes?: number;
};

export default class Recipe {
    private _name: string;
    private _subtitle?: string;
    private _description?: string;
    private _ingredients: Ingredient[];
    private _instructions: string[];
    private _tags?: string[];
    private _thumbnailURL?: string;
    private _prepTimeMinutes?: number;
    private _cookTimeMinutes?: number;

    public constructor(
        name: string,
        ingredients: Ingredient[],
        instructions: string[]
    ) {
        this._name = name;
        this._ingredients = ingredients;
        this._instructions = instructions;
    }

    public withSubtitle(subtitle?: string): Recipe {
        this._subtitle = subtitle;
        return this;
    }

    public withDescription(description?: string): Recipe {
        this._description = description;
        return this;
    }

    public withTags(tags?: string[]): Recipe {
        this._tags = tags;
        return this;
    }

    public withThumbnail(thumbnail?: string): Recipe {
        this._thumbnailURL = thumbnail;
        return this;
    }

    public withPrepTime(prepTimeMinutes?: number): Recipe {
        this._prepTimeMinutes = prepTimeMinutes;
        return this;
    }

    public withCookTime(cookTimeMinutes?: number): Recipe {
        this._cookTimeMinutes = cookTimeMinutes;
        return this;
    }

    public static fromJSON(json: RecipeJSON): Recipe {
        const recipe = new Recipe(
            json.name,
            json.ingredients.map((ingredient) =>
                Ingredient.fromJSON(ingredient)
            ),
            json.instructions
        )
            .withSubtitle(json.subtitle)
            .withDescription(json.description)
            .withTags(json.tags)
            .withThumbnail(json.thumbnailURL)
            .withPrepTime(json.prepTimeMinutes)
            .withCookTime(json.cookTimeMinutes);

        return recipe;
    }

    public toJSON(): RecipeJSON {
        return {
            name: this._name,
            subtitle: this._subtitle,
            description: this._description,
            ingredients: this._ingredients.map((ingredient) => ingredient.toJSON()),
            instructions: this._instructions,
            tags: this._tags,
            thumbnailURL: this._thumbnailURL,
            prepTimeMinutes: this._prepTimeMinutes,
            cookTimeMinutes: this._cookTimeMinutes
        };
    }

    public get name(): string {
        return this._name;
    }

    public get subtitle(): string | undefined {
        return this._subtitle;
    }

    public get description(): string | undefined {
        return this._description;
    }

    public get ingredients(): Ingredient[] {
        return this._ingredients;
    }

    public get instructions(): string[] {
        return this._instructions;
    }

    public get tags(): string[] | undefined {
        return this._tags;
    }

    public get thumbnailURL(): string | undefined {
        return this._thumbnailURL;
    }

    public get prepTimeMinutes(): number | undefined {
        return this._prepTimeMinutes;
    }

    public get cookTimeMinutes(): number | undefined {
        return this._cookTimeMinutes;
    }

    public get totalTimeMinutes(): number | undefined {
        const totalTime =
            (this._prepTimeMinutes || 0) + (this._cookTimeMinutes || 0);
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

export class Ingredient {
    private _name: string;
    private _quantity: number;
    private _unit?: string;
    private _substitutionIds: string[] = [];

    constructor(name: string, quantity: number, unit?: string, substitutionIds: string[] = []) {
        this._name = name;
        this._quantity = quantity;
        this._unit = unit;
        this._substitutionIds = substitutionIds;
    }

    public static fromJSON(json: IngredientJSON): Ingredient {
        // Nulls should be on JSON only. Missing unit should be undefined in the object.
        return new Ingredient(json.name, json.quantity, json.unit ?? undefined);
    }

    public toJSON(): IngredientJSON {
        return {
            name: this._name,
            quantity: this._quantity,
            // Coalesce undefined to null for JSON only
            unit: this._unit ?? null,
            substitutionIds: this._substitutionIds
        };
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

    /**
     * Get this ingredient as a string in the format "quantity (unit? )name", e.g.
     * "1 lb ground beef" or "2 eggs"
     * @returns A string representation of the ingredient in the format "quantity (unit? )name"
     */
    public toString(): string {
        return `${this._quantity} ${this._unit ? this._unit + " " : ""}${this._name}`;
    }
}
